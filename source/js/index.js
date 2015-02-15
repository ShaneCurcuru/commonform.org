var Form = require('./form');
var Navigation = require('./navigation');
var indepth = require('indepth');
var formChange = require('./form-change');

document.addEventListener('DOMContentLoaded', function() {
  var formStore = Reflux.createStore({
    init: function() {
      this.listenTo(formChange, this.output);
      this.form = {content:['Form text']};
    },
    output: function(instruction) {
      var type = instruction.type;
      var path = instruction.path;
      var value = instruction.value;
      switch (type) {
        case 'set':
          indepth.set(this.form, path, value);
          break;
        case 'del':
          indepth.del(this.form, path);
          break;
      }
      this.trigger(this.form);
    }
  });

  React.initializeTouchEvents(true);

  var element = document.getElementsByClassName('application')[0];

  var Project = React.createClass({
    mixins: [Reflux.ListenerMixin],
    onFormChange: function(form) {
      this.setProps({form: form});
    },
    componentDidMount: function() {
      this.listenTo(formStore, this.onFormChange);
    },
    getDefaultProps: function() {
      return {
        form: {
          content: ['This is a test']
        },
        path: []
      };
    },
    render: function() {
      var navigation = React.createElement(Navigation);
      var form = React.createElement(Form, {
        form: this.props.form,
        path: this.props.path
      });
      var content = React.DOM.div({className: 'container'}, form);
      return React.DOM.div({className: 'project'}, [
        navigation, content
      ]);
    }
  });

  React.render(React.createElement(Project), element);

  formChange({
    type: 'set',
    path: ['content'],
    value: [
      'This ',
      {definition: 'Agreement'},
      ' has defined the term ',
      {use: 'Agreement'},
      ' with a field ',
      {field: 'Some Value'},
      ' and a reference ',
      {
        summary: 'A Summary',
        form: {
          content: [
            'Text in a sub-form!'
          ]
        }
      },
      {reference: 'Another Summary'}
    ]
  });

});
