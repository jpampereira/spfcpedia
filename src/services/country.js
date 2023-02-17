module.exports = (app) => {
  const { existsOrError, notExistsInDbOrError, removeTableControlFields } = app.errors.validator;

  const read = (filter = {}) => {
    return app.db('country').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (newCountries) => {
    for (const country of newCountries) {
      existsOrError(country.name, 'O atributo name é obrigatório');
      await notExistsInDbOrError('country', { name: country.name }, 'País já cadastrado');

      removeTableControlFields(country);
    }

    return app.db('country').insert(newCountries, ['id', 'name']);
  };

  const update = async (countryId, updatedCountry) => {
    const [countryInDb] = await read({ id: countryId });
    const newCountry = { ...countryInDb, ...updatedCountry };
    removeTableControlFields(newCountry);

    existsOrError(newCountry.name, 'O atributo name deve ser preenchido');
    await notExistsInDbOrError('country', ['name = ? and id <> ?', [newCountry.name, countryId]], 'País já cadastrado');

    newCountry.updated_at = 'now';

    return app.db('country').update(newCountry).where({ id: countryId });
  };

  const remove = async (countryId) => {
    await notExistsInDbOrError('city', { country_id: countryId }, 'O país possui cidades associadas');

    return app.db('country').del().where({ id: countryId });
  };

  return {
    read, create, update, remove,
  };
};
