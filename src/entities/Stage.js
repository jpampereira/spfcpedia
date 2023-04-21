const IndividualEntity = require('./IndividualEntity');

module.exports = class Stage extends IndividualEntity {
  entityName = 'stage';

  attributes = {
    name: {
      value: null, required: true, unique: false, validations: ['exists'], relatedEntity: null,
    },
    tournament_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'tournament',
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
