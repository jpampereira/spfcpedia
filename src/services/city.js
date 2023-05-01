const tableName = 'city';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'name',
      'country_id',
    ]).where(filter).orderBy('id');
  };

  const create = (newCities) => {
    return app.db(tableName).insert(newCities, [
      'id',
      'name',
      'country_id',
    ]);
  };

  const update = (cityId, updatedCity) => {
    return app.db(tableName).update(updatedCity).where({ id: cityId });
  };

  const remove = (cityId) => {
    return app.db(tableName).del().where({ id: cityId });
  };

  return { read, create, update, remove };
};
