const IndividualEntity = require('./IndividualEntity');

module.exports = class Country extends IndividualEntity {
  entityName = 'country';

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
