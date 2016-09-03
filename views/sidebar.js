var assert = require('assert')
var html = require('yo-yo')

module.exports = modeButtons

function modeButtons (mode, send) {
  assert(typeof mode === 'string')
  assert(typeof send === 'function')
  var showReadModes = mode !== 'browse' && mode !== 'search'
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
      ${showReadModes ? modeButton('read', mode, send) : null}
      ${showReadModes ? modeButton('edit', mode, send) : null}
      ${showReadModes ? modeButton('comment', mode, send) : null}
      ${showReadModes ? toolbox(send) : null}
      <a
          href=http://help.commonform.org
          class="help disabled"
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
          title="Click to open toolbox."
          class="tools disabled"
        ></a>
      <div class="toolbox closed">
        <a
            title="Subscribe via e-mail."
            class="subscribe"
            onclick=${function (event) {
              event.preventDefault()
              send('form:mode', 'mail')
            }}
          ></a>
        <a
            title="Store with CommonForm.org"
            class="save"
            onclick=${function (event) {
              event.preventDefault()
              send('form:mode', 'save')
            }}
          ></a>
        ${tool('simplify', send)}
        ${tool('renameTerm', send)}
        ${tool('renameHeading', send)}
        ${tool('identify', send)}
        ${tool('docx', send)}
        ${tool('markup', send)}
        ${tool('mail', send)}
      </div>
    </div>
  `

  function onClick (event) {
    var icon = this.getElementsByClassName('tools')[0]
    var box = this.getElementsByClassName('toolbox')[0]
    if (hidden) {
      icon.title = 'Click to close toolbox.'
      icon.className = 'tools enabled'
      box.className = 'toolbox open'
      hidden = false
    } else {
      icon.title = 'Click to open toolbox.'
      icon.className = 'tools disabled'
      box.className = 'toolbox closed'
      hidden = true
    }
  }
}

var TOOLS = {
  markup: {
    title: 'Save markup file.',
    action: 'form:download markup'
  },
  docx: {
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

function tool (name, send) {
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
        }}
        title=${tool.title}
      ></a>
  `
}

function modeButton (mode, currentMode, send) {
  assert(typeof mode === 'string')
  assert(typeof currentMode === 'string')
  assert(typeof send === 'function')
  var enabled = mode === currentMode
  var title = enabled ? '' : 'Click to ' + mode + '.'
  return html`
    <a
        title=${title}
        class="${mode} ${enabled ? 'enabled' : 'disabled'}"
        onclick=${function (event) {
          event.preventDefault()
          send('form:mode', mode)
        }}
      ></a>
  `
}

function enableIf (argument) {
  return argument ? 'enabled' : 'disabled'
}
