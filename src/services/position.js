const Position = require('../entities/Position');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('position').select(['id', 'symbol', 'name']).where(filter);
  };

  const create = async (positions) => {
    const newPositions = [];

    for (const position of positions) {
      const newPosition = new Position(position);

      await newPosition.requiredAttributesAreFilledOrError();
      await newPosition.attributesValueAreValidOrError();
      await newPosition.uniqueConstraintInviolatedOrError();
      await newPosition.instanceDoesntExistInDbOrError();

      newPositions.push(newPosition.getAttributes());
    }

    return app.db('position').insert(newPositions, ['id', 'symbol', 'name']);
  };

  const update = async (positionId, updatedPosition) => {
    const [currentPosition] = await read({ id: positionId });
    let newPosition = new Position(currentPosition);
    newPosition.setAttributes(updatedPosition);

    await newPosition.attributesValueAreValidOrError();
    await newPosition.requiredAttributesAreFilledOrError();
    await newPosition.uniqueConstraintInviolatedOrError(positionId);
    await newPosition.instanceDoesntExistInDbOrError(positionId);

    newPosition = newPosition.getAttributes();
    newPosition.updated_at = 'now';

    return app.db('position').update(newPosition).where({ id: positionId });
  };

  const remove = async (positionId) => {
    let [currentPosition] = await read({ id: positionId });
    currentPosition = new Position(currentPosition);

    await currentPosition.dependentEntitiesDoesntHaveDataOrError(positionId);

    return app.db('position').del().where({ id: positionId });
  };

  return {
    read, create, update, remove,
  };
};
