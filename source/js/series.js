var SubForm = require('./sub-form');

var attributes = {className: 'series'};

module.exports = React.createClass({
  render: function() {
    var path = this.props.path;
    var children = this.props.content.map(function(subForm, index) {
      var subFormPath = path.concat(index);
      subForm.form.path = subFormPath.concat(index);
      var childAttributes = {
        subForm: subForm,
        path: subFormPath,
        key: subFormPath.join('.')
      };
      var childPath = path.concat('content', index);
      return React.createElement(SubForm, childAttributes, childPath);
    });
    return React.DOM.div(attributes, children);
  }
});
