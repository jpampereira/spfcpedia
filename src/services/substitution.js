const SubstitutionPlayer = require('../entities/SubstitutionPlayer');
const Substitution = require('../entities/Substitution');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('substitution').select(['id', 'match_id', 'player_id', 'position_id', 'shirt_number', 'lineup_id', 'period_id', 'time']).where(filter);
  };

  const create = async (substitutions) => {
    let newSubstitutions = [];

    for (const substitution of substitutions) {
      const substitutionPlayer = new SubstitutionPlayer(substitution);

      await substitutionPlayer.requiredAttributesAreFilledOrError();
      await substitutionPlayer.attributesValueAreValidOrError();
      await substitutionPlayer.uniqueConstraintInviolatedOrError();
      await substitutionPlayer.instanceDoesntExistInDbOrError();

      newSubstitutions.push(substitutionPlayer.getAttributes());
    }

    newSubstitutions = new Substitution(newSubstitutions);

    await newSubstitutions.collectionSizeIntoBoundaryOrError();
    await newSubstitutions.sharedAttributesConstraintOrError();
    await newSubstitutions.uniqueAttributesConstraintOrError();
    await newSubstitutions.instanceIsNotInDbOrError();

    newSubstitutions = newSubstitutions.getCollection();

    return app.db('substitution').insert(newSubstitutions, ['id', 'match_id', 'player_id', 'position_id', 'shirt_number', 'lineup_id', 'period_id', 'time']);
  };

  const update = async (substitutionPlayerId, updatedSubstitutionPlayer) => {
    const [currentSubstitutionPlayer] = await read({ id: substitutionPlayerId });
    let substitutionPlayer = new SubstitutionPlayer(currentSubstitutionPlayer);
    substitutionPlayer.setAttributes(updatedSubstitutionPlayer);

    await substitutionPlayer.attributesValueAreValidOrError();
    await substitutionPlayer.requiredAttributesAreFilledOrError();
    await substitutionPlayer.uniqueConstraintInviolatedOrError(substitutionPlayerId);
    await substitutionPlayer.instanceDoesntExistInDbOrError(substitutionPlayerId);

    substitutionPlayer = substitutionPlayer.getAttributes();
    substitutionPlayer.updated_at = 'now';

    return app.db('substitution').update(substitutionPlayer).where({ id: substitutionPlayerId });
  };

  const remove = async (matchId) => {
    let currentSubstitution = await read({ match_id: matchId });
    currentSubstitution = new Substitution(currentSubstitution);
    currentSubstitution = currentSubstitution.getCollection();

    for (let currentSubstitutionPlayer of currentSubstitution) {
      const { id } = currentSubstitutionPlayer;
      currentSubstitutionPlayer = new SubstitutionPlayer(currentSubstitutionPlayer);

      await currentSubstitutionPlayer.dependentEntitiesDoesntHaveDataOrError(id);
    }

    return app.db('substitution').del().where({ match_id: matchId });
  };

  return {
    read, create, update, remove,
  };
};
