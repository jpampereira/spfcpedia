const validator = require('../utils/validator')();
const exits = require('../configs/exits');

module.exports = class CompositeEntity {
  // Attributes:
  // entityName = null;
  // values = [];
  // constraints = { minLength, maxLength, sharedAttrs, uniqueAttrs }

  constructor(values) {
    const errorMsg = exits.DATA_DOESNT_EXIST_ERROR;
    validator.existsOrError(values, errorMsg);
  }

  getCollection() {
    return this.values;
  }

  async collectionSizeIntoBoundaryOrError() {
    const errorMsgTemplate = exits.LIST_SIZE_ERROR;
    const errorMsg = errorMsgTemplate.replace(/<ENTITY_NAME>/, this.entityName);

    validator.arraySizeIsRespectedOrError(
      this.values,
      this.constraints.minLength,
      this.constraints.maxLength,
      errorMsg,
    );
  }

  async sharedAttributesConstraintOrError() {
    const errorMsgTemplate = exits.SINGLED_LIST_ITEM_ERROR;
    const sharedAttributesList = this.constraints.sharedAttrs;

    sharedAttributesList.forEach((attribute) => {
      let errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, attribute);
      errorMsg = errorMsg.replace(/<ENTITY_NAME>/, this.entityName);

      validator.singledValueListOrError(this.values, errorMsg, attribute);
    });
  }

  async uniqueAttributesConstraintOrError() {
    const errorMsgTemplate = exits.DOUBLED_LIST_ITEM_ERROR;
    const uniqueAttributesList = this.constraints.uniqueAttrs;

    uniqueAttributesList.forEach((attribute) => {
      let errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, attribute);
      errorMsg = errorMsg.replace(/<ENTITY_NAME>/, this.entityName);

      validator.nonDuplicateValuesOrError(this.values, errorMsg, attribute);
    });
  }

  async instanceIsNotInDbOrError() {
    const errorMsgTemplate = exits.UNIQUE_CONSTRAINT_ERROR;
    const errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, this.constraints.majorAttr);
    const sharedAttributesList = this.constraints.sharedAttrs;

    const query = {};

    sharedAttributesList.forEach((attribute) => {
      query[attribute] = this.values[0][attribute];
    });

    await validator.notExistsInDbOrError(this.entityName, query, errorMsg);
  }
};
