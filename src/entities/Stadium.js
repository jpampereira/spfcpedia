const DbEntity = require('./DbEntity');

module.exports = class Stadium extends DbEntity {
  entityName = 'stadium';

  attributes = {
    name: {
      value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null,
    },
    nickname: {
      value: null, required: false, unique: true, validations: [], relatedEntity: null,
    },
    city_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'city',
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
