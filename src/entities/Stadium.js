const DbEntity = require('./DbEntity');

module.exports = class Stadium extends DbEntity {
  entityName = 'stadium';

  attributes = {
    name: {
      value: null, required: true, unique: true, validations: ['exists'], relatedTable: null,
    },
    nickname: {
      value: null, required: false, unique: true, validations: [], relatedTable: null,
    },
    city_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'city',
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
