module.exports = form

var classnames = require('classnames')
var deepEqual = require('deep-equal')
var get = require('keyarray').get
var group = require('commonform-group-series')
var h = require('virtual-dom/h')
var jsonClone = require('../utility/json-clone')
var isBlank = require('commonform-predicate').blank
var renderAnnotations = require('./annotations')
var renderDigest = require('./digest')
var renderDropZone = require('./drop-zone')
var renderHeading = require('./heading')
var renderParagraph = require('./paragraph')
var renderSectionButton = require('./section-button')
var renderSeries = require('./series')
var thunk = require('vdom-thunk')

function form(state) {
  // State
  var annotations = state.derived.annotations
  var blanks = state.blanks
  var form = state.form
  var emit = state.emit
  var focused = state.focused
  var merkle = state.derived.merkle
  var path = state.path

  // Derivations
  var root = path.length === 0
  var formKey = ( root ? [ ] : [ 'form' ] )
  var formObject = ( root ? form : form.form )
  var groups = group(jsonClone(formObject))
  var isFocused = deepEqual(focused, path)
  var annotationsHere = get(
    annotations,
    formKey.concat('annotations'),
    [ ])

  // Rendering
  var offset = 0
  function toggleFocus(event) {
    event.stopPropagation()
    emit('focus', ( isFocused ? null : path )) }
  return [
    h('section',
      { className: classnames({
          conspicuous: ( 'conspicuous' in formObject ),
          notFocused: ( focused !== null && !isFocused ),
          focused: isFocused }),
        attributes: { 'data-digest': merkle.digest } },
      [ ( root ?
            undefined :
            renderSectionButton({ toggleFocus: toggleFocus }) ),
        ( form.heading ?
            thunk(renderHeading, form.heading) :
            undefined ),
        ( isFocused ?
            h('p.details',
              [ thunk(renderDigest, merkle.digest),
                ( annotationsHere.length > 0 ?
                    thunk(renderAnnotations, annotationsHere) :
                    undefined ) ]) :
            undefined ),
        h('aside.marginalia',
          { onclick: toggleFocus },
          [ ( annotationsHere.some(function(annotation) {
                return annotation.level === 'error' }) ?
                h('a.flag',
                  { title: 'Click to Show Error' },
                  '⚠') :
                undefined ),
            ( annotationsHere.some(function(annotation) {
                return annotation.level !== 'error' }) ?
                h('a.flag',
                  { title: 'Click to Show Annotations' },
                  '⚐') :
                undefined ),
            ( formObject.content
                .some(function(element, index) {
                   return (
                     isBlank(element) &&
                     !blanks.some(function(direction) {
                       return deepEqual(
                         direction.blank,
                         path.concat('form', 'content', index)) }) ) }) ?
                h('a.flag', { title: 'Empty Blank' }, '✍') :
                undefined ) ]),
        ( ( root || form.hasOwnProperty('heading') ) ?
            renderDropZone({
              emit: emit,
              focused: focused,
              path: path.concat(formKey, 'content', 0) }) :
            undefined ),
        groups
          .map(function(group) {
            var groupState = {
              blanks: blanks,
              data: group,
              derived: {
                annotations: get(annotations, formKey, { }) },
              emit: emit,
              focused: focused,
              offset: offset,
              path: path.concat(formKey) }
            var renderer
            if (group.type === 'series') {
              renderer = renderSeries
              groupState.derived.merkle = merkle
              groupState.focused = focused }
            else {
              renderer = renderParagraph }
            var result = renderer(groupState)
            offset += group.content.length
            return result }) ]) ] }
