const Tournament = require('../entities/Tournament');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('tournament').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (tournaments) => {
    const newTournaments = [];

    for (const tournament of tournaments) {
      const newTournament = new Tournament(tournament);

      await newTournament.requiredAttributesAreFilledOrError();
      await newTournament.attributesValueAreValidOrError();
      await newTournament.uniqueConstraintInviolatedOrError();
      await newTournament.instanceDoesntExistInDbOrError();

      newTournaments.push(newTournament.getAttributes());
    }

    return app.db('tournament').insert(newTournaments, ['id', 'name']);
  };

  const update = async (tournamentId, updatedTournament) => {
    const [currentTournament] = await read({ id: tournamentId });
    let newTournament = new Tournament({ ...currentTournament, ...updatedTournament });

    await newTournament.attributesValueAreValidOrError();
    await newTournament.requiredAttributesAreFilledOrError();
    await newTournament.uniqueConstraintInviolatedOrError(tournamentId);
    await newTournament.instanceDoesntExistInDbOrError(tournamentId);

    newTournament = newTournament.getAttributes();
    newTournament.updated_at = 'now';

    return app.db('tournament').update(newTournament).where({ id: tournamentId });
  };

  const remove = async (tournamentId) => {
    let [currentTournament] = await read({ id: tournamentId });
    currentTournament = new Tournament(currentTournament);

    await currentTournament.dependentEntitiesDoesntHaveDataOrError(tournamentId);

    return app.db('tournament').del().where({ id: tournamentId });
  };

  return {
    read, create, update, remove,
  };
};
