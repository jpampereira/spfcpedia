const DbEntity = require('./DbEntity');

module.exports = class City extends DbEntity {
  entityName = 'city';

  attributes = {
    name: {
      value: null, required: true, unique: false, validations: ['exists'], relatedEntity: null,
    },
    country_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'country',
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
