var docx = require('commonform-docx')
var fileName = require('../utility/file-name')
var filesaver = require('filesaver.js').saveAs
var h = require('virtual-dom/h')

function saveDOCXButton(state) {
  var title = state.title
  var form = state.data
  var blanks = state.blanks
  return h('button.saveDOCX',
    { href: '#',
      onclick: function(event) {
        event.preventDefault()
        event.stopPropagation()
        var zip = docx(form, blanks, { title: title })
        var date = new Date().toISOString()
        filesaver(
          zip.generate({ type: 'blob' }),
          fileName(( title + ' ' + date ), 'docx')) } },
    'Save DOCX') }

module.exports = saveDOCXButton
