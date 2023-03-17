const validator = require('../utils/validator')();

module.exports = class General {
  setAttributes(obj) {
    const listOfAttributes = Object.entries(obj);

    listOfAttributes.forEach((attribute) => {
      const name = attribute[0];
      const value = attribute[1];

      if (this[name] !== undefined) {
        this[name].value = value;
      }
    });
  }

  getObject() {
    const obj = {};

    const listOfAttributes = Object.entries(this);

    listOfAttributes.forEach((attribute) => {
      const name = attribute[0];
      const value = attribute[1].value;

      obj[name] = value;
    });

    return obj;
  }

  allRequiredAttributesAreFilled() {
    const listOfAttributes = Object.entries(this);

    for (const attribute of listOfAttributes) {
      const name = attribute[0];
      const configs = attribute[1];

      if (configs.required) {
        try {
          validator.existsOrError(configs.value, `O atributo ${name} é obrigatório`);

        } catch (error) {
          throw error;
        }
      }
    }
  }
};
