const IndividualEntity = require('./IndividualEntity');

module.exports = class City extends IndividualEntity {
  entityName = 'city';

  attributes = {
    name: {
      value: null, required: true, unique: false, validations: ['exists'], relatedEntity: null,
    },
    country_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'country',
    },
  };

  dependentEntities = ['stadium'];

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
