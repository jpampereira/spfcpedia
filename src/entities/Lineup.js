const CompositeEntity = require('./CompositeEntity');

module.exports = class Lineup extends CompositeEntity {
  entityName = 'lineup';

  values = [];

  constraints = {
    minLength: 11,
    maxLength: 11,
    sameValue: ['match_id'],
    diffValue: ['player_id', 'shirt_number'],
  };

  constructor(values) {
    super(values);
    this.values = values;
  }
};
