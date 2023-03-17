const Opponent = require('../entities/Opponent');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('opponent').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (opponents) => {
    const newOpponents = [];

    for (const opponent of opponents) {
      const newOpponent = new Opponent(opponent);

      newOpponent.allRequiredAttributesAreFilled();
      await validator.notExistsInDbOrError('opponent', { name: newOpponent.name.value }, 'Adversário já cadastrado');

      newOpponents.push(newOpponent.getObject());
    }

    return app.db('opponent').insert(newOpponents, ['id', 'name']);
  };

  const update = async (opponentId, updatedOpponent) => {
    const [currentOpponent] = await read({ id: opponentId });
    let newOpponent = new Opponent({ ...currentOpponent, ...updatedOpponent });
    
    await newOpponent.attributesValidation();
    await validator.notExistsInDbOrError('opponent', ['name = ? and id <> ?', [newOpponent.name.value, opponentId]], 'Adversário já cadastrado');
    
    newOpponent = newOpponent.getObject();
    newOpponent.updated_at = 'now';

    return app.db('opponent').update(newOpponent).where({ id: opponentId });
  };

  const remove = async (opponentId) => {
    await validator.notExistsInDbOrError('match', { opponent: opponentId }, 'O adversário possui partidas associadas');

    return app.db('opponent').del().where({ id: opponentId });
  };

  return { read, create, update, remove };
};
