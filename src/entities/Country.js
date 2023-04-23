const IndividualEntity = require('./IndividualEntity');

module.exports = class Country extends IndividualEntity {
  entityName = 'country';

  attributes = {
    name: { value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null },
  };

  dependentEntities = ['city', 'player'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
