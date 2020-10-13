"use strict"

const exp = require("express")
const app = exp()
app.use(exp.urlencoded({extended: true}))
app.use(exp.json())

const stat = require("serve-static")
app.use(stat("assets"))

app.get("/", async (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

app.get("/data", async (req, res) => {
	const fs = require("fs")
	const json = fs.readFileSync("./data/people.json")

	res.send(json)
})

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Connected to port ${port}!`))