const db = require('../configs/db');
const ValidationError = require('../errors/ValidationError');

module.exports = () => {
  const existsOrError = (value, msg) => {
    if (value === undefined || value === null) throw new ValidationError(msg);
    if (typeof value === 'string' && !value.trim()) throw new ValidationError(msg);
    if (Array.isArray(value) && value.length === 0) throw new ValidationError(msg);
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

  const arraySizeIsRespectedOrError = (value, min, max, msg) => {
    if (value.length < min || value.length > max) throw new ValidationError(msg);
  };

  const nonDuplicateValuesOrError = (list, msg, attr) => {
    let newList = list;
    const firstValue = newList[0];

    if (typeof firstValue !== 'number' && typeof firstValue !== 'string') {
      newList = newList.map((obj) => obj[attr]);
    }

    const set = new Set(newList);

    if (newList.length !== set.size) throw new ValidationError(msg);
  };

  const singledValueListOrError = (list, msg, attr) => {
    let newList = list;
    let firstElement = newList[0];

    if (typeof firstElement !== 'number' && typeof firstElement !== 'string') {
      newList = newList.map((obj) => obj[attr]);
      firstElement = firstElement[attr];
    }

    const result = newList.every((item) => item === firstElement);

    if (!result) throw new ValidationError(msg);
  };

  const isTrueOrError = (value, msg) => {
    if (!value) throw new ValidationError(msg);
  };

  return {
    existsOrError,
    notExistsOrError,
    existsInDbOrError,
    notExistsInDbOrError,
    isPositiveOrError,
    isDateTimeFormatOrError,
    isDateFormatOrError,
    arraySizeIsRespectedOrError,
    nonDuplicateValuesOrError,
    singledValueListOrError,
    isTrueOrError,
  };
};
