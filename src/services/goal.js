const Goal = require('../entities/Goal');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('goal').select(['id', 'lineup_id', 'substitution_id', 'period_id', 'time']).where(filter).orderBy('id');
  };

  const create = async (goals) => {
    const newGoals = [];

    for (const goal of goals) {
      const newGoal = new Goal(goal);

      await newGoal.requiredAttrsAreFilledOrError();
      await newGoal.attrsValuesAreValidOrError();
      await newGoal.attrsWithUniqueValueOrError();
      await newGoal.oneXorAttrIsFilledOrError();
      await newGoal.instanceIsNotInDbOrError();

      newGoals.push(newGoal.getAttributes());
    }

    return app.db('goal').insert(newGoals, ['id', 'lineup_id', 'substitution_id', 'period_id', 'time']);
  };

  const update = async (goalId, updatedGoal) => {
    const [currentGoal] = await read({ id: goalId });
    let newGoal = new Goal(currentGoal);
    newGoal.setAttributes(updatedGoal);

    await newGoal.attrsValuesAreValidOrError();
    await newGoal.requiredAttrsAreFilledOrError();
    await newGoal.attrsWithUniqueValueOrError(goalId);
    await newGoal.oneXorAttrIsFilledOrError();
    await newGoal.instanceIsNotInDbOrError(goalId);

    newGoal = newGoal.getAttributes();
    newGoal.updated_at = 'now';

    return app.db('goal').update(newGoal).where({ id: goalId });
  };

  const remove = async (goalId) => {
    let [currentGoal] = await read({ id: goalId });
    currentGoal = new Goal(currentGoal);

    await currentGoal.dataIsNotForeignKeyOrError(goalId);

    return app.db('goal').del().where({ id: goalId });
  };

  return {
    read, create, update, remove,
  };
};
