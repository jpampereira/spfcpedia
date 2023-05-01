const tableName = 'period';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'symbol',
      'name',
    ]).where(filter).orderBy('id');
  };

  const create = (newPeriods) => {
    return app.db(tableName).insert(newPeriods, [
      'id',
      'symbol',
      'name',
    ]);
  };

  const update = (periodId, updatedPeriod) => {
    return app.db(tableName).update(updatedPeriod).where({ id: periodId });
  };

  const remove = (periodId) => {
    return app.db(tableName).del().where({ id: periodId });
  };

  return { read, create, update, remove };
};
