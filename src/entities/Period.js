const IndividualEntity = require('./IndividualEntity');

module.exports = class Period extends IndividualEntity {
  entityName = 'period';

  attributes = {
    symbol: {
      value: null,
      required: true,
      unique: true,
      validations: ['exists'],
      relatedEntity: null,
      xor: false,
    },

    name: {
      value: null,
      required: true,
      unique: true,
      validations: ['exists'],
      relatedEntity: null,
      xor: false,
    },
  };

  dependentEntities = ['substitution', 'goal'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
