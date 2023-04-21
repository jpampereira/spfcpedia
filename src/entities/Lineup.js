const CompositeEntity = require('./CompositeEntity');

module.exports = class Lineup extends CompositeEntity {
  entityName = 'lineup';

  value = [];

  constraints = {
    minLength: 11,
    maxLength: 11,
    sharedAttrs: ['match_id'],
    uniqueAttrs: ['player_id', 'shirt_number'],
  };

  constructor(value) {
    super();
    this.value = value;
  }
};
