const Tournament = require('../entities/Tournament');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('tournament').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (tournaments) => {
    const newTournaments = [];

    for (const tournament of tournaments) {
      const newTournament = new Tournament(tournament);

      await newTournament.allRequiredAttributesAreFilledOrError();
      await newTournament.validAttributesOrError();
      await newTournament.uniqueConstraintInviolatedOrError();
      await newTournament.instanceDoesntExistOrError();

      newTournaments.push(newTournament.getObject());
    }

    return app.db('tournament').insert(newTournaments, ['id', 'name']);
  };

  const update = async (tournamentId, updatedTournament) => {
    const [currentTournament] = await read({ id: tournamentId });
    let newTournament = new Tournament({ ...currentTournament, ...updatedTournament });

    await newTournament.validAttributesOrError();
    await newTournament.allRequiredAttributesAreFilledOrError();
    await newTournament.uniqueConstraintInviolatedOrError(tournamentId);
    await newTournament.instanceDoesntExistOrError(tournamentId);

    newTournament = newTournament.getObject();
    newTournament.updated_at = 'now';

    return app.db('tournament').update(newTournament).where({ id: tournamentId });
  };

  const remove = async (tournamentId) => {
    await validator.notExistsInDbOrError('stage', { tournament_id: tournamentId }, 'O campeonato possui fases associadas');

    return app.db('tournament').del().where({ id: tournamentId });
  };

  return {
    read, create, update, remove,
  };
};
