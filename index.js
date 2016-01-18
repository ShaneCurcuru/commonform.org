var deepEqual = require('deep-equal')
var loadInitialForm = require('./utility/load-initial-form')
var merkleize = require('commonform-merkleize')

var formPathPrefix = '/forms/'

var eventBus = new (require('events').EventEmitter)

var applicationState = {
  blanks: [ ],
  path: [ ],
  emit: eventBus.emit.bind(eventBus) }

eventBus
  .on('form', function(form) {
    applicationState.data = form
    computeDerivedState()
    mainLoop.update(applicationState)
    pushState() })
  .on('blank', function(blank, value) {
    var index = applicationState.blanks.findIndex(function(record) {
      return deepEqual(record.blank, blank) })
    if (index < 0) {
      applicationState.blanks.unshift({ blank: blank })
      index = 0 }
    applicationState.blanks[index].value = value
    computeDerivedState()
    mainLoop.update(applicationState)
    pushState() })

var mainLoop = require('main-loop')(
  applicationState,
  require('./renderers'),
  require('virtual-dom'))

function pushState() {
  var digest = applicationState.derived.merkle.digest
  history.pushState({ digest: digest }, null, ( formPathPrefix + digest )) }

function computeDerivedState() {
  applicationState.derived = { merkle: merkleize(applicationState.data) } }

document
  .querySelector('.container')
  .appendChild(mainLoop.target)

loadInitialForm(
  window.location.pathname,
  formPathPrefix,
  eventBus.emit.bind(eventBus, 'form'))
