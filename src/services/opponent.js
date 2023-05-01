const tableName = 'opponent';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'name',
    ]).where(filter).orderBy('id');
  };

  const create = (newOpponents) => {
    return app.db(tableName).insert(newOpponents, [
      'id',
      'name',
    ]);
  };

  const update = (opponentId, updatedOpponent) => {
    return app.db(tableName).update(updatedOpponent).where({ id: opponentId });
  };

  const remove = (opponentId) => {
    return app.db(tableName).del().where({ id: opponentId });
  };

  return { read, create, update, remove };
};
