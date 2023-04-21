const Lineup = require('../entities/Lineup');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('lineup').select(['id', 'match_id', 'player_id', 'position', 'shirt_number']).where(filter);
  };

  const create = async (lineup) => {
    const newLineup = [];

    for (const player of lineup) {
      const chosePlayer = new Lineup(player);

      await chosePlayer.requiredAttributesAreFilledOrError();
      await chosePlayer.attributesValueAreValidOrError();
      await chosePlayer.uniqueConstraintInviolatedOrError();
      await chosePlayer.instanceDoesntExistInDbOrError();

      newLineup.push(chosePlayer.getAttributes());
    }

    return app.db('lineup').insert(newLineup, ['id', 'match_id', 'player_id', 'position', 'shirt_number']);
  };

  const update = async (chosePlayerId, updatedChosePlayer) => {
    const [currentChosePlayer] = await read({ id: chosePlayerId });
    let newChosePlayer = new Lineup({ ...currentChosePlayer, ...updatedChosePlayer });

    await newChosePlayer.attributesValueAreValidOrError();
    await newChosePlayer.requiredAttributesAreFilledOrError();
    await newChosePlayer.uniqueConstraintInviolatedOrError(chosePlayerId);
    await newChosePlayer.instanceDoesntExistInDbOrError(chosePlayerId);

    newChosePlayer = newChosePlayer.getAttributes();
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
