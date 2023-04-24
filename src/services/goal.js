const Goal = require('../entities/Goal');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('goal').select(['id', 'lineup_id', 'substitution_id', 'period_id', 'time']).where(filter).orderBy('id');
  };

  const create = async (goals) => {
    const newGoals = [];

    for (const goal of goals) {
      const newGoal = new Goal(goal);

      await newGoal.requiredAttributesAreFilledOrError();
      await newGoal.attributesValueAreValidOrError();
      await newGoal.uniqueConstraintInviolatedOrError();
      await newGoal.onlyOneXorAttributeIsFilledOrError();
      await newGoal.instanceDoesntExistInDbOrError();

      newGoals.push(newGoal.getAttributes());
    }

    return app.db('goal').insert(newGoals, ['id', 'lineup_id', 'substitution_id', 'period_id', 'time']);
  };

  const update = async (goalId, updatedGoal) => {
    const [currentGoal] = await read({ id: goalId });
    let newGoal = new Goal(currentGoal);
    newGoal.setAttributes(updatedGoal);

    await newGoal.attributesValueAreValidOrError();
    await newGoal.requiredAttributesAreFilledOrError();
    await newGoal.uniqueConstraintInviolatedOrError(goalId);
    await newGoal.onlyOneXorAttributeIsFilledOrError();
    await newGoal.instanceDoesntExistInDbOrError(goalId);

    newGoal = newGoal.getAttributes();
    newGoal.updated_at = 'now';

    return app.db('goal').update(newGoal).where({ id: goalId });
  };

  const remove = async (goalId) => {
    let [currentGoal] = await read({ id: goalId });
    currentGoal = new Goal(currentGoal);

    await currentGoal.dependentEntitiesDoesntHaveDataOrError(goalId);

    return app.db('goal').del().where({ id: goalId });
  };

  return {
    read, create, update, remove,
  };
};
