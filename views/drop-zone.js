var assert = require('assert')
var html = require('bel')

module.exports = dropZone

var EFFECTS = ['child', 'move', 'none']

function dropZone (effect, path, send) {
  assert.equal(typeof send, 'function')
  assert(EFFECTS.indexOf(effect) !== -1)
  assert(Array.isArray(path))
  var onClick
  var text
  var classes = 'dropZone'
  if (effect === 'child') {
    onClick = function (event) {
      send('form:child', {path: path})
    }
    text = 'Click to add here.'
  } else if (effect === 'move') {
    onClick = function (event) {
      send('form:move', {path: path})
    }
    text = 'Click to move here.'
  } else {
    classes += ' placeholder'
    onClick = null
    text = ''
  }
  return html`
    <div
        class=${classes}
        onclick=${onClick}
      >${text}</div>
  `
}
