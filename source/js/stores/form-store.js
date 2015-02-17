var Reflux = require('reflux');
var Immutable = require('immutable');

var combineStrings = require('../helpers/combine-strings');
var formChange = require('../actions/form-change');

module.exports = Reflux.createStore({
  init: function() {
    this.listenTo(formChange, this.handleFormChange);
    this.form = this.getInitialState();
  },

  getInitialState: function() {
    return Immutable.fromJS({
      content: [
        'This ',
        {definition: 'Agreement'},
        {
          summary: 'A Summary',
          form: {content: ['Text in a sub-form!']}
        },
        {reference: 'Another Summary'}
      ]
    });
  },

  handleFormChange: function(instruction) {
    var type = instruction.type;
    var path = instruction.path;
    var value = instruction.value;
    var head;
    var newForm;
    switch (type) {
      case 'set':
        newForm = this.form.setIn(path, value);
        break;
      case 'del':
        newForm = this.form.deleteIn(path);
        break;
      case 'insert':
        head = path.slice(0, path.length - 1);
        newForm = this.form.updateIn(head, function(current) {
          return current.splice(path[path.length - 1], 0, value);
        });
        break;
      case 'splice':
        newForm = this.form.updateIn(path, function(current) {
          var offset = instruction.offset;
          var before = current.slice(0, offset);
          var after = current.slice(offset + instruction.length);
          return before.concat(instruction.value).concat(after);
        });
        break;
      default:
        throw new Error('Unrecognized instruction "' + type + '"');
    }
    this.form = combineStrings(newForm);
    this.trigger(this.form);
  }
});
