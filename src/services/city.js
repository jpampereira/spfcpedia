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

      newCity.allRequiredAttributesAreFilled();
      await newCity.attributesValidation();
      await validator.notExistsInDbOrError('city', newCity.getObject(), 'O país já possui uma cidade com esse nome');

      newCities.push(newCity.getObject());
    }

    return app.db('city').insert(newCities, ['id', 'name', 'country_id']);
  };

  const update = async (cityId, updatedCity) => {
    const [currentCity] = await read({ id: cityId });
    let newCity = new City({ ...currentCity, ...updatedCity });
    
    await newCity.attributesValidation();
    await validator.notExistsInDbOrError('city', ['name = ? and country_id = ? and id <> ?', [newCity.name.value, newCity.country_id.value, cityId]], 'O país já possui uma cidade com esse nome');
    
    newCity = newCity.getObject();
    newCity.updated_at = 'now';

    return app.db('city').update(newCity).where({ id: cityId });
  };

  const remove = async (cityId) => {
    await validator.notExistsInDbOrError('stadium', { city_id: cityId }, 'A cidade possuí estádios associados');

    return app.db('city').del().where({ id: cityId });
  };

  return { read, create, update, remove };
};
