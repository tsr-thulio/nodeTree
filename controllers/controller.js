'use strict'

var express = require('express')
var router = express.Router()
var path = require('path')

/**
 * Router to GET the index page
 */
router.get('/', function(req, resp) {
  resp.sendfile(path.join(req.app.get('rootFolder'), '/pages/index.html'))
})

/**
 * Router to make a POST and process the given tree
 */
router.post('/node-tree', function(req, resp) {
  console.log('tree', req.body.tree)
  console.log('number', req.body.number)
  //TODO: remove this invalid result, just testing POST action
  var result = ['create result values']
  resp.status(200)
  resp.json({
    result: result
  })
})

module.exports = router