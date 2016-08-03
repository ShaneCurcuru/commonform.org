var assert = require('assert')
var html = require('choo/html')

module.exports = function (digest, send) {
  assert.equal(typeof digest, 'string')
  assert.equal(typeof send, 'function')
  return html`
    <a
        class=digest
        href="/forms/${digest}"
        onclick=${function () {
          send('form:load')
          send('form:fetch', {digest: digest})
        }}
      >${digest.slice(0, 32)}<wbr>${digest.slice(32)}</a>
  `
}

