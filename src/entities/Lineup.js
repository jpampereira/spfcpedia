const DbEntity = require('./DbEntity');

module.exports = class Lineup extends DbEntity {
  entityName = 'lineup';

  attributes = {
    match_id: { value: null, required: true, unique: false },
    player_id: { value: null, required: true, unique: false },
    shirt_number: { value: null, required: true, unique: false },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
