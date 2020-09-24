"use strict"

const exp = require("express")
const app = exp()
app.use(exp.urlencoded({extended: true}))
app.use(exp.json())

const stat = require("serve-static")
app.use(stat("public", {"index": "main.html"}))

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Connected to port ${port}!`))