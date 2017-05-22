var assert = require('assert')
var html = require('../html')

module.exports = function (term) {
  assert(typeof term === 'string')
  return html`
    <a  class=use
        title="Jump to definition of ${term}"
        href="#Definition:${term}"
      >${term}</a>
  `
}
