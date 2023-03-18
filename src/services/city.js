const City = require('../entities/City');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('city').select(['id', 'name', 'country_id']).where(filter).orderBy('id');
  };

  const create = async (cities) => {
    const newCities = [];

    for (const city of cities) {
      const newCity = new City(city);

      await newCity.allRequiredAttributesAreFilledOrError();
      await newCity.validAttributesOrError();
      await newCity.uniqueConstraintInviolatedOrError();
      await newCity.instanceDoesntExistOrError();

      newCities.push(newCity.getObject());
    }

    return app.db('city').insert(newCities, ['id', 'name', 'country_id']);
  };

  const update = async (cityId, updatedCity) => {
    const [currentCity] = await read({ id: cityId });
    let newCity = new City({ ...currentCity, ...updatedCity });

    await newCity.validAttributesOrError();
    await newCity.allRequiredAttributesAreFilledOrError();
    await newCity.uniqueConstraintInviolatedOrError(cityId);
    await newCity.instanceDoesntExistOrError(cityId);

    newCity = newCity.getObject();
    newCity.updated_at = 'now';

    return app.db('city').update(newCity).where({ id: cityId });
  };

  const remove = async (cityId) => {
    await validator.notExistsInDbOrError('stadium', { city_id: cityId }, 'A cidade possuí estádios associados');

    return app.db('city').del().where({ id: cityId });
  };

  return {
    read, create, update, remove,
  };
};
