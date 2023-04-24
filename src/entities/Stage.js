const IndividualEntity = require('./IndividualEntity');

module.exports = class Stage extends IndividualEntity {
  entityName = 'stage';

  attributes = {
    name: {
      value: null,
      required: true,
      unique: false,
      validations: ['exists'],
      relatedEntity: null,
      xor: false,
    },

    tournament_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'tournament',
      xor: false,
    },
  };

  dependentEntities = ['match'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
