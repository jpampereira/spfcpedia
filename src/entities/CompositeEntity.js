const validator = require('../utils/validator')();
const exits = require('../configs/exits');

module.exports = class CompositeEntity {
  // Attributes:
  // entityName = null;
  // value = [];
  // constraints = { minLength, maxLength, sharedAttrs, uniqueAttrs }

  getCollection() {
    return this.value;
  }

  async collectionSizeIntoBoundaryOrError() {
    const errorMsgTemplate = exits.LIST_SIZE_ERROR;
    const errorMsg = errorMsgTemplate.replace(/<ENTITY_NAME>/, this.entityName);

    validator.arraySizeIsRespectedOrError(
      this.value,
      this.constraints.minLength,
      this.constraints.maxLength,
      errorMsg,
    );
  }

  async sharedAttributesConstraintOrError() {
    const errorMsgTemplate = exits.SINGLED_LIST_ITEM_ERROR;

    this.constraints.sharedAttrs.forEach((attribute) => {
      let errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, attribute);
      errorMsg = errorMsg.replace(/<ENTITY_NAME>/, this.entityName);

      validator.singledValueListOrError(this.value, errorMsg, attribute);
    });
  }

  async uniqueAttributesConstraintOrError() {
    const errorMsgTemplate = exits.DOUBLED_LIST_ITEM_ERROR;

    this.constraints.uniqueAttrs.forEach((attribute) => {
      let errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, attribute);
      errorMsg = errorMsg.replace(/<ENTITY_NAME>/, this.entityName);

      validator.nonDuplicateValuesOrError(this.value, errorMsg, attribute);
    });
  }

  async instanceIsNotInDbOrError() {
    const errorMsgTemplate = exits.UNIQUE_CONSTRAINT_ERROR;
    const errorMsg = errorMsgTemplate.replace(/<ATTR_NAME>/, this.constraints.majorAttr);

    const query = {};

    this.constraints.sharedAttrs.forEach((attribute) => {
      query[attribute] = this.value[0][attribute];
    });

    await validator.notExistsInDbOrError(this.entityName, query, errorMsg);
  }
};
