const ValidationError = require('./ValidationError');

module.exports = (app) => {
  function existsOrError(value, msg) {
    if (!value) throw new ValidationError(msg);
    if (typeof value === 'string' && !value.trim()) throw new ValidationError(msg);
  }

  function notExistsOrError(value, msg) {
    try {
      existsOrError(value, msg);
    } catch (e) {
      return;
    }

    throw new ValidationError(msg);
  }

  async function existsInDbOrError(table, filter, msg) {
    const whereFilter = Array.isArray(filter) ? app.db.raw(...filter) : filter;
    const result = await app.db(table).select().where(whereFilter);

    if (result.length === 0) throw new ValidationError(msg);
  }

  async function notExistsInDbOrError(table, filter, msg) {
    try {
      await existsInDbOrError(table, filter, msg);
    } catch (e) {
      return;
    }

    throw new ValidationError(msg);
  }

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
    removeTableControlFields,
  };
};
