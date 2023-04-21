const Referee = require('../entities/Referee');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('referee').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (referees) => {
    const newReferees = [];

    for (const referee of referees) {
      const newReferee = new Referee(referee);

      await newReferee.requiredAttributesAreFilledOrError();
      await newReferee.attributesValueAreValidOrError();
      await newReferee.uniqueConstraintInviolatedOrError();
      await newReferee.instanceDoesntExistInDbOrError();

      newReferees.push(newReferee.getAttributes());
    }

    return app.db('referee').insert(newReferees, ['id', 'name']);
  };

  const update = async (refereeId, updatedReferee) => {
    const [currentReferee] = await read({ id: refereeId });
    let newReferee = new Referee({ ...currentReferee, ...updatedReferee });

    await newReferee.attributesValueAreValidOrError();
    await newReferee.requiredAttributesAreFilledOrError();
    await newReferee.uniqueConstraintInviolatedOrError(refereeId);
    await newReferee.instanceDoesntExistInDbOrError(refereeId);

    newReferee = newReferee.getAttributes();
    newReferee.updated_at = 'now';

    return app.db('referee').update(newReferee).where({ id: refereeId });
  };

  const remove = async (refereeId) => {
    let [currentReferee] = await read({ id: refereeId });
    currentReferee = new Referee(currentReferee);

    await currentReferee.dependentEntitiesDoesntHaveDataOrError(refereeId);
    await validator.notExistsInDbOrError('match', ['referee = ? or assistant_referee_1 = ? or assistant_referee_2 = ? or fourth_official = ?', refereeId], 'O árbitro possui partidas associadas');

    return app.db('referee').del().where({ id: refereeId });
  };

  return {
    read, create, update, remove,
  };
};
