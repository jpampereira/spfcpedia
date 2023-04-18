const DbEntity = require('./DbEntity');

module.exports = class Lineup extends DbEntity {
  entityName = 'lineup';

  attributes = {
    match_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'match',
    },
    player_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'player',
    },
    shirt_number: {
      value: null, required: true, unique: false, validations: ['isPositive'], relatedTable: null,
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
