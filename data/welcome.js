var annotate = require('../utilities/annotate')
var merkleize = require('commonform-merkleize')
var welcomeTree = require('commonform-welcome-form')

var welcome = module.exports = {
  tree: welcomeTree,
  annotations: annotate(welcomeTree),
  merkle: merkleize(welcomeTree)
}

welcome.digest = welcome.merkle.digest

