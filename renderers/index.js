var h = require('virtual-dom/h')
var form = require('./form')

function browser(state) {
  return h('div.browser', [ form(state) ]) }

module.exports = browser
