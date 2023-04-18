const DbEntity = require('./DbEntity');

module.exports = class Stage extends DbEntity {
  entityName = 'tournament';

  attributes = {
    name: {
      value: null, required: true, unique: true, validations: ['exists'], relatedTable: null,
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
