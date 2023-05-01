const SubstitutionPlayer = require('../entities/SubstitutionPlayer');
const Substitution = require('../entities/Substitution');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.substitution.read(filter);
  };

  const create = async (substitutions) => {
    let newSubstitutions = [];

    for (const substitution of substitutions) {
      const substitutionPlayer = new SubstitutionPlayer(substitution);

      await substitutionPlayer.requiredAttrsAreFilledOrError();
      await substitutionPlayer.attrsValuesAreValidOrError();
      await substitutionPlayer.attrsWithUniqueValueOrError();
      await substitutionPlayer.oneXorAttrIsFilledOrError();
      await substitutionPlayer.instanceIsNotInDbOrError();

      newSubstitutions.push(substitutionPlayer.getAttributes());
    }

    newSubstitutions = new Substitution(newSubstitutions);

    await newSubstitutions.collectionSizeIntoBoundaryOrError();
    await newSubstitutions.attrsWithSameValueOrError();
    await newSubstitutions.attrsWithDiffValueOrError();
    await newSubstitutions.instanceIsNotInDbOrError();

    newSubstitutions = newSubstitutions.getCollection();

    return app.services.substitution.create(newSubstitutions);
  };

  const update = async (substitutionPlayerId, updatedSubstitutionPlayer) => {
    const [currentSubstitutionPlayer] = await read({ id: substitutionPlayerId });
    let newSubstitutionPlayer = new SubstitutionPlayer(currentSubstitutionPlayer);
    newSubstitutionPlayer.setAttributes(updatedSubstitutionPlayer);

    await newSubstitutionPlayer.attrsValuesAreValidOrError();
    await newSubstitutionPlayer.requiredAttrsAreFilledOrError();
    await newSubstitutionPlayer.attrsWithUniqueValueOrError(substitutionPlayerId);
    await newSubstitutionPlayer.oneXorAttrIsFilledOrError();
    await newSubstitutionPlayer.instanceIsNotInDbOrError(substitutionPlayerId);

    newSubstitutionPlayer = newSubstitutionPlayer.getAttributes();
    newSubstitutionPlayer.updated_at = 'now';

    return app.services.substitution.update(substitutionPlayerId, newSubstitutionPlayer);
  };

  const remove = async (matchId) => {
    let currentSubstitution = await read({ match_id: matchId });
    currentSubstitution = new Substitution(currentSubstitution);
    currentSubstitution = currentSubstitution.getCollection();

    for (let currentSubstitutionPlayer of currentSubstitution) {
      const { id } = currentSubstitutionPlayer;
      currentSubstitutionPlayer = new SubstitutionPlayer(currentSubstitutionPlayer);

      await currentSubstitutionPlayer.dataIsNotForeignKeyOrError(id);
    }

    return app.services.substitution.remove(matchId);
  };

  return { read, create, update, remove };
};
