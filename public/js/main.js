import {DataSet, Network} from "../lib/vis-network.js"

let network
let people
let nodes
let nodeData
let edges
let edgeData
let edgeColor = {}
let highlight = false
const sessionStorage = window.sessionStorage

const color = {
	black: "50514f",
	white: "f9f9f9",
	red: "be301a",
	pink: "ffc2d4",
	green: "aad576",
	blue: "386fa4",
	gray: "d3d3d3"
}
const palette = {
	imp: {
		background: "#be301a",
		highlight: {
			background: "#f25f5c"
		},
		opacity: 1
	},
	mus: {
		background: "#386fa4",
		highlight: {
			background: "#59a5d8"
		},
		opacity: 1
	},
	reg: {
		background: "#625556",
		highlight: {
			background: "#b0abac"
		},
		opacity: 1
	},
	roy: {
		background: "#679436",
		highlight: {
			background: "#8cb369"
		},
		opacity: 1
	}
}
const defaultLayout = {
	hierarchical: {
		enabled: true,
		direction: "UD",
		levelSeparation: 21,
		treeSpacing: 100,
		sortMethod: "hubsize"
	}
}

const defaultArrows = {
	enabled: true,
	type: "horizontal",
	forceDirection: "vertical",
	roundness: 0.5
}

const drawNetwork = (userLayout, userArrows) => {
	const options = {
		edges: {
			arrowStrikethrough: false,
			arrows: {
				to: {
					enabled: true
				}
			},
			smooth: userArrows,
			physics: false,
			selectionWidth: 2,
			width: 2
		},
		nodes: {
			borderWidth: 0,
			borderWidthSelected: 0,
			font: {
				face: "Cambria",
				color: `#${color.white}`,
				size: 25
			},
			shape: "box",
			shapeProperties: {
				borderRadius: 0
			}
		},
		layout: userLayout,
		physics:{
			enabled: true
		}
	}
	nodes = new DataSet()
	edges = new DataSet()
	people = JSON.parse(sessionStorage.getItem("people"))

	for (let i = 0; i < people.length; i++) {
		const person = people[i]

		let lastName
		if(person.name.last.slice(-1) === "]") {
			const firstIndex = person.name.last.indexOf("[")
			lastName = person.name.last.substring(0, firstIndex - 1)
		} else {
			lastName = person.name.last
		}

		let dateBirth
		if(person.dateBirth.yyyy.substring(0, 1) === "c") {
			dateBirth = person.dateBirth.yyyy.substring(1)
		} else {
			dateBirth = person.dateBirth.yyyy
		}

		nodes.add({
			id: person.id,
			label: lastName,
			hiddenLabel: lastName,
			title: `${person.name.first} ${lastName}`,
			level: Number(dateBirth),
			color: palette[person.color]
		})

		const relation = person.relationship
		for (let parent = 0; parent < relation.length; parent++) {
			if (relation[parent].id !== "") {
				edges.add({
					from: relation[parent].id,
					to: person.id,
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

	nodeData = nodes.get({returnType: "Object"})
	edgeData = edges.get({returnType: "Object"})
	for (let edgeId in edgeData) {
		edgeColor[edgeId] = edgeData[edgeId].color
	}

	network = new Network(container, data, options)
	network.on("click", openInfoCard)
}

const filterSection = document.getElementById("filter")
const filterButton = document.getElementById("filterBtn")
const closeFilter = document.getElementById("closeFilter")
const searchButton = document.getElementById("searchBtn")

const configSection = document.getElementById("config")
const configButton = document.getElementById("configBtn")
const closeConfig = document.getElementById("closeConfig")
const hierarchyButton = document.getElementById("hierarchyBtn")
const randomButton = document.getElementById("randomBtn")
const hierarchySection = document.getElementById("hierarchyLayout")
const randomSection = document.getElementById("randomLayout")
const saveButton = document.getElementById("saveConfig")

const helpSection = document.getElementById("help")
const helpButton = document.getElementById("helpBtn")
const closeHelp = document.getElementById("closeHelp")

const infoSection = document.getElementById("info")
const imageDiv = document.getElementById("image")
const infoCard = document.getElementById("infoCard")
const closeInfo = document.getElementById("closeInfo")

const sourceCard = document.getElementById("sourceCard")

const openSource = (sourceId) => {
	const personId = infoCard.getAttribute("data-id")
	const selPerson = people.find(people => people.id == personId)
	const cardWidth = Math.floor(infoCard.clientWidth) + 40

	const citationDiv = document.getElementById("citation")
	citationDiv.innerHTML = ""
	citationDiv.innerHTML = selPerson.source[sourceId - 1].citation

	const extractDiv = document.getElementById("extract")
	extractDiv.innerHTML = ""
	extractDiv.innerHTML = selPerson.source[sourceId - 1].extract
	if (extractDiv.innerHTML !== "") extractDiv.style.marginTop = "10px"

	sourceCard.style.display = "block"
	sourceCard.style.right = `${cardWidth}px`
	if(imageDiv.innerHTML !== "") {
		sourceCard.style.top = "80px"
	} else {
		sourceCard.style.top = "35px"
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
	imageDiv.innerHTML = ""

	if(person.picture !== "") {
		const imgEl = document.createElement("img")
		imgEl.src = person.picture
		imgEl.alt = `Image of ${nameDiv.innerHTML}`
		imageDiv.appendChild(imgEl)

		const cardWidth = Math.floor(infoCard.clientWidth / 2) - 15
		imageDiv.style.right = `${cardWidth}px`
		imageDiv.style.display = "block"

		closeInfo.style.top = "78px"
		infoCard.style.top = "80px"
		nameDiv.style.paddingTop = "20px"
	} else {
		imageDiv.style.display = "none"
		closeInfo.style.top = "33px"
		infoCard.style.top = "35px"
		nameDiv.style.paddingTop = "0px"
	}
}

const highlightRel = (selId, selLen) => {
	if(selLen > 0) {
		const relNodes = network.getConnectedNodes(selId)
		let allRelNodes = relNodes
		let allRelEdges = []
		let degrees = 2
		highlight = true

		for (let nodeId in nodeData) {
			nodeData[nodeId].opacity = 0.3
			nodeData[nodeId].label = undefined
		}
		for (let edgeId in edgeData) {
			edgeData[edgeId].color = {
				color: edgeColor[edgeId],
				opacity: 0.3
			}
			edgeData[edgeId].width = 1
		}

		for (let i = 1; i < degrees; i++) {
			allRelNodes.forEach(node => {
				allRelNodes = allRelNodes.concat(
					network.getConnectedNodes(node)
					)
				allRelEdges = allRelEdges.concat(
					network.getConnectedEdges(node, "from")
				)
			})
		}

		allRelNodes = Array.from(new Set(allRelNodes))
		allRelEdges = Array.from(new Set(allRelEdges))

		for (let i = 0; i < relNodes.length; i++) {
			nodeData[relNodes[i]].opacity = 1
			nodeData[relNodes[i]].label = nodeData[relNodes[i]].hiddenLabel
		}

		for (let i = 0; i < allRelNodes.length; i++) {
			nodeData[allRelNodes[i]].opacity = 1
			nodeData[allRelNodes[i]].label = nodeData[allRelNodes[i]].hiddenLabel
		}
		for (let i = 0; i < allRelEdges.length; i++) {
			edgeData[allRelEdges[i]].color = edgeColor[allRelEdges[i]]
			edgeData[allRelEdges[i]].width = 2
		}

		network.selectEdges(allRelEdges)
		nodeData[selId].opacity = 1
		nodeData[selId].label = nodeData[selId].hiddenLabel

	} else {
		for (let nodeId in nodeData) {
			nodeData[nodeId].opacity = 1
			nodeData[nodeId].label = nodeData[nodeId].hiddenLabel
		}
		for (let edgeId in edgeData) {
			edgeData[edgeId].color = edgeColor[edgeId]
			edgeData[edgeId].width = 2
		}
		highlight = false
		network.unselectAll()
	}

	let updateNodes = []
	for (let nodeId in nodeData) {
		if (nodeData.hasOwnProperty(nodeId)) {
			updateNodes.push(nodeData[nodeId])
		}
	}
	let updateEdges = []
	for (let edgeId in edgeData) {
		if (edgeData.hasOwnProperty(edgeId)) {
			updateEdges.push(edgeData[edgeId])
		}
	}
	nodes.update(updateNodes)
	edges.update(updateEdges)
}

const highlightResult = (selNodes) => {
	highlight = true

	let updateNodes = []
	for (let nodeId in nodeData) {
		nodeData[nodeId].opacity = 0.3
		nodeData[nodeId].label = undefined
		updateNodes.push(nodeData[nodeId])
	}

	let updateEdges = []
	for (let edgeId in edgeData) {
		edgeData[edgeId].color = {
			color: edgeColor[edgeId],
			opacity: 0.3
		}
		edgeData[edgeId].width = 1
		updateEdges.push(edgeData[edgeId])
	}

	for (let i = 0; i < selNodes.length; i++) {
		nodeData[selNodes[i]].opacity = 1
		nodeData[selNodes[i]].label = nodeData[selNodes[i]].hiddenLabel
	}

	network.selectNodes(selNodes, false)
	nodes.update(updateNodes)
	edges.update(updateEdges)
}

const getArrows = () => {
	const arrowType = String(document.getElementById("arrowTypeSel").value)
	const forceDirection = String(document.getElementById("forceDirectionSel").value)
	const roundness = Number(document.getElementById("roundnessBox").value) || 0.5

	const arrows = {
		enabled: true,
		type: arrowType,
		forceDirection: forceDirection,
		roundness: roundness
	}

	return arrows
}

const getRandom = () => {
	const currentSeedBox = document.getElementById("currentSeedBox")
	const currentSeed = network.getSeed()
	currentSeedBox.value = currentSeed || ""

	const userSeedBox = document.getElementById("userSeedBox")
	const userSeed = userSeedBox.value || undefined

	const layout = {
		hierarchical: false,
		improvedLayout: false,
		randomSeed: userSeed
	}

	return layout
}

const getHierarchy = () => {
	const levelSeparation = Number(document.getElementById("levelSeparationBox").value) || 21
	const treeSpacing = Number(document.getElementById("treeSpacingBox").value) || 100
	const direction = String(document.getElementById("directionSel").value)

	const layout = {
		hierarchical: {
			enabled: true,
			direction: direction,
			levelSeparation: levelSeparation,
			treeSpacing: treeSpacing
		}
	}

	return layout
}

const getResult = () => {
	const nameFilter = String(document.getElementById("nameFilterBox").value)
	const placeFilter = String(document.getElementById("birthPlaceFilterBox").value)
	const dateFilter = String(document.getElementById("birthDateFilterBox").value)

	const nameRegExp = new RegExp(nameFilter, "ig")
	const placeRegExp = new RegExp(placeFilter, "ig")
	let dateRegExp

	if(dateFilter.substring(0, 1) === "c") {
		const year = Number(dateFilter.substring(1, 5))
		const rangeStart = String(year - 10).substring(0, 3)
		const rangeEnd = String(year).substring(0, 3)
		const yearRange = `${rangeStart}[0-9]|${rangeEnd}[0-9]|${year + 10}`

		dateRegExp = new RegExp(`${yearRange}`, "ig")

	} else if(dateFilter.substring(4, 5) === "-" || dateFilter.substring(4, 5) === "~") {
		let yearStart = Number(dateFilter.substring(0, 4))
		let yearEnd = Number(dateFilter.substring(5, 9))
		let yearRange = ""

		if(yearStart > yearEnd) {
			const yearSwap = yearStart
			yearStart = yearEnd
			yearEnd = yearSwap
		}

		for (let year = yearStart; year < yearEnd; year += 10) {
			if(year === yearStart) {
				if(String(year).substring(3, 4) === "9") {
					yearRange += `${String(year)}|`
				} else {
					yearRange += `${String(year).substring(0, 3)}[${String(year).substring(3, 4)}-9]|`
				}
			} else if(year + 10 > yearEnd || year + 10 === yearEnd) {
				if(String(yearEnd).substring(3, 4) === "0") {
					yearRange += `${String(year).substring(0, 3)}[0-9]|`
					yearRange += String(yearEnd)
				} else {
					yearRange += `${String(year).substring(0, 3)}[0-${String(yearEnd).substring(3, 4)}]`
				}
			} else {
				yearRange += `${String(year).substring(0, 3)}[0-9]|`
			}
		}

		dateRegExp = new RegExp(`${yearRange}`, "ig")

	} else {
		dateRegExp = new RegExp(dateFilter, "ig")
	}

	let matchAll = []

	for (let i = 0; i < people.length; i++) {
		const person = people[i]
		const id = person.id
		const name = `${person.name.first} ${person.name.last}`
		const place = person.placeBirth
		const date = person.dateBirth.yyyy

		if(nameFilter !== "") {
			if(name.match(nameRegExp)) matchAll.push(id)
		}
		if(placeFilter !== "") {
			if(place.match(placeRegExp)) matchAll.push(id)
		}
		if(dateFilter !== "") {
			if(date.match(dateRegExp)) matchAll.push(id)
		}
	}

	const result = Array.from(new Set(matchAll))
	return result
}

const setDefaultConfig = () => {
	const currentSeedBox = document.getElementById("currentSeedBox")
	const userSeedBox = document.getElementById("userSeedBox")

	const arrowType = document.getElementById("arrowTypeSel")
	const forceDirection = document.getElementById("forceDirectionSel")
	const roundness = document.getElementById("roundnessBox")

	const levelSeparation = document.getElementById("levelSeparationBox")
	const treeSpacing = document.getElementById("treeSpacingBox")
	const direction = document.getElementById("directionSel")

	const nameFilter = document.getElementById("nameFilterBox")
	const placeFilter = document.getElementById("birthPlaceFilterBox")
	const dateFilter = document.getElementById("birthDateFilterBox")

	currentSeedBox.value = ""
	userSeedBox.value = ""

	arrowType.value = "horizontal"
	forceDirection.value = "vertical"
	roundness.value = "0.5"

	levelSeparation.value = 21
	treeSpacing.value = 100
	direction.value = "UD"

	nameFilter.value = ""
	placeFilter.value = ""
	dateFilter.value = ""

	hierarchyButton.checked = true
}

const closeInfoCard = () => {
	imageDiv.style.display = "none"
	infoSection.style.display = "none"
	sourceCard.style.display = "none"
	highlightRel(0, 0)
}

const closeConfigCard = () => {
	configSection.style.display = "none"
}

const closeHelpCard = () => {
	helpSection.style.display = "none"
}

const closeFilterCard = () => {
	filterSection.style.display = "none"
}

const openInfoCard = (params) => {
	if(params.nodes.length > 0) {
		const selId = params.nodes[0]
		const selEdge = params.edges
		const selPerson = people.find(people => people.id == selId)
		const relatedPeople = getRelated(selId, selEdge)

		closeFilterCard()
		closeHelpCard()
		closeConfigCard()
		sourceCard.style.display = "none"
		infoSection.style.display = "block"
		infoCard.setAttribute("data-id", selId)

		assignName(selPerson)
		assignAlt(selPerson)
		assignBirth(selPerson)
		assignOccupation(selPerson)
		assignRelation(selPerson, relatedPeople)
		assignImg(selPerson)

		if(highlight === false) {
			highlightRel(selId, params.nodes.length)
		} else {
			highlightRel(0, 0)
			highlightRel(selId, params.nodes.length)
		}
	} else {
		closeInfoCard()
	}
}
closeInfo.addEventListener("click", () => {
	closeInfoCard()
})
imageDiv.addEventListener("click", () => {
	const imgSrc = imageDiv.lastChild.src
	window.open(imgSrc)
})

helpButton.addEventListener("click", () => {
	closeInfoCard()
	closeConfigCard()
	closeFilterCard()

	helpSection.style.display = "block"
})
closeHelp.addEventListener("click", () => {
	closeHelpCard()
})

filterButton.addEventListener("click", () => {
	closeInfoCard()
	closeConfigCard()
	closeHelpCard()

	filterSection.style.display = "block"
})
closeFilter.addEventListener("click", () => {
	closeFilterCard()
})
searchButton.addEventListener("click", () => {
	const result = getResult()
	highlightResult(result)
})

configButton.addEventListener("click", () => {
	closeInfoCard()
	closeFilterCard()
	closeHelpCard()

	configSection.style.display = "block"
})
closeConfig.addEventListener("click", () => {
	closeConfigCard()
})
hierarchyButton.addEventListener("click", () => {
	hierarchySection.style.display = "block"
	randomSection.style.display = "none"
})
randomButton.addEventListener("click", () => {
	hierarchySection.style.display = "none"
	randomSection.style.display = "block"
})
saveButton.addEventListener("click", () => {
	const layoutType = document.querySelector('input[name="layoutType"]:checked').value
	const arrows = getArrows()

	if(layoutType === "random") {
		const layout = getRandom()
		drawNetwork(layout, arrows)
	} else {
		const layout = getHierarchy()
		drawNetwork(layout, arrows)
	}
})

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
	sessionStorage.setItem("people", JSON.stringify(people))
	setDefaultConfig()
	drawNetwork(defaultLayout, defaultArrows)
}