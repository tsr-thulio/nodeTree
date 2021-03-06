'use strict'

var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit: '3mb'}))
app.set('rootFolder', __dirname)
app.use(require('./controllers/controller'))

app.listen(process.env.port || 9000, function () {
  console.log('Server initialized')
})