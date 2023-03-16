const validator = require('../configs/validator')();
const Stadium = require('../entities/Stadium');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('stadium').select(['id', 'name', 'nickname', 'city_id']).where(filter).orderBy('id');
  };

  const create = async (stadiums) => {
    const newStadiums = [];

    for (const stadium of stadiums) {
      let newStadium = new Stadium(stadium);

      newStadium.allRequiredFieldsAreFilled();
      await validator.existsInDbOrError('city', { id: newStadium.city_id.value }, 'O valor de city_id é inválido');
      await validator.notExistsInDbOrError('stadium', { name: newStadium.name.value }, 'Estádio já cadastrado');
      if (newStadium.nickname.value) await validator.notExistsInDbOrError('stadium', { nickname: newStadium.nickname.value }, 'Apelido já utilizado por outro estádio');

      newStadiums.push(newStadium.getObject());
    }

    return app.db('stadium').insert(newStadiums, ['id', 'name', 'nickname', 'city_id']);
  };

  const update = async (stadiumId, updatedStadium) => {
    const [currentStadium] = await read({ id: stadiumId });
    let newStadium = new Stadium({ ...currentStadium, ...updatedStadium });
    
    validator.existsOrError(newStadium.name.value, 'O valor de name é inválido');
    await validator.existsInDbOrError('city', { id: newStadium.city_id.value }, 'O valor de city_id é inválido');
    await validator.notExistsInDbOrError('stadium', ['name = ? and id <> ?', [newStadium.name.value, stadiumId]], 'Estádio já cadastrado');
    if (newStadium.nickname.value) await validator.notExistsInDbOrError('stadium', ['nickname = ? and id <> ?', [newStadium.nickname.value, stadiumId]], 'Apelido já utilizado por outro estádio');
    
    newStadium = newStadium.getObject();
    newStadium.updated_at = 'now';

    return app.db('stadium').update(newStadium).where({ id: stadiumId });
  };

  const remove = async (stadiumId) => {
    await validator.notExistsInDbOrError('match', { local: stadiumId }, 'O estádio possui partidas associadas');

    return app.db('stadium').del().where({ id: stadiumId });
  };

  return {
    read, create, update, remove,
  };
};
