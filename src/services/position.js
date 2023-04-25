const Position = require('../entities/Position');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('position').select(['id', 'symbol', 'name']).where(filter).orderBy('id');
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

    return app.db('position').insert(newPositions, ['id', 'symbol', 'name']);
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

    return app.db('position').update(newPosition).where({ id: positionId });
  };

  const remove = async (positionId) => {
    let [currentPosition] = await read({ id: positionId });
    currentPosition = new Position(currentPosition);

    await currentPosition.dataIsNotForeignKeyOrError(positionId);

    return app.db('position').del().where({ id: positionId });
  };

  return {
    read, create, update, remove,
  };
};
