var html = require('choo/html')

module.exports = function input (value, set, clear, placeholder) {
  if (value && value.length > 0) {
    return html`
      <span class=blank>
        ${value}
        <a  class=clear
            title="Clear"
            onclick=${function (e) {
              e.preventDefault()
              clear()
            }}></a>
      </span>
    `
  } else {
    return html`
      <input
          class=blank
          placeholder="${placeholder || ''}"
          onchange=${function (e) {
            e.preventDefault()
            set(e.target.value)
          }}>
    `
  }
}
