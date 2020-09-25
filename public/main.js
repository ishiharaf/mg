import {DataSet, Network} from "./vis-network.js"

let sessionStorage = window.sessionStorage

const fetchData = async() => {
	try {
		const res = await fetch("/data", {method: "GET"})
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

const checkSource = (el) => {
	if(el.slice(-1) === "]") {
		let sourceStr = {
			firstIndex: el.indexOf("["),
			lastIndex: el.indexOf("]"),
			value: Number(el.substring(firstIndex + 1, lastIndex))
		}
		return sourceStr
	} else {
		return false
	}
}

const assignName = (person) => {
	const nameDiv = document.getElementById("name")
	nameDiv.innerHTML = ""

	nameDiv.innerHTML = `${person.name.first} ${person.name.last}`
}

const assignAlt = (person) => {
	const altDiv = document.getElementById("alt")
	altDiv.innerHTML = ""

	if(person.name.alt.length > 0){
		altDiv.style.paddingBottom = "10px"
		for (let i = 0; i < person.name.alt.length; i++) {
			if(i !== 0) altDiv.innerHTML += `, ${person.name.alt[i]}`
			else altDiv.innerHTML = person.name.alt[i]
		}
	} else {
		altDiv.style.paddingBottom = "0px"
	}
}

const assignBirth = (person) => {
	const birthDiv = document.getElementById("birth")
	birthDiv.innerHTML = ""

	const birthDateNode = document.createElement("span")
	const birthPlaceNode = document.createElement("span")
	const separatorNode = document.createElement("span")
	const deathDateNode = document.createElement("span")
	const deathPlaceNode = document.createElement("span")

	birthDateNode.innerHTML = `${person.dateBirth.yyyy}/${person.dateBirth.mm}/${person.dateBirth.dd} `
	birthPlaceNode.innerHTML = person.placeBirth
	separatorNode.innerHTML = " ~ "
	deathDateNode.innerHTML = `${person.dateDeath.yyyy}/${person.dateDeath.mm}/${person.dateDeath.dd} `
	deathPlaceNode.innerHTML = person.placeDeath

	birthDiv.appendChild(birthDateNode)
	birthDiv.appendChild(birthPlaceNode)
	birthDiv.appendChild(separatorNode)
	birthDiv.appendChild(deathDateNode)
	birthDiv.appendChild(deathPlaceNode)
}

const assignOccupation = (person) => {
	const occupationDiv = document.getElementById("occupation")
	occupationDiv.innerHTML = ""

	for (let i = 0; i < person.group.length; i++) {
		if(i !== 0) occupationDiv.innerHTML += `, ${person.group[i]}`
		else occupationDiv.innerHTML = person.group[i]
	}
}

network.on("click", (params) => {
	if(params.nodes.length > 0) {
		const selId = params.nodes[0]
		console.log(selId)
		const selEdge = params.edges
		let relatedPeople = []

		const selPerson = people.find(people => people.id == selId)
		for (let i = 0; i < selEdge.length; i++) {
			const relatedNode = network.getConnectedNodes(selEdge[i], "to")[1]
			if(relatedNode !== selId) {
				const relatedPerson = people.find(people => people.id == relatedNode)
				const relationship = relatedPerson.relationship
				const relationObj = relationship.find(relationship => relationship.id == selId)
				const personObj = {
					name: `${relatedPerson.name.first} ${relatedPerson.name.last}, ${relationObj.type}`,
					source: {}
				}
				if(relationObj.type.slice(-1) === "]") {
					const firstIndex = relationObj.type.indexOf("[")
					const lastIndex = relationObj.type.indexOf("]")
					personObj.source = relatedPerson.source[Number(relationObj.type.substring(firstIndex + 1, lastIndex))]
				}
				relatedPeople.push(personObj)
			}
		}

		infoDiv.style.display = "block"
		closeCard.style.display = "block"

		assignName(selPerson)
		assignAlt(selPerson)
		assignBirth(selPerson)
		assignOccupation(selPerson)

		const relationDiv = document.getElementById("relation")
		relationDiv.innerHTML = ""
		if(relatedPeople.length > 0) {
			relationDiv.style.paddingBottom = "5px"
			for (let i = 0; i < relatedPeople.length; i++) {
				const node = document.createElement("div")
				node.innerHTML = relatedPeople[i].name
				relationDiv.appendChild(node)
			}
		} else {
			relationDiv.style.paddingBottom = "0px"
		}

		const sourceDiv = document.getElementById("source")
		sourceDiv.innerHTML = ""
		for (let i = 0; i < selPerson.source.length; i++) {
			const citation = document.createElement("div")
			const extract = document.createElement("div")
			citation.innerHTML = selPerson.source[i].citation
			extract.innerHTML = selPerson.source[i].extract
			sourceDiv.appendChild(citation)
			sourceDiv.appendChild(extract)
		}

		imgDiv.innerHTML = ""
		if(selPerson.picture !== "") {
			const imgEl = document.createElement("img")
			imgEl.src = selPerson.picture
			imgEl.alt = `Image of ${selPerson.name.first} ${selPerson.name.last}`
			imgDiv.appendChild(imgEl)

			const total = Math.floor(infoDiv.clientWidth / 2) - 15
			imgDiv.style.right = `${total}px`
			imgDiv.style.display = "block"

			closeCard.style.top = "78px"
			infoDiv.style.top = "80px"
			nameDiv.style.paddingTop = "20px"
		} else {
			imgDiv.style.display = "none"
			closeCard.style.top = "33px"
			infoCard.style.top = "35px"
			nameDiv.style.paddingTop = "0px"
		}
	}
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