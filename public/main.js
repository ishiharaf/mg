import {DataSet, Network} from "./vis-network.js"

let sessionStorage = window.sessionStorage

const fetchData = async() => {
	try {
		const res = await fetch("/data", {method: "POST"})
		return res.json()
	} catch(error) {
		console.log(error)
	}
}

window.onload = async() => {
	const people = await fetchData()
	const color = {
		"black": "50514f",
		"white": "f9f9f9",
		"red": "be301a",
		"pink": "ffc2d4",
		"green": "aad576",
		"blue": "386fa4",
		"gray": "d3d3d3"
	}

	sessionStorage.setItem("people", JSON.stringify(people))
	sessionStorage.setItem("color", JSON.stringify(color))
}

const people = JSON.parse(sessionStorage.getItem("people"))
const color = JSON.parse(sessionStorage.getItem("color"))
const palette = {
	imp: {
		border: "#be301a",
		background: "#be301a",
		highlight: {
			border: "#f25f5c",
			background: "#f25f5c"
		}
	},
	mus: {
		border: "#386fa4",
		background: "#386fa4",
		highlight: {
			border: "#59a5d8",
			background: "#59a5d8"
		}
	},
	reg: {
		border: "#625556",
		background: "#625556",
		highlight: {
			border: "#b0abac",
			background: "#b0abac"
		}
	},
	roy: {
		border: "#679436",
		background: "#679436",
		highlight: {
			border: "#8cb369",
			background: "#8cb369"
		}
	}
}

const options = {
	edges: {
		smooth: {
			enabled: true,
			type: "horizontal",
			forceDirection: "vertical",
			roundness: 0.5
		},
		arrows: {
			to: {
				enabled: true
			}
		},
		physics: false
	},
	nodes: {
		font: {
			color: `#${color.white}`
		},
		shape: "box",
		shapeProperties: {
			borderRadius: 0
		}
	},
	layout: {
		hierarchical: {
			enabled: true,
			direction: "UD",
			levelSeparation: 10,
			sortMethod: "hubsize"
			// shakeTowards: "leaves"
		}
	},
	physics:{
		enabled: true
	}
}
let nodes = new DataSet()
let edges = new DataSet()

for (let item = 0; item < people.length; item++) {
	const el = people[item]
	let dateBirth
	if(el.dateBirth.yyyy.substring(0, 1) === "c") {
		dateBirth = el.dateBirth.yyyy.substring(1)
	} else {
		dateBirth = el.dateBirth.yyyy
	}
	nodes.add({
		id: el.id,
		label: el.name.last,
		title: `${el.name.first} ${el.name.last}`,
		level: Number(dateBirth),
		color: palette[el.color]
	})
	const relation = el.relationship
	for (let parent = 0; parent < relation.length; parent++) {
		if (relation[parent].id !== "") {
			edges.add({
				from: relation[parent].id,
				to: el.id,
				color: `#${color[relation[parent].color]}`
			})
		}
	}
}

const container = document.getElementById("network")
const data = {
	nodes: nodes,
	edges: edges
}
const network = new Network(container, data, options)
const closeHelp = document.getElementById("closeHelp")
const helpText = document.getElementById("helpText")
const helpLegend = document.getElementById("helpLegend")
const helpButton = document.getElementById("help")
const closeCard = document.getElementById("closeCard")
const infoDiv = document.getElementById("infoCard")
const imgDiv = document.getElementById("image")

network.on("click", (params) => {
	infoDiv.style.display = "block"
	closeCard.style.display = "block"
})

helpButton.addEventListener("click", () => {
	helpButton.style.display = "none"
	helpText.style.display = "block"
	helpLegend.style.display = "block"
	closeHelp.style.display = "block"
})
closeHelp.addEventListener("click", () => {
	helpButton.style.display = "block"
	helpText.style.display = "none"
	helpLegend.style.display = "none"
	closeHelp.style.display = "none"
})
closeCard.addEventListener("click", () => {
	imgDiv.style.display = "none"
	infoDiv.style.display = "none"
	closeCard.style.display = "none"
})
imgDiv.addEventListener("click", () => {
	const imgSrc = imgDiv.lastChild.src
	window.open(imgSrc)
})