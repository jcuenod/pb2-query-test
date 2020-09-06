// const fs = require("fs")
// const set_cover_sql = fs.readFileSync("./is_set_cover_possible.sql", 'utf8')
// pool.query(set_cover_sql, (err, results) => {
// 	if (err) {
// 		console.log("FAIL: is_set_cover_possible.sql")
// 		console.log(err)
// 	}
// 	else {
// 		console.log("SUCCESS: is_set_cover_possible.sql")
// 		console.log(results)
// 	}
// })


const availableKeys = new Set(["_sp", "_vs", "_vt", "_voc_utf8", "_tricons", "_gn", "_nu", "_lxxlexeme"])
const verify = key => availableKeys.has(key)
const keysAreValid = keys => keys.reduce((a, v, i) => a && verify(v), true)
const validateKeysOrThrow = keys => {
    if (keysAreValid(keys)) return true
    console.log(keys)
    throw new Exception("Invalid key, you can't just feed in whatever you want, you know...")
}

const singleTermWith = tree_node_type => termQuery => {
    const termKeys = Object.keys(termQuery)
    validateKeysOrThrow(termKeys)
    const featureIntersection = termKeys.map((k, i) => `f${i}.wids`).join(" & ")
    const fromClause = termKeys.map((k, i) =>
        `feature_index AS f${i}`
    ).join(",\n\t\t\t\t\t")
    const whereClause = termKeys.map((k, i) =>
        `f${i}.feature = '${k}' AND f${i}.value = '${termQuery[k]}'`
    ).join(" AND ")
    return `(
		SELECT
			array_agg(wid_list.wid) AS wid,
			word_features.${tree_node_type} AS tree_node
		FROM (
				SELECT
					UNNEST(${featureIntersection}) AS wid
				FROM
					${fromClause}
				WHERE
					${whereClause}
			) AS wid_list,
			word_features
		WHERE
			wid_list.wid = word_features.wid
		GROUP BY
			tree_node)`
}
const invertedSingleTermWith = tree_node_type => termQuery => {
    const termKeys = Object.keys(termQuery)
    validateKeysOrThrow(termKeys)
    const featureIntersection = termKeys.map((k, i) => `f${i}.wids`).join(" & ")
    const fromClause = termKeys.map((k, i) =>
        `feature_index AS f${i}`
    ).join(",\n\t\t\t\t\t")
    const whereClause = termKeys.map((k, i) =>
        `f${i}.feature = '${k}' AND f${i}.value = '${termQuery[k]}'`
    ).join(" AND ")
    return `(
		SELECT
			word_features.${tree_node_type} AS inverted_tree_node_array
		FROM (
				SELECT
					UNNEST(${featureIntersection}) AS wid
				FROM
					${fromClause}
				WHERE
					${whereClause}
			) AS wid_list,
			word_features
		WHERE
			wid_list.wid = word_features.wid)`
}

const groupedWith = (queries, tree_node_type) => {
    const { termQueries, invertedTermQueries } = queries.reduce((a, v, i) => {
        if ("inverted" in v && v.inverted) {
            a.invertedTermQueries.push(v.data)
        }
        else {
            a.termQueries.push(v.data)
        }
        return a
    }, { termQueries: [], invertedTermQueries: [] })
    if (termQueries.length === 0) {
        throw new Exception("You have to look for something - can't just search for inversions")
    }

    const withs = termQueries
        .map(singleTermWith(tree_node_type))
        .map((k, i) => `w${i} AS ${k}`)
        .join(",\n\t")
    const invertedWiths = invertedTermQueries
        .map(invertedSingleTermWith(tree_node_type))
        .map((k, i) => `\n\twi${i} AS ${k}`)
        .join(",")

    const selectClause = termQueries
        .map((k, i) => `w${i}.wid AS wid_${i}`)
        .join(",\n\t")

    const fromClause = termQueries
        .map((k, i) => `w${i}`)
        //		.concat(invertedTermQueries.map((k, i) => `wi${i}`))
        .join(", ")

    const whereSameTreeNode = termQueries.slice(1).map((k, i) =>
        `w0.tree_node = w${i + 1}.tree_node`
    ).join(" AND ")

    const whereTreeNodeNotInverted = invertedTermQueries
        .map((k, i) => `w0.tree_node NOT IN (SELECT inverted_tree_node_array FROM wi${i})`)
        .join(" AND ")

    // const uniqueToLower = n => [...Array(n)].map((k, i) =>
    // 	`w${n}.wid != w${i}.wid`
    // ).join(" AND ")
    // const whereUniqueWids = termQueries.slice(1).map((k, i) =>
    // 	uniqueToLower(i + 1)
    // ).join(" AND ")
    const whereUniqueWids = "is_set_cover_possible(" + termQueries.map((k, i) => `w${i}.wid`).join(", ") + ")"

    const whereClauseItems = []
    if (termQueries.length > 1) {
        whereClauseItems.push(whereUniqueWids, whereSameTreeNode)
    }
    if (invertedTermQueries.length > 0) {
        whereClauseItems.push(whereTreeNodeNotInverted)
    }
    const whereClause = whereClauseItems.length ? "WHERE\n\t" + whereClauseItems.join("\nAND\n\t") : ""

    return `
WITH
	${withs}${invertedWiths.length > 0 ? "," + invertedWiths : ""}

SELECT
	w0.tree_node,
	${selectClause}

FROM
	${fromClause}

${whereClause}`
}


module.exports = {
    query: ({ tree_node, db, query_terms }) => new Promise((resolve, reject) => {
        const tree_node_or_default = tree_node || "_sentence_node"
        const q = groupedWith(query_terms, tree_node_or_default)
        console.log(q)
        console.time("benchmark")
        db.query(q, (err, results) => {
            console.timeEnd("benchmark")
            if (err) {
                // console.error("oh no...", err)
                reject(err)
            }
            else {
                // console.log(results.rows.slice(0,1))
                // console.log("RESULT LENGTH:", results.rows.length)
                resolve(results.rows)
            }
        })
    })
}