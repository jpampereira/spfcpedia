const tableName = 'stadium';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'name',
      'nickname',
      'city_id',
    ]).where(filter).orderBy('id');
  };

  const create = (newStadiums) => {
    return app.db(tableName).insert(newStadiums, [
      'id',
      'name',
      'nickname',
      'city_id',
    ]);
  };

  const update = (stadiumId, updatedStadium) => {
    return app.db(tableName).update(updatedStadium).where({ id: stadiumId });
  };

  const remove = (stadiumId) => {
    return app.db(tableName).del().where({ id: stadiumId });
  };

  return { read, create, update, remove };
};
