const CompositeEntity = require('./CompositeEntity');

module.exports = class Lineup extends CompositeEntity {
  entityName = 'substitution';

  values = [];

  constraints = {
    minLength: 1,
    maxLength: 5,
    sharedAttrs: ['match_id'],
    uniqueAttrs: ['player_id', 'shirt_number', 'lineup_id'],
  };

  constructor(values) {
    super(values);
    this.values = values;
  }
};
