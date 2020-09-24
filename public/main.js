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