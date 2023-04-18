const DbEntity = require('./DbEntity');

module.exports = class Position extends DbEntity {
  entityName = 'position';

  attributes = {
    symbol: {
      value: null, required: true, unique: true, validations: ['exists'], relatedTable: null,
    },
    name: {
      value: null, required: true, unique: true, validations: ['exists'], relatedTable: null,
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
