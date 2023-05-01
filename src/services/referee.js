const tableName = 'referee';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'name',
    ]).where(filter).orderBy('id');
  };

  const create = (newReferees) => {
    return app.db(tableName).insert(newReferees, [
      'id',
      'name',
    ]);
  };

  const update = (refereeId, updatedReferee) => {
    return app.db(tableName).update(updatedReferee).where({ id: refereeId });
  };

  const remove = (refereeId) => {
    return app.db(tableName).del().where({ id: refereeId });
  };

  return { read, create, update, remove };
};
