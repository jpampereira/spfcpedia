const Tournament = require('../entities/Tournament');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.tournament.read(filter);
  };

  const create = async (tournaments) => {
    const newTournaments = [];

    for (const tournament of tournaments) {
      const newTournament = new Tournament(tournament);

      await newTournament.requiredAttrsAreFilledOrError();
      await newTournament.attrsValuesAreValidOrError();
      await newTournament.attrsWithUniqueValueOrError();
      await newTournament.oneXorAttrIsFilledOrError();
      await newTournament.instanceIsNotInDbOrError();

      newTournaments.push(newTournament.getAttributes());
    }

    return app.services.tournament.create(newTournaments);
  };

  const update = async (tournamentId, updatedTournament) => {
    const [currentTournament] = await read({ id: tournamentId });
    let newTournament = new Tournament(currentTournament);
    newTournament.setAttributes(updatedTournament);

    await newTournament.attrsValuesAreValidOrError();
    await newTournament.requiredAttrsAreFilledOrError();
    await newTournament.attrsWithUniqueValueOrError(tournamentId);
    await newTournament.oneXorAttrIsFilledOrError();
    await newTournament.instanceIsNotInDbOrError(tournamentId);

    newTournament = newTournament.getAttributes();
    newTournament.updated_at = 'now';

    return app.services.tournament.update(tournamentId, newTournament);
  };

  const remove = async (tournamentId) => {
    let [currentTournament] = await read({ id: tournamentId });
    currentTournament = new Tournament(currentTournament);

    await currentTournament.dataIsNotForeignKeyOrError(tournamentId);

    return app.services.tournament.remove(tournamentId);
  };

  return { read, create, update, remove };
};
