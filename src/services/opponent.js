const validator = require('../configs/validator')();
const Opponent = require('../entities/Opponent');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('opponent').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (opponents) => {
    const newOpponents = [];

    for (const opponent of opponents) {
      let newOpponent = new Opponent(opponent);

      newOpponent.allRequiredFieldsAreFilled();
      await validator.notExistsInDbOrError('opponent', { name: newOpponent.name.value }, 'Adversário já cadastrado');

      newOpponents.push(newOpponent.getObject());
    }

    return app.db('opponent').insert(newOpponents, ['id', 'name']);
  };

  const update = async (opponentId, updatedOpponent) => {
    const [currentOpponent] = await read({ id: opponentId });
    let newOpponent = new Opponent({ ...currentOpponent, ...updatedOpponent });
    
    validator.existsOrError(newOpponent.name.value, 'O valor de name é inválido');
    await validator.notExistsInDbOrError('opponent', ['name = ? and id <> ?', [newOpponent.name.value, opponentId]], 'Adversário já cadastrado');
    
    newOpponent = newOpponent.getObject();
    newOpponent.updated_at = 'now';

    return app.db('opponent').update(newOpponent).where({ id: opponentId });
  };

  const remove = async (opponentId) => {
    await validator.notExistsInDbOrError('match', { opponent: opponentId }, 'O adversário possui partidas associadas');

    return app.db('opponent').del().where({ id: opponentId });
  };

  return {
    read, create, update, remove,
  };
};
