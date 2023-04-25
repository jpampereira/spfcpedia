const Referee = require('../entities/Referee');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('referee').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (referees) => {
    const newReferees = [];

    for (const referee of referees) {
      const newReferee = new Referee(referee);

      await newReferee.requiredAttrsAreFilledOrError();
      await newReferee.attrsValuesAreValidOrError();
      await newReferee.attrsWithUniqueValueOrError();
      await newReferee.oneXorAttrIsFilledOrError();
      await newReferee.instanceIsNotInDbOrError();

      newReferees.push(newReferee.getAttributes());
    }

    return app.db('referee').insert(newReferees, ['id', 'name']);
  };

  const update = async (refereeId, updatedReferee) => {
    const [currentReferee] = await read({ id: refereeId });
    let newReferee = new Referee(currentReferee);
    newReferee.setAttributes(updatedReferee);

    await newReferee.attrsValuesAreValidOrError();
    await newReferee.requiredAttrsAreFilledOrError();
    await newReferee.attrsWithUniqueValueOrError(refereeId);
    await newReferee.oneXorAttrIsFilledOrError();
    await newReferee.instanceIsNotInDbOrError(refereeId);

    newReferee = newReferee.getAttributes();
    newReferee.updated_at = 'now';

    return app.db('referee').update(newReferee).where({ id: refereeId });
  };

  const remove = async (refereeId) => {
    let [currentReferee] = await read({ id: refereeId });
    currentReferee = new Referee(currentReferee);

    await currentReferee.dataIsNotForeignKeyOrError(refereeId);

    return app.db('referee').del().where({ id: refereeId });
  };

  return {
    read, create, update, remove,
  };
};
