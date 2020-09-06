
// const queryTerms = [
// 	{"_gn":"m", invert: true},
// 	{"_vs":"qal", invert: true},
// 	{"_vt":"perf"}
// ]

// With inversion
// const queryTerms = [{
// 	"_vt": "impv",
// 	"_vs": "piel",
// }, {
// 	"_voc_utf8": "שׁלח",
// 	"invert": true
// }]

// Simple example
// const queryTerms = [{
// 	"_vt": "impv",
// 	"_vs": "piel",
// }, {
// 	"_voc_utf8": "אֶל",
// }]

// const queryTerms = [{
// 	"uid":"1532057251924",
// 	"inverted":false,
// 	"data": {
// 		"_voc_utf8": "דְּרֹור",
// 	}
// },{
// 	"uid":"1532057251924",
// 	"inverted":false,
// 	"data": {
// 		"_gn": "f",
// 		"_nu": "pl",
// 	}
// }, {
// 	"uid":"1532057251925",
// 	"inverted":false,
// 	"data": {
// 		"_sp": "subs"
// 	}
// }]

// const queryTerms = [{
// 	"uid":"1532057251924",
// 	"inverted":false,
// 	"data": {
// 		"_voc_utf8": "אמר",
// 	}
// },{
// 	"uid":"1532057251924",
// 	"inverted":false,
// 	"data": {
// 		"_voc_utf8": "לְ",
// 	}
// },{
// 	"uid":"1532057251924",
// 	"inverted":false,
// 	"data": {
// 		"_voc_utf8": "דבר",
// 	}
// }]



// A typical use case
// const queryTerms = [{
// 	"_voc_utf8": "דְּרֹור",
// }, {
// 	"_voc_utf8": "קרא",
// 	"_vs": "qal",
// }]
// const queryTerms = [{
// 	"uid":"1532057251924",
// 	"inverted":false,
// 	"data": {
// 		"_voc_utf8": "דְּרֹור",
// 	}
// }, {
// 	"uid":"1532057251925",
// 	"inverted":false,
// 	"data": {
// 		"_voc_utf8": "קרא",
// 		"_vs": "qal"
// 	}
// }]

// // A worst case (if you do this search for sentences, it crashes)
// const queryTerms = [{
// 	"uid":"1532057251924",
// 	"inverted":false,
// 	"data": {
// 		"_sp": "verb",
// 	}
// }, {
// 	"uid":"1532057251925",
// 	"inverted":false,
// 	"data": {
// 		"_sp": "conj",
// 	}
// }, {
// 	"uid":"1532057251926",
// 	"inverted":false,
// 	"data": {
// 		"_sp": "subs",
// 	}
// }, {
// 	"uid":"1532057251927",
// 	"inverted":false,
// 	"data": {
// 		"_sp": "prep",
// 	}
// }, {
// 	"uid":"1532057251928",
// 	"inverted":false,
// 	"data": {
// 		"_sp": "subs",
// 	}
// }, {
// 	"uid":"1532057251926",
// 	"inverted":false,
// 	"data": {
// 		"_sp": "subs",
// 	}
// }, {
// 	"uid":"1532057251927",
// 	"inverted":false,
// 	"data": {
// 		"_sp": "prep",
// 	}
// }, {
// 	"uid":"1532057251928",
// 	"inverted":false,
// 	"data": {
// 		"_sp": "subs",
// 	}
// }]