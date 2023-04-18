const DbEntity = require('./DbEntity');

module.exports = class City extends DbEntity {
  entityName = 'city';

  attributes = {
    name: {
      value: null, required: true, unique: false, validations: ['exists'], relatedTable: null,
    },
    country_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'country',
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
