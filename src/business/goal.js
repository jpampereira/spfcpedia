const Goal = require('../entities/Goal');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.goal.read(filter);
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

    return app.services.goal.create(newGoals);
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

    return app.services.goal.update(goalId, newGoal);
  };

  const remove = async (goalId) => {
    let [currentGoal] = await read({ id: goalId });
    currentGoal = new Goal(currentGoal);

    await currentGoal.dataIsNotForeignKeyOrError(goalId);

    return app.services.goal.remove(goalId);
  };

  return { read, create, update, remove };
};
