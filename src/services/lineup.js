const {
  existsOrError,
  existsInDbOrError,
  notExistsInDbOrError,
  isPositiveOrError,
  isEqualOrError,
  notDuplicateValuesOrError,
  singleValueInArrayOrError,
  removeTableControlFields,
} = require('../configs/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('lineup').select(['id', 'match_id', 'player_id', 'shirt_number']).where(filter);
  };

  const create = async (newLineup) => {
    isEqualOrError(newLineup.length, 11, 'O número de jogadores na escalação é inválido');
    notDuplicateValuesOrError(newLineup, 'player_id', 'Jogador duplicado na escalação');
    notDuplicateValuesOrError(newLineup, 'shirt_number', 'Número de camise duplicado na escalação');
    singleValueInArrayOrError(newLineup, 'match_id', 'A escalação deve fazer referência a uma única partida');

    for (const chosenPlayer of newLineup) {
      existsOrError(chosenPlayer.shirt_number, 'O atributo shirt_number é obrigatório');
      existsOrError(chosenPlayer.match_id, 'O atributo match_id é obrigatório');
      existsOrError(chosenPlayer.player_id, 'O atributo player_id é obrigatório');
      isPositiveOrError(chosenPlayer.shirt_number, 'O valor de shirt_number é inválido');
      await existsInDbOrError('match', { id: chosenPlayer.match_id }, 'O valor de match_id é inválido');
      await existsInDbOrError('player', { id: chosenPlayer.player_id }, 'O valor de player_id é inválido');
      await notExistsInDbOrError('lineup', { match_id: chosenPlayer.match_id }, 'Escalação da partida já cadastrada');

      removeTableControlFields(chosenPlayer);
    }

    return app.db('lineup').insert(newLineup, ['id', 'match_id', 'player_id', 'shirt_number']);
  };

  const update = async (chosenPlayerId, updatedChosenPlayer) => {
    const [chosenPlayerInDb] = await read({ id: chosenPlayerId });
    const newChosenPlayer = { ...chosenPlayerInDb, ...updatedChosenPlayer };
    removeTableControlFields(newChosenPlayer);

    newChosenPlayer.updated_at = 'now';

    return app.db('lineup').update(newChosenPlayer).where({ id: chosenPlayerId });
  };

  const remove = (matchId) => {
    return app.db('lineup').del().where({ match_id: matchId });
  };

  return {
    read, create, update, remove,
  };
};
