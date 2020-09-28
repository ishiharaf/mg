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
			levelSeparation: 25,
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

	let lastName
	if(el.name.last.slice(-1) === "]") {
		const firstIndex = el.name.last.indexOf("[")
		lastName = el.name.last.substring(0, firstIndex - 1)
	} else {
		lastName = el.name.last
	}

	let dateBirth
	if(el.dateBirth.yyyy.substring(0, 1) === "c") {
		dateBirth = el.dateBirth.yyyy.substring(1)
	} else {
		dateBirth = el.dateBirth.yyyy
	}

	nodes.add({
		id: el.id,
		label: lastName,
		title: `${el.name.first} ${lastName}`,
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
const sourceDiv = document.getElementById("sourceCard")

const openSource = (sourceId) => {
	const personId = infoDiv.getAttribute("data-id")
	const selPerson = people.find(people => people.id == personId)
	const cardWidth = Math.floor(infoDiv.clientWidth) + 40

	const citationDiv = document.getElementById("citation")
	citationDiv.innerHTML = ""
	citationDiv.innerHTML = selPerson.source[sourceId - 1].citation

	const extractDiv = document.getElementById("extract")
	extractDiv.innerHTML = ""
	extractDiv.innerHTML = selPerson.source[sourceId - 1].extract
	if (extractDiv.innerHTML !== "") extractDiv.style.marginTop = "10px"

	sourceDiv.style.display = "block"
	sourceDiv.style.right = `${cardWidth}px`
	if(imgDiv.innerHTML !== "") {
		sourceDiv.style.top = "80px"
	} else {
		sourceDiv.style.top = "35px"
	}
}

const checkSource = (el) => {
	if(el.slice(-1) === "]") {
		const firstIndex = el.indexOf("[")
		const lastIndex = el.indexOf("]")
		const sourceStr = el.substring(0, firstIndex - 1)
		const sourceVal = Number(el.substring(firstIndex + 1, lastIndex))
		const sourceNode = document.createElement("sup")
		sourceNode.innerHTML = "?"
		sourceNode.className = "source"
		sourceNode.addEventListener("click", () => {
			openSource(sourceVal)
		})
		const source = {
			string: sourceStr,
			value: sourceVal - 1,
			node: sourceNode
		}
		return source
	} else {
		return false
	}
}

const getRelated = (id, edge) => {
	let relPeople = []

	for (let i = 0; i < edge.length; i++) {
		const relNode = network.getConnectedNodes(edge[i], "to")[1]
		if(relNode !== id) {
			const relPerson = people.find(people => people.id == relNode)
			const relationship = relPerson.relationship
			const relObject = relationship.find(relationship => relationship.id == id)

			let lastName
			if(relPerson.name.last.slice(-1) === "]") {
				const firstIndex = relPerson.name.last.indexOf("[")
				lastName = relPerson.name.last.substring(0, firstIndex - 1)
			} else {
				lastName = relPerson.name.last
			}

			const personObj = {
				name: "",
				source: []
			}
			const source = checkSource(relObject.type)
			if(source !== false) {
				personObj.name = `${relPerson.name.first} ${lastName}, ${source.string}`
				personObj.source.push(relPerson.source[source.value])
			} else {
				personObj.name = `${relPerson.name.first} ${lastName}, ${relObject.type}`
			}
			relPeople.push(personObj)
		}
	}

	return relPeople
}

const assignName = (person) => {
	const nameDiv = document.getElementById("name")
	nameDiv.innerHTML = ""

	const personName = `${person.name.first} ${person.name.last}`
	const source = checkSource(personName)
	if(source !== false) {
		const nameNode = document.createElement("span")
		nameNode.innerHTML = `${source.string}`
		nameDiv.appendChild(nameNode)
		nameDiv.appendChild(source.node)
	} else {
		nameDiv.innerHTML = `${person.name.first} ${person.name.last}`
	}
}

const assignAlt = (person) => {
	const altDiv = document.getElementById("alt")
	altDiv.innerHTML = ""

	if(person.name.alt.length > 0){
		altDiv.style.paddingBottom = "10px"
		for (let i = 0; i < person.name.alt.length; i++) {
			const altNode = document.createElement("span")
			const altName = person.name.alt[i]
			const source = checkSource(altName)
			if(source !== false) {
				if(i !== 0) altNode.innerHTML = `, ${source.string}`
				else altNode.innerHTML = source.string
				altDiv.appendChild(altNode)
				altDiv.appendChild(source.node)
			} else {
				if(i !== 0) altNode.innerHTML = `, ${altName}`
				else altNode.innerHTML = altName
				altDiv.appendChild(altNode)
			}
		}
	} else {
		altDiv.style.paddingBottom = "0px"
	}
}

const assignBirth = (person) => {
	const birthDiv = document.getElementById("birth")
	birthDiv.innerHTML = ""

	const birthStr = [
		`${person.dateBirth.yyyy}/${person.dateBirth.mm}/${person.dateBirth.dd}`,
		` ${person.placeBirth}`,
		" ~ ",
		`${person.dateDeath.yyyy}/${person.dateDeath.mm}/${person.dateDeath.dd}`,
		` ${person.placeDeath}`
	]
	for (let i = 0; i < birthStr.length; i++) {
		const birthNode = document.createElement("span")
		const source = checkSource(birthStr[i])
		if(source !== false) {
			birthNode.innerHTML = source.string
			birthDiv.appendChild(birthNode)
			birthDiv.appendChild(source.node)
		} else {
			birthNode.innerHTML = birthStr[i]
			birthDiv.appendChild(birthNode)
		}
	}
}

const assignOccupation = (person) => {
	const occupationDiv = document.getElementById("occupation")
	occupationDiv.innerHTML = ""

	for (let i = 0; i < person.group.length; i++) {
		const occNode = document.createElement("span")
		const occName = person.group[i]
		const source = checkSource(occName)
		if(source !== false) {
			if(i !== 0) occNode.innerHTML = `, ${source.string}`
			else occNode.innerHTML = source.string
			occupationDiv.appendChild(occNode)
			occupationDiv.appendChild(source.node)
		} else {
			if(i !== 0) occNode.innerHTML += `, ${occName}`
			else occNode.innerHTML = occName
			occupationDiv.appendChild(occNode)
		}
	}
}

const assignRelation = (person, people) => {
	const relationDiv = document.getElementById("relation")
	relationDiv.innerHTML = ""

	console.log(people)
	if(people.length > 0) {
		relationDiv.style.paddingBottom = "5px"
		for (let i = 0; i < people.length; i++) {
			const personNode = document.createElement("div")
			const relNode = document.createElement("span")
			relNode.innerHTML = people[i].name

			if(people[i].source.length > 0) {
				const index = person.source.length + 1
				person.source.push(people[i].source[0])

				const sourceNode = document.createElement("span")
				sourceNode.innerHTML = "?"
				sourceNode.className = "source"
				sourceNode.addEventListener("click", () => {
					openSource(index)
				})

				personNode.appendChild(relNode)
				personNode.appendChild(sourceNode)
			} else {
				personNode.appendChild(relNode)
			}

			relationDiv.appendChild(personNode)
		}
	} else {
		relationDiv.style.paddingBottom = "0px"
	}
}

const assignImg = (person) => {
	const nameDiv = document.getElementById("name")
	imgDiv.innerHTML = ""

	if(person.picture !== "") {
		const imgEl = document.createElement("img")
		imgEl.src = person.picture
		imgEl.alt = `Image of ${nameDiv.innerHTML}`
		imgDiv.appendChild(imgEl)

		const cardWidth = Math.floor(infoDiv.clientWidth / 2) - 15
		imgDiv.style.right = `${cardWidth}px`
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

network.on("click", (params) => {
	if(params.nodes.length > 0) {
		const selId = params.nodes[0]
		const selEdge = params.edges
		const selPerson = people.find(people => people.id == selId)
		const relatedPeople = getRelated(selId, selEdge)

		sourceDiv.style.display = "none"
		infoDiv.setAttribute("data-id", selId)
		infoDiv.style.display = "block"
		closeCard.style.display = "block"

		assignName(selPerson)
		assignAlt(selPerson)
		assignBirth(selPerson)
		assignOccupation(selPerson)
		assignRelation(selPerson, relatedPeople)
		assignImg(selPerson)
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
	sourceDiv.style.display = "none"
})
imgDiv.addEventListener("click", () => {
	const imgSrc = imgDiv.lastChild.src
	window.open(imgSrc)
})