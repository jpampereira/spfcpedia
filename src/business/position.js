const Position = require('../entities/Position');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.position.read(filter);
  };

  const create = async (positions) => {
    const newPositions = [];

    for (const position of positions) {
      const newPosition = new Position(position);

      await newPosition.requiredAttrsAreFilledOrError();
      await newPosition.attrsValuesAreValidOrError();
      await newPosition.attrsWithUniqueValueOrError();
      await newPosition.oneXorAttrIsFilledOrError();
      await newPosition.instanceIsNotInDbOrError();

      newPositions.push(newPosition.getAttributes());
    }

    return app.services.position.create(newPositions);
  };

  const update = async (positionId, updatedPosition) => {
    const [currentPosition] = await read({ id: positionId });
    let newPosition = new Position(currentPosition);
    newPosition.setAttributes(updatedPosition);

    await newPosition.attrsValuesAreValidOrError();
    await newPosition.requiredAttrsAreFilledOrError();
    await newPosition.attrsWithUniqueValueOrError(positionId);
    await newPosition.oneXorAttrIsFilledOrError();
    await newPosition.instanceIsNotInDbOrError(positionId);

    newPosition = newPosition.getAttributes();
    newPosition.updated_at = 'now';

    return app.services.position.update(positionId, newPosition);
  };

  const remove = async (positionId) => {
    let [currentPosition] = await read({ id: positionId });
    currentPosition = new Position(currentPosition);

    await currentPosition.dataIsNotForeignKeyOrError(positionId);

    return app.services.position.remove(positionId);
  };

  return {
    read, create, update, remove,
  };
};
