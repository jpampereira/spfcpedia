const validator = require('../configs/validator')();
const Lineup = require('../entities/Lineup');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('lineup').select(['id', 'match_id', 'player_id', 'shirt_number']).where(filter);
  };

  const create = async (lineup) => {
    validator.isEqualOrError(lineup.length, 11, 'O número de jogadores na escalação é inválido');
    validator.notDuplicateValuesOrError(lineup, 'player_id', 'Jogador duplicado na escalação');
    validator.notDuplicateValuesOrError(lineup, 'shirt_number', 'Número de camise duplicado na escalação');
    validator.singleValueInArrayOrError(lineup, 'match_id', 'A escalação deve fazer referência a uma única partida');

    const newLineup = [];

    for (const chosePlayer of lineup) {
      let newChosePlayer = new Lineup(chosePlayer);

      newChosePlayer.allRequiredFieldsAreFilled();
      validator.isPositiveOrError(newChosePlayer.shirt_number.value, 'O valor de shirt_number é inválido');
      await validator.existsInDbOrError('match', { id: newChosePlayer.match_id.value }, 'O valor de match_id é inválido');
      await validator.existsInDbOrError('player', { id: newChosePlayer.player_id.value }, 'O valor de player_id é inválido');
      await validator.notExistsInDbOrError('lineup', { match_id: newChosePlayer.match_id.value }, 'Escalação da partida já cadastrada');

      newLineup.push(newChosePlayer.getObject());
    }

    return app.db('lineup').insert(newLineup, ['id', 'match_id', 'player_id', 'shirt_number']);
  };

  const update = async (chosePlayerId, updatedChosePlayer) => {
    const [currentChosePlayer] = await read({ id: chosePlayerId });
    let newChosePlayer = new Lineup({ ...currentChosePlayer, ...updatedChosePlayer });
    
    newChosePlayer = newChosePlayer.getObject();
    newChosePlayer.updated_at = 'now';
    
    return app.db('lineup').update(newChosePlayer).where({ id: chosePlayerId });
  };

  const remove = (matchId) => {
    return app.db('lineup').del().where({ match_id: matchId });
  };

  return {
    read, create, update, remove,
  };
};
