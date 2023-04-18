const DbEntity = require('./DbEntity');

module.exports = class Stage extends DbEntity {
  entityName = 'stage';

  attributes = {
    name: {
      value: null, required: true, unique: false, validations: ['exists'], relatedTable: null,
    },
    tournament_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'tournament',
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
