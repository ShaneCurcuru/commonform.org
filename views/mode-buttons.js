var html = require('yo-yo')

module.exports = modeButtons

function modeButtons (mode, send) {
  return html`
    <div class=modes>
      <a
          href="/publishers"
          class=disabled
          title="Click to browse publishers."
      >${symbols.browse}</a>
      ${modeButton('read', mode, send)}
      ${modeButton('edit', mode, send)}
    </div>
  `
}

var symbols = {
  browse: '\u267B', // recycle symbol (black)
  read: '\u2398', // next page symbol
  edit: '\u270D', // writing hand symbol
  compare: '\u2260', // not-equal
  comment: '\u275e', // right double quote
  settings: '\u2699' // gear symbol
}

function modeButton (mode, currentMode, send) {
  var enabled = mode === currentMode
  var title = (enabled ? 'Using ' : 'Click to use ') + mode + ' mode.'
  return html`
    <a
        title=${title}
        class=${enabled ? 'enabled' : 'disabled'}
        onclick=${function (event) {
          event.preventDefault()
          send('form:mode', mode)
        }}
      >${symbols[mode]}</a>
  `
}
