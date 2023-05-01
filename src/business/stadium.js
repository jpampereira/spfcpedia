const Stadium = require('../entities/Stadium');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.stadium.read(filter);
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

    return app.services.stadium.create(newStadiums);
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

    return app.services.stadium.update(stadiumId, newStadium);
  };

  const remove = async (stadiumId) => {
    let [currentStadium] = await read({ id: stadiumId });
    currentStadium = new Stadium(currentStadium);

    await currentStadium.dataIsNotForeignKeyOrError(stadiumId);

    return app.services.stadium.remove(stadiumId);
  };

  return { read, create, update, remove };
};
