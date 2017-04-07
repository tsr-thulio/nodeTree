'use strict'

var express = require('express')
var router = express.Router()
var path = require('path')
var _ = require('lodash')

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
  var result = getSumInTree(req.body.tree, req.body.number)
  resp.status(200)
  resp.json({
    result: result
  })
})

/** 
 * Get all paths which the sum matches with the given number
 * @param tree is a string with the representation of tree 
 * @param number is an random number - Note: it can be a floating point
 * @return an array with the nodes values in it or an empty array
 */
function getSumInTree (tree, number) {
  var treeArray = getTreeInArray(tree.trim())
  var possibleSumNode = []
  _.forEach(treeArray, function(nodeArray) {
    getPreferredSumNode(nodeArray, number, possibleSumNode)
  })
  return possibleSumNode
}

/**
 * Get the preferred paths which the sum mathes with the given number
 * @param  {Array} nodeArray - node array to be analyzed
 * @param  {Integer} number - given number to match on path
 * @param  {Object} container - object which contains all possible paths
 */
function getPreferredSumNode(nodeArray, number, container) {
  if (nodeArray[0] === number) {
    container.push([nodeArray[0]])
    nodeArray = nodeArray.slice(1)
  }
  if (nodeArray[0] > number) {
    nodeArray = nodeArray.slice(1)
  }
  var possibleNodes = []
  nodeArray.reduce(function(previous, current, index) {
    possibleNodes.push(current)
    var sum = previous + current
    if (sum > number) {
      nodeArray.splice(0, 1)
      getPreferredSumNode(nodeArray, number, container)
    } else if (sum == number) {
      container.push(possibleNodes)
      possibleNodes = []
      getPreferredSumNode(nodeArray.slice(nodeArray.indexOf(current)), number, container)
    } else {
      return sum
    }
  }, 0)
}

/**
 * Convert array of string (tree format), into array of arrays (tree format)
 * @param  {Array} tree
 * @returns {Array} the converted array
 */
function getTreeInArray(tree) {
  var treeArrayString = createNodeStringArray(tree)
  return createNodeArray(treeArrayString)
}

/**
 * Create array of string (tree format)
 * @param  {String} tree - the given tree on string to be formatted
 * @returns {Array} - tree format array of string
 */
function createNodeStringArray(tree) {
  // Replacing all ' ' for ','
  tree = _.replace(tree, / /g, ',').trim()
  // Replacing all ',#,#,' for '-'
  tree = _.replace(tree, /,#,#,/g, '-')
  // Replacing all ',#,#' for '-'
  tree = _.replace(tree, /,#,#/g, '-')
  // Splitting tree in array
  tree = _.split(tree, '-')
  // Returning the compact array (without undefined values)
  return _.compact(tree)
}

/**
 * Create node array
 * @param  {String} normalizedTree - the nodes on string to be converted
 * @returns {Array} - the node array
 */
function createNodeArray (normalizedTree) {
  var nodeArray = []
  _.forEach(normalizedTree, function(item) {
    nodeArray.push(JSON.parse('['+item+']'))
  })
  return nodeArray
}

module.exports = router