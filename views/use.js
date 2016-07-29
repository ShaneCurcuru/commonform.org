var html = require('choo/html')

module.exports = function (term) {
  return html`
    <a  class=use
        title="Jump to definition of ${term}"
        href="#Definition:${term}"
        onclick=${function () {
          var definition = document.getElementById('Definition:' + term)
          if (definition) definition.scrollIntoView()
        }}
      >${term}</a>
  `
}
