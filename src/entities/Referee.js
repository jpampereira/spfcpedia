const DbEntity = require('./DbEntity');

module.exports = class Referee extends DbEntity {
  entityName = 'referee';

  attributes = {
    name: {
      value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null,
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
