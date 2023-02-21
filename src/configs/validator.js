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

  const removeTableControlFields = (object) => {
    const newObject = object;

    delete newObject.id;
    delete newObject.created_at;
    delete newObject.updated_at;
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
    removeTableControlFields,
  };
};
