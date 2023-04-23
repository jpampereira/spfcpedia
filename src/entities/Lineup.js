const CompositeEntity = require('./CompositeEntity');

module.exports = class Lineup extends CompositeEntity {
  entityName = 'lineup';

  values = [];

  constraints = {
    minLength: 11,
    maxLength: 11,
    sharedAttrs: ['match_id'],
    uniqueAttrs: ['player_id', 'shirt_number'],
  };

  constructor(values) {
    super(values);
    this.values = values;
  }
};
