var assert = require('assert')
var html = require('bel')

module.exports = modeButtons

function modeButtons (mode, send) {
  assert(typeof mode === 'string')
  assert(typeof send === 'function')
  var showReadModes = (
    mode !== 'browse' &&
    mode !== 'search' &&
    mode !== 'none'
  )
  return html`
    <div class=modes>
      <a
          href="/search"
          class="search ${enableIf(mode === 'search')}"
          title="Click to search forms."
      ></a>
      <a
          href="/publishers"
          class="browse ${enableIf(mode === 'browse')}"
          title="Click to browse forms."
      ></a>
      ${showReadModes ? readButton() : null}
      ${showReadModes ? toolbox(send) : null}
      <a
          href=http://help.commonform.org
          class="help disabled"
          rel=noreferrer
          target=_blank
          title="Click for help."
      ></a>
    </div>
  `
}

function toolbox (send) {
  assert(typeof send === 'function')
  var hidden = true
  return html`
    <div
        class=tools
        onclick=${onClick}
      ><a
          id=toolsLink
          title="Click to open toolbox."
          class="tools disabled"
        ></a>
      <div id=toolbox class="toolbox closed">
        <a
            title="Subscribe via e-mail."
            class="subscribe"
            onclick=${function (event) {
              event.preventDefault()
              event.stopPropagation()
              closeToolbox()
              send('form:mode', 'mail')
            }}
          >Subscribe</a>
        <a
            title="Store with CommonForm.org"
            class="save"
            onclick=${function (event) {
              event.preventDefault()
              event.stopPropagation()
              closeToolbox()
              send('form:mode', 'save')
            }}
          >Store Online</a>
        ${tool('simplify', 'Simplify Structure', closeToolbox, send)}
        ${tool('renameTerm', 'Rename Term', closeToolbox, send)}
        ${tool('renameHeading', 'Rename Heading', closeToolbox, send)}
        ${tool('identify', 'Mark Terms', closeToolbox, send)}
        ${tool('saveDOCX', 'Save DOCX', closeToolbox, send)}
        ${tool('saveProject', 'Save Project', closeToolbox, send)}
        ${tool('mail', 'E-Mail', closeToolbox, send)}
      </div>
    </div>
  `

  function onClick (event) {
    if (hidden) {
      openToolbox()
    } else {
      closeToolbox()
    }
  }

  function openToolbox () {
    var icon = getIcon()
    var box = getToolbox()
    icon.title = 'Click to close toolbox.'
    icon.className = 'tools enabled'
    box.className = 'toolbox open'
    hidden = false
  }

  function closeToolbox () {
    var icon = getIcon()
    var box = getToolbox()
    icon.title = 'Click to open toolbox.'
    icon.className = 'tools disabled'
    box.className = 'toolbox closed'
    hidden = true
  }

  function getIcon () {
    return document.getElementById('toolsLink')
  }

  function getToolbox () {
    return document.getElementById('toolbox')
  }
}

var TOOLS = {
  saveProject: {
    title: 'Save project file.',
    action: 'form:download project'
  },
  saveDOCX: {
    title: 'Save Word file.',
    action: 'form:download docx'
  },
  mail: {
    title: 'E-Mail a link.',
    action: 'form:email'
  },
  renameTerm: {
    title: 'Rename a defined term.',
    action: 'form:rename term'
  },
  renameHeading: {
    title: 'Rename a heading.',
    action: 'form:rename heading'
  },
  simplify: {
    title: 'Simplify structure.',
    action: 'form:simplify'
  },
  markTerms: {
    title: 'Mark defined terms.',
    action: null
  },
  identify: {
    title: 'Identify terms and references.',
    action: 'form:identify'
  }
}

function tool (name, label, closeToolbox, send) {
  assert(typeof name === 'string')
  assert(TOOLS.hasOwnProperty(name))
  assert(typeof send === 'function')
  var tool = TOOLS[name]
  return html`
    <a
        class=${name}
        onclick=${function (event) {
          event.preventDefault()
          event.stopPropagation()
          send(tool.action)
          closeToolbox()
        }}
        title=${tool.title}
      >${label}</a>
  `
}

function readButton () {
  return html`
    <a
        title="Reviewing form."
        class="enabled read"
      ></a>
  `
}

function enableIf (argument) {
  return argument ? 'enabled' : 'disabled'
}
