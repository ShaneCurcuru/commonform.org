var React = require('react');

module.exports = React.createClass({
  displayName: 'Glyphicon',

  propTypes: {
    icon: React.PropTypes.string.isRequired
  },

  render: function() {
    return React.DOM.span({
      className: 'glyphicon glyphicon-' + this.props.icon
    });
  }
});
