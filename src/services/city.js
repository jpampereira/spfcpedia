const {
  existsOrError,
  existsInDbOrError,
  notExistsInDbOrError,
  removeTableControlFields,
} = require('../configs/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('city').select(['id', 'name', 'country_id']).where(filter).orderBy('id');
  };

  const create = async (newCities) => {
    for (const city of newCities) {
      existsOrError(city.name, 'O atributo name é obrigatório');
      existsOrError(city.country_id, 'O atributo country_id é obrigatório');
      await existsInDbOrError('country', { id: city.country_id }, 'O valor de country_id é inválido');
      await notExistsInDbOrError('city', city, 'O país já possui uma cidade com esse nome');

      removeTableControlFields(city);
    }

    return app.db('city').insert(newCities, ['id', 'name', 'country_id']);
  };

  const update = async (cityId, updatedCity) => {
    const [cityInDb] = await read({ id: cityId });
    const newCity = { ...cityInDb, ...updatedCity };
    removeTableControlFields(newCity);

    existsOrError(newCity.name, 'O valor de name é inválido');
    await existsInDbOrError('country', { id: newCity.country_id }, 'O valor de country_id é inválido');
    await notExistsInDbOrError('city', ['name = ? and country_id = ? and id <> ?', [newCity.name, newCity.country_id, cityId]], 'O país já possui uma cidade com esse nome');

    newCity.updated_at = 'now';

    return app.db('city').update(newCity).where({ id: cityId });
  };

  const remove = async (cityId) => {
    await notExistsInDbOrError('stadium', { city_id: cityId }, 'A cidade possuí estádios associados');

    return app.db('city').del().where({ id: cityId });
  };

  return {
    read, create, update, remove,
  };
};
