const ValidationError = require('./ValidationError');

module.exports = (app) => {
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

      whereFilter = app.db.raw(query, values);
    } else {
      whereFilter = filter;
    }

    const result = await app.db(table).select().where(whereFilter);

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
    if (!value.match(/^\d+-\d+-\d+\s+\d+:\d+$/)) throw new ValidationError(msg);
  };

  const isUrlFormatOrError = (value, msg) => {
    if (!value.match(/^(https:\/\/)?(www\.)?\S+\.com(\.\S+)?\/.+$/)) throw new ValidationError(msg);
  };

  function removeTableControlFields(object) {
    const newObject = object;

    delete newObject.id;
    delete newObject.inserted_at;
    delete newObject.updated_at;
  }

  return {
    existsOrError,
    notExistsOrError,
    existsInDbOrError,
    notExistsInDbOrError,
    isPositiveOrError,
    isDateTimeFormatOrError,
    isUrlFormatOrError,
    removeTableControlFields,
  };
};
