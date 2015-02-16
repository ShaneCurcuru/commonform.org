var React = require('react');

var SpliceButton = require('./splice-button');
var SiblingButton = require('./sibling-button');

module.exports = React.createClass({
  render: function() {
    var path = this.props.path;
    var offset = this.props.offset;
    var length = this.props.length;
    return React.DOM.div({
      key: 'div',
      className: 'btn-group col-sm-1',
    }, [
      React.DOM.button({
        key: 'toggle',
        className: 'btn btn-default dropdown-toggle',
        type: 'button',
        'data-toggle': 'dropdown'
      }, [React.DOM.strong({key: 'pilcrow'}, '¶')]),
      React.DOM.ul({
        key: 'ul',
        className: 'dropdown-menu',
        role: 'menu'
      }, [
        React.createElement(SiblingButton, {
          key: 'formAbove',
          path: path.concat(offset),
          above: true
        }),
        React.createElement(SiblingButton, {
          key: 'formBelow',
          path: path.concat(offset + length),
          above: false
        }),
        this.props.only || React.DOM.li({
          key: 'divider',
          className: 'divider'
        }),
        this.props.only || React.createElement(SpliceButton, {
          key: 'splice',
          path: path,
          offset: offset,
          length: length
        })
      ])
    ]);
  }
});
