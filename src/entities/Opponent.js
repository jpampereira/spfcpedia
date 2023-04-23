const IndividualEntity = require('./IndividualEntity');

module.exports = class Opponent extends IndividualEntity {
  entityName = 'opponent';

  attributes = {
    name: { value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null },
  };

  dependentEntities = ['match'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
