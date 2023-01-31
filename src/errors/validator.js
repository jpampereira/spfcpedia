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
    const result = await app.db(table).select().where(filter);
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

  return {
    existsOrError, notExistsOrError, existsInDbOrError, notExistsInDbOrError,
  };
};
