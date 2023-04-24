const validator = require('../utils/validator')();
const exits = require('../configs/exits');

module.exports = class IndividualEntity {
  // Attributes:
  // entityName = '...'
  // attributes = { attribute: { value, required, unique, validations, relatedEntity, xor }, ... }
  // dependentEntities = []

  constructor(obj) {
    const errorMsg = exits.DATA_DOESNT_EXIST_ERROR;
    validator.existsOrError(obj, errorMsg);
  }

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

    listOfAttributes.forEach((attribute) => {
      const [name, { value, required }] = attribute;

      const errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, name);

      if (required) {
        validator.existsOrError(value, errorMsg);
      }
    });
  }

  async attributesValueAreValidOrError() {
    const errorMsgTemplate = exits.INVALID_ATTRIBUTE_ERROR;
    const listOfAttributes = Object.entries(this.attributes);

    for (const attribute of listOfAttributes) {
      const [name, { value, validations, relatedEntity }] = attribute;

      if (value !== undefined && value !== null) {
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
    const listOfAttributes = Object.entries(this.attributes);

    const query = [];
    const values = [];

    listOfAttributes.forEach((attribute) => {
      const [name, { value }] = attribute;

      if (value === null) {
        query.push(`${name} is null`);
      } else {
        query.push(`${name} = ?`);
        values.push(value);
      }
    });

    if (instanceId !== undefined) {
      query.push('id <> ?');
      values.push(instanceId);
    }

    await validator.notExistsInDbOrError(this.entityName, [query.join(' and '), values], errorMsg);
  }

  async dependentEntitiesDoesntHaveDataOrError(instanceId) {
    const errorMsgTemplate = exits.DATA_DEPENDENCY_ERROR;

    for (const dependent of this.dependentEntities) {
      const errorMsg = errorMsgTemplate.replace(/<ENTITY_NAME>/, dependent);

      const query = {};
      query[`${this.entityName}_id`] = instanceId;

      await validator.notExistsInDbOrError(dependent, query, errorMsg);
    }
  }

  async onlyOneXorAttributeIsFilledOrError() {
    const listOfAttributes = Object.entries(this.attributes);
    const errorMsgTemplate = exits.XOR_ATTRIBUTES_ERROR;

    const getAttributesName = (attribute) => attribute[0];
    const getXorAttributes = (attribute) => attribute[1].xor;
    const xorAttributesName = listOfAttributes.filter(getXorAttributes).map(getAttributesName);

    if (xorAttributesName.length > 0) {
      const errorMsg = errorMsgTemplate.replace(/<LIST_OF_ATTRS>/, xorAttributesName.join(', '));

      let result = false;

      xorAttributesName.forEach((attributeName) => {
        result = !!(result ^ !!this.attributes[attributeName].value); // XOR operation
      });

      validator.isTrueOrError(result, errorMsg);
    }
  }
};
