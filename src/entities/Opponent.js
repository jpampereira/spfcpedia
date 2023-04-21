const DbEntity = require('./DbEntity');

module.exports = class Opponent extends DbEntity {
  entityName = 'opponent';

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
