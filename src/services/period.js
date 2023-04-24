const Period = require('../entities/Period');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('period').select(['id', 'symbol', 'name']).where(filter).orderBy('id');
  };

  const create = async (periods) => {
    const newPeriods = [];

    for (const period of periods) {
      const newPeriod = new Period(period);

      await newPeriod.requiredAttributesAreFilledOrError();
      await newPeriod.attributesValueAreValidOrError();
      await newPeriod.uniqueConstraintInviolatedOrError();
      await newPeriod.onlyOneXorAttributeIsFilledOrError();
      await newPeriod.instanceDoesntExistInDbOrError();

      newPeriods.push(newPeriod.getAttributes());
    }

    return app.db('period').insert(newPeriods, ['id', 'symbol', 'name']);
  };

  const update = async (periodId, updatedPeriod) => {
    const [currentPeriod] = await read({ id: periodId });
    let newPeriod = new Period(currentPeriod);
    newPeriod.setAttributes(updatedPeriod);

    await newPeriod.attributesValueAreValidOrError();
    await newPeriod.requiredAttributesAreFilledOrError();
    await newPeriod.uniqueConstraintInviolatedOrError(periodId);
    await newPeriod.onlyOneXorAttributeIsFilledOrError();
    await newPeriod.instanceDoesntExistInDbOrError(periodId);

    newPeriod = newPeriod.getAttributes();
    newPeriod.updated_at = 'now';

    return app.db('period').update(newPeriod).where({ id: periodId });
  };

  const remove = async (periodId) => {
    let [currentPeriod] = await read({ id: periodId });
    currentPeriod = new Period(currentPeriod);

    await currentPeriod.dependentEntitiesDoesntHaveDataOrError(periodId);

    return app.db('period').del().where({ id: periodId });
  };

  return { read, create, update, remove };
};
