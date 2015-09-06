var blankInput = require('./blank-input')
var h = require('virtual-dom/h')
var pathID = require('../path-id')

function blankEntry(state) {
  var blank = state.blank
  return h('p.blank',
    { id: ( 'blank:' + blank ) },
    [ h('div.name', blank),
      h('div.value', blankInput(state)),
      h('div.appearances',
        state.insertions
          .map(function(insertion) {
            return h('a',
              { href: ( '#path:' + pathID(insertion) ) },
              'Here') })) ]) }

module.exports = blankEntry
