const validator = require('../utils/validator')();
const exits = require('../configs/exits');

module.exports = class CompositeEntity {
  // Attributes:
  // entityName = null;
  // values = [];
  // constraints = { minLength, maxLength, sameValue, diffValue }

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

  async attrsWithSameValueOrError() {
    const errorMsgTemplate = exits.SINGLED_LIST_ITEM_ERROR;
    const attributes = this.constraints.sameValue;

    attributes.forEach((attribute) => {
      const errorMsg = errorMsgTemplate.replace(/<ITEM_NAME>/, attribute);

      validator.singledValueListOrError(this.values, errorMsg, attribute);
    });
  }

  async attrsWithDiffValueOrError() {
    const errorMsgTemplate = exits.DOUBLED_LIST_ITEM_ERROR;
    const attributes = this.constraints.diffValue;

    attributes.forEach((attribute) => {
      const errorMsg = errorMsgTemplate.replace(/<ITEM_NAME>/, attribute);

      validator.nonDuplicateValuesOrError(this.values, errorMsg, attribute);
    });
  }

  async instanceIsNotInDbOrError() {
    const errorMsg = exits.DOUBLE_INSTANCE_ERROR;
    const attributes = this.constraints.sameValue;

    const query = {};

    attributes.forEach((attribute) => {
      query[attribute] = this.values[0][attribute];
    });

    await validator.notExistsInDbOrError(this.entityName, query, errorMsg);
  }
};
