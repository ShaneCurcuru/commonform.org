module.exports = renderDiff

var classnames = require('classnames')
var group = require('commonform-group-series')
var h = require('virtual-dom/h')
var jsonClone = require('../utility/json-clone')
var renderDiffHeading = require('./diff-heading')
var renderDiffParagraph = require('./diff-paragraph')
var renderDiffSeries = require('./diff-series')

function renderDiff(state) {
  // State
  var diff = state.diff

  // Derivations
  var root = !diff.hasOwnProperty('form')
  var formLike = ( root ? diff : diff.form )
  var groups = group(jsonClone(formLike))
  var wrapper
  if (diff.hasOwnProperty('inserted')) {
    wrapper = function wrapInIns(argument) {
      return h('ins', argument ) } }
  else if (diff.hasOwnProperty('deleted')) {
    wrapper = function wrapInDel(argument) {
      return h('del', argument ) } }
  else {
    wrapper = function doNotWrap(argument) {
      return argument } }

  // Rendering
  return h('section',
    // TODO: Show conspicuous changes
    { className: classnames({
        conspicuous: formLike.conspicuous.some(function(element) {
          return ( !element.hasOwnProperty('deleted') ) }) }) },
    wrapper([
      ( root
          ? null
          : h('a.sigil', '§') ),
      ( Array.isArray(diff.heading)
          ? renderDiffHeading({ heading: diff.heading })
          : null ),
      groups
        .map(function(group) {
          var renderer = (
            ( group.type === 'series' )
              ? renderDiffSeries
              : renderDiffParagraph )
          return renderer({ data: group }) }) ])) }
