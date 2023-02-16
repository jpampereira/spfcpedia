module.exports = (app) => {
  const {
    existsOrError,
    existsInDbOrError,
    notExistsInDbOrError,
    removeTableControlFields,
  } = app.errors.validator;

  const read = (filter = {}) => {
    return app.db('stadium').select(['id', 'name', 'nickname', 'city_id']).where(filter);
  };

  const readByCountry = (countryId) => {
    return app.db('stadium').select(['stadium.id', 'stadium.name', 'stadium.nickname', 'stadium.city_id'])
      .join('city', 'stadium.city_id', 'city.id')
      .where({ 'city.country_id': countryId });
  };

  const create = async (newStadiums) => {
    for (const stadium of newStadiums) {
      existsOrError(stadium.name, 'Nome é um atributo obrigatório');
      existsOrError(stadium.city_id, 'ID da cidade é um atributo obrigatório');
      await existsInDbOrError('city', { id: stadium.city_id }, 'ID da cidade inexistente');
      await notExistsInDbOrError('stadium', { name: stadium.name }, 'Já existe um estádio cadastrado com esse nome');
      if (stadium.nickname !== '') await notExistsInDbOrError('stadium', { nickname: stadium.nickname }, 'Já existe um estádio cadastrado com esse apelido');

      removeTableControlFields(stadium);
    }

    return app.db('stadium').insert(newStadiums, ['id', 'name', 'nickname', 'city_id']);
  };

  const update = async (stadiumId, updatedStadium) => {
    if (updatedStadium.city_id) await existsInDbOrError('city', { id: updatedStadium.city_id }, 'ID da cidade inexistente');
    if (updatedStadium.name) await notExistsInDbOrError('stadium', { name: updatedStadium.name }, 'Já existe um estádio cadastrado com esse nome');
    if (updatedStadium.nickname) await notExistsInDbOrError('stadium', { nickname: updatedStadium.nickname }, 'Já existe um estádio cadastrado com esse apelido');

    removeTableControlFields(updatedStadium);
    const newStadium = { ...updatedStadium, updated_at: 'now' };

    return app.db('stadium').update(newStadium).where({ id: stadiumId });
  };

  const remove = (stadiumId) => {
    return app.db('stadium').del().where({ id: stadiumId });
  };

  return {
    read, readByCountry, create, update, remove,
  };
};
