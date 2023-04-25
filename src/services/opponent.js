const Opponent = require('../entities/Opponent');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('opponent').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (opponents) => {
    const newOpponents = [];

    for (const opponent of opponents) {
      const newOpponent = new Opponent(opponent);

      await newOpponent.requiredAttrsAreFilledOrError();
      await newOpponent.attrsValuesAreValidOrError();
      await newOpponent.attrsWithUniqueValueOrError();
      await newOpponent.oneXorAttrIsFilledOrError();
      await newOpponent.instanceIsNotInDbOrError();

      newOpponents.push(newOpponent.getAttributes());
    }

    return app.db('opponent').insert(newOpponents, ['id', 'name']);
  };

  const update = async (opponentId, updatedOpponent) => {
    const [currentOpponent] = await read({ id: opponentId });
    let newOpponent = new Opponent(currentOpponent);
    newOpponent.setAttributes(updatedOpponent);

    await newOpponent.attrsValuesAreValidOrError();
    await newOpponent.requiredAttrsAreFilledOrError();
    await newOpponent.attrsWithUniqueValueOrError(opponentId);
    await newOpponent.oneXorAttrIsFilledOrError();
    await newOpponent.instanceIsNotInDbOrError(opponentId);

    newOpponent = newOpponent.getAttributes();
    newOpponent.updated_at = 'now';

    return app.db('opponent').update(newOpponent).where({ id: opponentId });
  };

  const remove = async (opponentId) => {
    let [currentOpponent] = await read({ id: opponentId });
    currentOpponent = new Opponent(currentOpponent);

    await currentOpponent.dataIsNotForeignKeyOrError(opponentId);

    return app.db('opponent').del().where({ id: opponentId });
  };

  return {
    read, create, update, remove,
  };
};
