const db = require('./db');
const ValidationError = require('../errors/ValidationError');

module.exports = () => {
  const existsOrError = (value, msg) => {
    if (value === undefined || value === null) throw new ValidationError(msg);
    if (typeof value === 'string' && !value.trim()) throw new ValidationError(msg);
  };

  const notExistsOrError = (value, msg) => {
    try {
      existsOrError(value, msg);
    } catch (e) {
      return;
    }

    throw new ValidationError(msg);
  };

  const existsInDbOrError = async (table, filter, msg) => {
    let whereFilter;

    if (Array.isArray(filter)) {
      const query = filter[0];
      let values = filter[1];
      const numOfQueryBindings = query.match(/\?/g).length;

      values = Array.isArray(values) ? values : [...new Array(numOfQueryBindings)].fill(values);

      whereFilter = db.raw(query, values);
    } else {
      whereFilter = filter;
    }

    const result = await db(table).select().where(whereFilter);

    if (result.length === 0) throw new ValidationError(msg);
  };

  const notExistsInDbOrError = async (table, filter, msg) => {
    try {
      await existsInDbOrError(table, filter, msg);
    } catch (e) {
      return;
    }

    throw new ValidationError(msg);
  };

  const isPositiveOrError = (value, msg) => {
    if (value < 0) throw new ValidationError(msg);
  };

  const isDateTimeFormatOrError = (value, msg) => {
    if (!value.match(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/)) throw new ValidationError(msg);
  };

  const isDateFormatOrError = (value, msg) => {
    if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) throw new ValidationError(msg);
  };

  const isUrlFormatOrError = (value, msg) => {
    if (!value.match(/^(https:\/\/)?(www\.)?\S+\.\S+(\.\S+)?\/.+$/)) throw new ValidationError(msg);
  };

  const isInArray = (value, array, msg) => {
    if (!array.includes(value)) throw new ValidationError(msg);
  };

  const isEqualOrError = (value1, value2, msg) => {
    if (value1 !== value2) throw new ValidationError(msg);
  };

  const notDuplicateValuesOrError = (array, attr, msg = attr) => {
    let newArray = array;

    if (attr !== msg) {
      newArray = newArray.map((elem) => elem[attr]);
    }

    const checkIfValueIsDuplicated = (elem, i, arr) => arr.indexOf(elem) !== i;
    const foundDuplicateValues = newArray.some(checkIfValueIsDuplicated);

    if (foundDuplicateValues) throw new ValidationError(msg);
  };

  const singleValueInArrayOrError = (array, attr, msg = attr) => {
    let newArray = array;

    if (attr !== msg) {
      newArray = newArray.map((elem) => elem[attr]);
    }

    const firstValue = newArray[0];
    const compareWithFirstValue = (elem) => elem === firstValue;
    const foundDifferentValues = !newArray.every(compareWithFirstValue);

    if (foundDifferentValues) throw new ValidationError(msg);
  };

  return {
    existsOrError,
    notExistsOrError,
    existsInDbOrError,
    notExistsInDbOrError,
    isPositiveOrError,
    isDateTimeFormatOrError,
    isDateFormatOrError,
    isUrlFormatOrError,
    isInArray,
    isEqualOrError,
    notDuplicateValuesOrError,
    singleValueInArrayOrError,
  };
};
