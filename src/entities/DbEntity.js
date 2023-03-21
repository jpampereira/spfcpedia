const validator = require('../utils/validator')();
const exits = require('../configs/exits');

module.exports = class DbEntity {
  // Attributes:
  // entityName = '...'
  // attributes = { attribute: { value, required, unique }, ... }

  setAttributes(obj) {
    const listOfAttributes = Object.entries(obj);

    listOfAttributes.forEach((attribute) => {
      const [name, value] = attribute;

      if (this.attributes[name] !== undefined) {
        this.attributes[name].value = value;
      }
    });
  }

  getObject() {
    const obj = {};

    const listOfAttributes = Object.entries(this.attributes);

    listOfAttributes.forEach((attribute) => {
      const [name, { value }] = attribute;
      obj[name] = value;
    });

    return obj;
  }

  async allRequiredAttributesAreFilledOrError() {
    const errorMessage = exits.REQUIRED_ATTRIBUTE_ERROR;
    const listOfAttributes = Object.entries(this.attributes);

    for (const attribute of listOfAttributes) {
      const [name, configs] = attribute;

      if (configs.required) {
        validator.existsOrError(configs.value, errorMessage.replace(/<ATTR_NAME>/, name));
      }
    }
  }

  async uniqueConstraintInviolatedOrError(instanceId) {
    const errorMessage = exits.UNIQUE_CONSTRAINT_ERROR;
    const listOfAttributes = Object.entries(this.attributes);

    for (const attribute of listOfAttributes) {
      const [name, configs] = attribute;

      if (configs.value && configs.unique) {
        const query = `${name} = ? ${(instanceId ? 'and id <> ?' : '')}`;
        const values = [configs.value].concat(instanceId ? [instanceId] : []);

        await validator.notExistsInDbOrError(this.entityName, [query, values], errorMessage.replace(/<ATTR_NAME>/, name));
      }
    }
  }

  async instanceDoesntExistOrError(instanceId) {
    const errorMessage = exits.DOUBLE_INSTANCE_ERROR;
    let query = Object.keys(this.attributes).map((attrName) => `${attrName} = ?`).join(' and ');
    const values = Object.values(this.attributes).map((attrConfig) => attrConfig.value);

    if (instanceId !== undefined) {
      query += ' and id <> ?';
      values.push(instanceId);
    }

    await validator.notExistsInDbOrError(this.entityName, [query, values], errorMessage);
  }
};
