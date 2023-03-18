const Lineup = require('../entities/Lineup');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('lineup').select(['id', 'match_id', 'player_id', 'shirt_number']).where(filter);
  };

  const create = async (lineup) => {
    const newLineup = [];

    for (const chosePlayer of lineup) {
      const newChosePlayer = new Lineup(chosePlayer);
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

  return { read, create, update, remove };
};
