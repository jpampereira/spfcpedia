const validator = require('../utils/validator')();
const exits = require('../configs/exits');

module.exports = class IndividualEntity {
  // Attributes:
  // entityName = '...'
  // attributes = { attribute: { value, required, unique, validations, relatedEntity }, ... }

  setAttributes(obj) {
    const listOfAttributes = Object.entries(obj);

    listOfAttributes.forEach((attribute) => {
      const [name, value] = attribute;

      if (this.attributes[name] !== undefined) {
        this.attributes[name].value = value;
      }
    });
  }

  getAttributes() {
    const obj = {};

    const listOfAttributes = Object.entries(this.attributes);

    listOfAttributes.forEach((attribute) => {
      const [name, { value }] = attribute;
      obj[name] = value;
    });

    return obj;
  }

  async requiredAttributesAreFilledOrError() {
    const errorMsgTemplate = exits.REQUIRED_ATTRIBUTE_ERROR;
    const listOfAttributes = Object.entries(this.attributes);

    for (const attribute of listOfAttributes) {
      const [name, { value, required }] = attribute;

      const errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, name);

      if (required) {
        validator.existsOrError(value, errorMsg);
      }
    }
  }

  async attributesValueAreValidOrError() {
    const errorMsgTemplate = exits.INVALID_ATTRIBUTE_ERROR;
    const listOfAttributes = Object.entries(this.attributes);

    for (const attribute of listOfAttributes) {
      const [name, { value, validations, relatedEntity }] = attribute;

      for (const validation of validations) {
        const errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, name);

        switch (validation) {
          case 'exists':
            validator.existsOrError(value, errorMsg);
            break;
          case 'inDb':
            await validator.existsInDbOrError(relatedEntity, { id: value }, errorMsg);
            break;
          case 'isPositive':
            validator.isPositiveOrError(value, errorMsg);
            break;
          case 'datetime':
            validator.isDateTimeFormatOrError(value, errorMsg);
            break;
          case 'date':
            validator.isDateFormatOrError(value, errorMsg);
            break;
          default:
            break;
        }
      }
    }
  }

  async uniqueConstraintInviolatedOrError(instanceId) {
    const errorMsgTemplate = exits.UNIQUE_CONSTRAINT_ERROR;
    const listOfAttributes = Object.entries(this.attributes);

    for (const attribute of listOfAttributes) {
      const [name, { value, unique }] = attribute;

      const errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, name);

      if (value && unique) {
        const query = `${name} = ? ${(instanceId ? 'and id <> ?' : '')}`;
        const values = [value].concat(instanceId ? [instanceId] : []);

        await validator.notExistsInDbOrError(this.entityName, [query, values], errorMsg);
      }
    }
  }

  async instanceDoesntExistInDbOrError(instanceId) {
    const errorMsg = exits.DOUBLE_INSTANCE_ERROR;
    let query = Object.keys(this.attributes).map((attrName) => `${attrName} = ?`).join(' and ');
    const values = Object.values(this.attributes).map((attrConfig) => attrConfig.value);

    if (instanceId !== undefined) {
      query += ' and id <> ?';
      values.push(instanceId);
    }

    await validator.notExistsInDbOrError(this.entityName, [query, values], errorMsg);
  }
};
