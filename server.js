const express = require('express')
const bodyParser = require('body-parser')
const db = require('./tools/database')

const app = express()
const port = 8080

var router = require('./routes/routers')
//API CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '10mb'}));
//INIT ROUTER
router.init(app)
//LISTENING TO PORT
app.listen(port)

console.log("Server listening on port " + port)

module.exports = app // for testing