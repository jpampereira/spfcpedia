const City = require('../entities/City');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.city.read(filter);
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

    return app.services.city.create(newCities);
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

    return app.services.city.update(cityId, newCity);
  };

  const remove = async (cityId) => {
    let [currentCity] = await read({ id: cityId });
    currentCity = new City(currentCity);

    await currentCity.dataIsNotForeignKeyOrError(cityId);

    return app.services.city.remove(cityId);
  };

  return { read, create, update, remove };
};
