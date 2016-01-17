module.exports = renderers

var docx = require('commonform-docx')
var filesaver = require('filesaver.js').saveAs
var footer = require('./footer')
var form = require('./form')
var h = require('virtual-dom/h')
var header = require('./header')
var outline = require('outline-numbering')
var querystring = require('querystring')

function renderers(state) {
  var data = state.data
  var title = state.title
  var blanks = { }
  if (!data) {
    return h('p', 'Loading ...') }
  else {
    var merkle = state.derived.merkle
    var path = state.path
    return h('article.commonform', [
      header({ digest: state.derived.merkle.digest }),
      h('form',
        { onsubmit: function(event) {
            event.preventDefault()
            filesaver(
              docx(data, blanks, { title:title, numbering: outline })
                .generate({ type: 'blob' }),
              fileName(title, 'docx')) } },
        [ h('div.menu',
            [ h('button', { type: 'submit' }, [ 'Download' ]),
              h('button',
                { onclick: function(event) {
                  event.preventDefault()
                  window.location.href = (
                    'mailto:?' +
                      querystring.stringify({
                        subject: 'Link to Common Form',
                        body: 'https://commonform.org/forms/' + state.digest }) ) } },
                [ 'E-Mail' ]) ]),
          form({
            data: data,
            path: path,
            derived: { merkle: merkle } }) ]),
      footer() ]) } }

function fileName(title, extension) {
  var date = new Date().toISOString()
  return ( '' + title + ' ' + date + '.' + extension ) }
