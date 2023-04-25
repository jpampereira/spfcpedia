const Stadium = require('../entities/Stadium');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('stadium').select(['id', 'name', 'nickname', 'city_id']).where(filter).orderBy('id');
  };

  const create = async (stadiums) => {
    const newStadiums = [];

    for (const stadium of stadiums) {
      const newStadium = new Stadium(stadium);

      await newStadium.requiredAttrsAreFilledOrError();
      await newStadium.attrsValuesAreValidOrError();
      await newStadium.attrsWithUniqueValueOrError();
      await newStadium.oneXorAttrIsFilledOrError();
      await newStadium.instanceIsNotInDbOrError();

      newStadiums.push(newStadium.getAttributes());
    }

    return app.db('stadium').insert(newStadiums, ['id', 'name', 'nickname', 'city_id']);
  };

  const update = async (stadiumId, updatedStadium) => {
    const [currentStadium] = await read({ id: stadiumId });
    let newStadium = new Stadium(currentStadium);
    newStadium.setAttributes(updatedStadium);

    await newStadium.attrsValuesAreValidOrError();
    await newStadium.requiredAttrsAreFilledOrError();
    await newStadium.attrsWithUniqueValueOrError(stadiumId);
    await newStadium.oneXorAttrIsFilledOrError();
    await newStadium.instanceIsNotInDbOrError(stadiumId);

    newStadium = newStadium.getAttributes();
    newStadium.updated_at = 'now';

    return app.db('stadium').update(newStadium).where({ id: stadiumId });
  };

  const remove = async (stadiumId) => {
    let [currentStadium] = await read({ id: stadiumId });
    currentStadium = new Stadium(currentStadium);

    await currentStadium.dataIsNotForeignKeyOrError(stadiumId);

    return app.db('stadium').del().where({ id: stadiumId });
  };

  return {
    read, create, update, remove,
  };
};
