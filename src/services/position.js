const tableName = 'position';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'symbol',
      'name',
    ]).where(filter).orderBy('id');
  };

  const create = (newPositions) => {
    return app.db(tableName).insert(newPositions, [
      'id',
      'symbol',
      'name',
    ]);
  };

  const update = (positionId, updatedPosition) => {
    return app.db(tableName).update(updatedPosition).where({ id: positionId });
  };

  const remove = (positionId) => {
    return app.db(tableName).del().where({ id: positionId });
  };

  return { read, create, update, remove };
};
