const City = require('../entities/City');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('city').select(['id', 'name', 'country_id']).where(filter).orderBy('id');
  };

  const create = async (cities) => {
    const newCities = [];

    for (const city of cities) {
      const newCity = new City(city);

      await newCity.requiredAttrsAreFilledOrError();
      await newCity.attrsValuesAreValidOrError();
      await newCity.attrsWithUniqueValueOrError();
      await newCity.oneXorAttrIsFilledOrError();
      await newCity.instanceIsNotInDbOrError();

      newCities.push(newCity.getAttributes());
    }

    return app.db('city').insert(newCities, ['id', 'name', 'country_id']);
  };

  const update = async (cityId, updatedCity) => {
    const [currentCity] = await read({ id: cityId });
    let newCity = new City(currentCity);
    newCity.setAttributes(updatedCity);

    await newCity.attrsValuesAreValidOrError();
    await newCity.requiredAttrsAreFilledOrError();
    await newCity.attrsWithUniqueValueOrError(cityId);
    await newCity.oneXorAttrIsFilledOrError();
    await newCity.instanceIsNotInDbOrError(cityId);

    newCity = newCity.getAttributes();
    newCity.updated_at = 'now';

    return app.db('city').update(newCity).where({ id: cityId });
  };

  const remove = async (cityId) => {
    let [currentCity] = await read({ id: cityId });
    currentCity = new City(currentCity);

    await currentCity.dataIsNotForeignKeyOrError(cityId);

    return app.db('city').del().where({ id: cityId });
  };

  return {
    read, create, update, remove,
  };
};
