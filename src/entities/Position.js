const DbEntity = require('./DbEntity');

module.exports = class Position extends DbEntity {
  entityName = 'position';

  attributes = {
    symbol: {
      value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null,
    },
    name: {
      value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null,
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
