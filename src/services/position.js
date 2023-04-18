const Position = require('../entities/Position');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('position').select(['id', 'symbol', 'name']).where(filter);
  };

  const create = async (positions) => {
    const newPositions = [];

    for (const position of positions) {
      const newPosition = new Position(position);

      await newPosition.allRequiredAttributesAreFilledOrError();
      await newPosition.validAttributesOrError();
      await newPosition.uniqueConstraintInviolatedOrError();
      await newPosition.instanceDoesntExistOrError();

      newPositions.push(newPosition.getObject());
    }

    return app.db('position').insert(newPositions, ['id', 'symbol', 'name']);
  };

  const update = async (positionId, updatedPosition) => {
    const [currentPosition] = await read({ id: positionId });
    let newPosition = new Position({ ...currentPosition, ...updatedPosition });

    await newPosition.validAttributesOrError();
    await newPosition.allRequiredAttributesAreFilledOrError();
    await newPosition.uniqueConstraintInviolatedOrError(positionId);
    await newPosition.instanceDoesntExistOrError(positionId);

    newPosition = newPosition.getObject();
    newPosition.updated_at = 'now';

    return app.db('position').update(newPosition).where({ id: positionId });
  };

  const remove = async (positionId) => {
    await validator.notExistsInDbOrError('player', { position: positionId }, 'A posição possui jogadores associados');

    return app.db('position').del().where({ id: positionId });
  };

  return {
    read, create, update, remove,
  };
};
