module.exports = signaturePage

var capitalize = require('capitalize')
var h = require('virtual-dom/h')
var input = require('./replaceable-input')
var renderEntities = require('./signature-entities')

function signaturePage(state) {
  var emit = state.emit
  var page = state.page
  var path = state.path

  var entities = page.entities
  var information = ( page.information || [ ] )

  function updateValue(key, value) {
    var keyPath = path.concat(key)
    if (value.length > 0) {
      emit('signatures', 'set', keyPath, value) }
    else {
      emit('signatures', 'delete', keyPath) } }

  function inputFor(key, placeholder) {
    return input(
      ( page[key] || '' ),
      function(value) {
        updateValue(key, value) },
      function() {
        updateValue(key, '') },
      placeholder) }

  return h('.page',
    [ h('p.header', inputFor('header', 'Signature Page Header')),
      h('p', [ inputFor('term', 'Party Defined Term'), ':' ]),
      renderEntities(
        { emit: emit,
          entities: entities,
          path: path.concat('entities') }),
      h('p', 'By:'),
      h('p', [ 'Name: ', inputFor('name') ]),
      ( entities ?
          (function() {
            var lastIndex = ( entities.length - 1 )
            var byPath = path.concat(
              'entities', lastIndex, 'by')
            return h('p',
              [ 'Title: ',
                input(
                  entities[lastIndex].by,
                  function(value) {
                    emit('signatures', 'set', byPath, value) },
                  function() {
                    emit('signatures', 'delete', byPath) }) ]) })() :
          null ),
      information.map(function(text) {
        text = ( text === 'email' ? 'E-Mail' : capitalize(text) )
        return h('p', [ text, ':' ]) }),
      h('p',
        h('button',
          { onclick: function(event) {
              event.preventDefault()
              emit('signatures', 'delete', path) } },
          'Delete this Signature Page')) ]) }
