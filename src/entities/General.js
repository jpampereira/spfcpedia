const validator = require('../configs/validator')();

module.exports = class General {
  setFields(obj) {
    const arrayOfEntityFields = Object.entries(obj);

    arrayOfEntityFields.forEach((entityField) => {
      const name = entityField[0];
      const value = entityField[1];

      if (this[name] !== undefined) {
        this[name].value = value;
      }
    });
  }

  getObject() {
    const obj = {};

    const arrayOfEntityFields = Object.entries(this);

    arrayOfEntityFields.forEach((entityField) => {
      const name = entityField[0];
      const configs = entityField[1];

      obj[name] = configs.value;
    });

    return obj;
  }

  allRequiredFieldsAreFilled() {
    const arrayOfEntityFields = Object.entries(this);

    for (const entityField of arrayOfEntityFields) {
      const name = entityField[0];
      const configs = entityField[1];

      if (configs.required) {
        try {
          validator.existsOrError(configs.value, `O atributo ${name} é obrigatório`);
        } catch (e) {
          throw e;
        }
      }
    }
  }
};
