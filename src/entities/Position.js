const IndividualEntity = require('./IndividualEntity');

module.exports = class Position extends IndividualEntity {
  entityName = 'position';

  attributes = {
    symbol: { value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null },
    name: { value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null },
  };

  dependentEntities = ['lineup'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
