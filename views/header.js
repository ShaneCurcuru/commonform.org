var assert = require('assert')
var digestLink = require('./digest-link')
var html = require('choo/html')
var spell = require('reviewers-edition-spell')

module.exports = function (
  digest, publications, toDigest, toPublications, send
) {
  assert.equal(typeof digest, 'string')
  assert(Array.isArray(publications))
  assert(send !== undefined)
  return toDigest
  ? html`
    <header>
      ${paragraph(digest, publications, send)}
      <p>compared to</p>
      ${paragraph(toDigest, toPublications, send)}
    </header>
  `
  : paragraph(digest, publications, send)
}

function paragraph (digest, publications, send) {
  assert.equal(typeof digest, 'string')
  assert(Array.isArray(publications))
  assert(send !== undefined)
  return html`
    <div>
      <p>${digestLink(digest, send)}</p>
      ${publicationsList(publications)}
    </div>
  `
}

function publicationsList (publications) {
  return html`<p>${publications.map(publicationLine)}</p>`
}

function publicationLine (publication) {
  var edition = publication.edition
  var project = publication.project
  var publisher = publication.publisher
  var link = `/publications/${publisher}/${project}/${edition}`
  if (publication.root) {
    return html`
      <p class=publication>
        <a
            class=publisher
            href="/publishers/${encodeURIComponent(publisher)}"
          >${publisher}</a>
        published this form as
        <strong>
          ${project}
          <abbr title=${spell(edition)}>${edition}</abbr>
        </strong>
      </p>
    `
  } else {
    return html`
      <p class=publication>
        <strong>${publisher}</strong>
        published this form within
        <strong>
          <a
              class=publication
              href=${link}
              title="Read ${publisher}'s ${project} ${spell(edition)}">
            ${project}
            <abbr title=${spell(edition)}>${edition}</abbr>
          </a>
        </strong>
      </p>
    `
  }
}
