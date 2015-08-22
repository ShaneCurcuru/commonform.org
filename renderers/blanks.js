var h = require('virtual-dom/h')
var blankEntryRow = require('./blank-entry-row')

function blanks(state) {
  return h('div.blanks',
    h('table',
      [ h('thead',
          [ h('th', 'Blank'),
            h('th', 'Value') ]),
        h('tbody',
          Object.keys(state.analysis)
            .map(function(blank) {
              return blankEntryRow({
                digest: state.digest,
                blank: blank,
                emit: state.emit,
                values: state.values }) })) ])) }

module.exports = blanks
