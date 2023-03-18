const validator = require('../utils/validator')();

module.exports = class General {
  setAttributes(obj) {
    const listOfAttributes = Object.entries(obj);

    listOfAttributes.forEach((attribute) => {
      const name = attribute[0];
      const value = attribute[1];

      if (this.attributes[name] !== undefined) {
        this.attributes[name].value = value;
      }
    });
  }

  getObject() {
    const obj = {};

    const listOfAttributes = Object.entries(this.attributes);

    listOfAttributes.forEach((attribute) => {
      const name = attribute[0];
      const value = attribute[1].value;

      obj[name] = value;
    });

    return obj;
  }

  async allRequiredAttributesAreFilledOrError() {
    const listOfAttributes = Object.entries(this.attributes);

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

  async uniqueAttributesValuesOrError(instanceId) {
    try {
      const uniqueAttributes = Object.entries(this.attributes).filter((attr) => attr[1].value && attr[1].unique);

      for (const attribute of uniqueAttributes) {
        const name = attribute[0];
        let query = `${name} = ?`;
        const values = [attribute[1].value];
  
        if (instanceId !== undefined) {
          query += ' and id <> ?';
          values.push(instanceId); 
        }
  
        await validator.notExistsInDbOrError(this.entityName, [query, values], `Já existe uma instância com esse ${name}`);
      }

    } catch (error) {
      throw error;
    }
  }

  async instanceDoesntExistOrError(instanceId) {
    try {
      let query = Object.keys(this.attributes).map((attrName) => `${attrName} = ?`).join(' and ');
      const values = Object.values(this.attributes).map((attr) => attr.value);

      if (instanceId !== undefined) {
        query += ' and id <> ?';
        values.push(instanceId); 
      }

      await validator.notExistsInDbOrError(this.entityName, [query, values], `A instância de ${this.entityName} já existe`);

    } catch (error) {
      throw error;
    }
  }
};
