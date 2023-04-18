const DbEntity = require('./DbEntity');

module.exports = class Player extends DbEntity {
  entityName = 'player';

  attributes = {
    name: {
      value: null, required: true, unique: true, validations: ['exists'], relatedTable: null,
    },
    nickname: {
      value: null, required: false, unique: true, validations: [], relatedTable: null,
    },
    position: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'position',
    },
    birth: {
      value: null, required: true, unique: false, validations: ['date'], relatedTable: null,
    },
    nationality: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'country',
    },
    image: {
      value: null, required: true, unique: false, validations: [], relatedTable: null,
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
