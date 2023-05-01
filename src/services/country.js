const tableName = 'country';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'name',
    ]).where(filter).orderBy('id');
  };

  const create = (newCountries) => {
    return app.db(tableName).insert(newCountries, [
      'id',
      'name',
    ]);
  };

  const update = (countryId, updatedCountry) => {
    return app.db(tableName).update(updatedCountry).where({ id: countryId });
  };

  const remove = (countryId) => {
    return app.db(tableName).del().where({ id: countryId });
  };

  return { read, create, update, remove };
};
