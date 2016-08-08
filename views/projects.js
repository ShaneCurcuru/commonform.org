var compare = require('reviewers-edition-compare')
var footer = require('./footer')
var html = require('yo-yo')
var loading = require('./loading')
var modeButtons = require('./mode-buttons')

module.exports = function (publisher, state, send) {
  var haveData = state.publisher === publisher && state.projects
  if (!haveData) {
    return loading(function () {
      send('browser:get projects', publisher)
    })
  } else {
    return html`
      <div class=container>
        <article class=commonform>
          ${modeButtons('browse', send)}
          <h1>${publisher}’s Common Form Projects</h1>
          ${list(publisher, state.projects, send)}
          <a href="/publishers" class=nav>« list of all publishers</a>
          ${footer()}
        </article>
      </div>
    `
  }
}

function list (publisher, projects, send) {
  if (projects.length === 0) {
    return html`<p>No publications</p>`
  } else {
    return html`
      <ul>
        ${
          projects.map(function (project) {
            return projectItem(
              publisher,
              project.name,
              project.editions,
              send
            )
          })
        }
      </ul>
    `
  }
}

function projectItem (publisher, project, editions, send) {
  return html`
    <li>
      ${project}:
      ${
        editions
        .sort(compare)
        .map(function (edition) {
          return editionLink(publisher, project, edition, send)
        })
      }
    </li>
  `
}

function editionLink (publisher, project, edition, send) {
  var href = (
    '/publications' +
    '/' + encodeURIComponent(publisher) +
    '/' + encodeURIComponent(project) +
    '/' + encodeURIComponent(edition)
  )
  return html`
    <a
        class=publication
        href=${href}
        onclick=${onClick}
      >${edition}</a>
  `
  function onClick (event) {
    event.preventDefault()
    event.stopPropagation()
    send('form:load publication', {
      publisher: publisher,
      project: project,
      edition: edition
    })
  }
}
