const { Pool } = require('pg')
const abstraction = require("./query")

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'parabible',
    password: 'toor',
    port: 5432,
})

console.log("connected...")

// SAMPLE FROM REAL USAGE
const queryTerms = [{
    "uid": "1532057245287",
    "inverted": false,
    "data": {
        "_voc_utf8": "אֱלֹהִים"
    }
}, {
    "uid": "1532057248630",
    "inverted": false,
    "data": {
        "_voc_utf8": "טוב"
    }
}, {
    "uid": "1532057251924",
    "inverted": false,
    "data": {
        "_voc_utf8": "ראה"
    }
}]

console.time("b")
abstraction.query({
    tree_node: "_sentence_node",
    db: pool,
    query_terms: queryTerms
}).then(response => {
	const first_few = response.slice(0, 10)
	const first_few_nodes = first_few.map(x => x.tree_node).toString()
	const q = `
	SELECT nid, wids
	FROM tree_node_index
	WHERE
		nid IN (${first_few_nodes})
	AND
		node_type = '_sentence_node'`
	console.log(q)
	pool.query(q, (err, results) => {
		if (err) {
			console.log(err)
		}
		else {
			results.rows.forEach(r => {
				const nid_str = r.nid.toString()
				const index = first_few.findIndex(x => x.tree_node === nid_str)
				first_few[index].node_wids = r.wids
			})
			console.timeEnd("b")
			console.log(first_few)
		}
	})
}).catch(e => {
    console.log("Error:\n", e)
})
