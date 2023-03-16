const validator = require('../configs/validator')();
const Tournament = require('../entities/Tournament');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('tournament').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (tournaments) => {
    const newTournaments = [];

    for (const tournament of tournaments) {
      let newTournament = new Tournament(tournament);

      newTournament.allRequiredFieldsAreFilled();
      await validator.notExistsInDbOrError('tournament', { name: newTournament.name.value }, 'Campeonato já cadastrado');

      newTournaments.push(newTournament.getObject());
    }

    return app.db('tournament').insert(newTournaments, ['id', 'name']);
  };

  const update = async (tournamentId, updatedTournament) => {
    const [currentTournament] = await read({ id: tournamentId });
    let newTournament = new Tournament({ ...currentTournament, ...updatedTournament });
    
    validator.existsOrError(newTournament.name.value, 'O valor de name é inválido');
    await validator.notExistsInDbOrError('tournament', ['name = ? and id <> ?', [newTournament.name.value, tournamentId]], 'Campeonato já cadastrado');
    
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
