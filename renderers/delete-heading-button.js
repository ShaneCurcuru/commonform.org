var h = require('virtual-dom/h')

function deleteHeadingButton(state) {
  var emit = state.emit
  var path = state.path
  return h('button.deleteHeading',
    { onclick: function(event) {
        var headingPath = path.concat('heading')
        emit('delete', headingPath) } },
    'Delete Heading') }

module.exports = deleteHeadingButton
