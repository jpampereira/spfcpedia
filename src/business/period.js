const Period = require('../entities/Period');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.period.read(filter);
  };

  const create = async (periods) => {
    const newPeriods = [];

    for (const period of periods) {
      const newPeriod = new Period(period);

      await newPeriod.requiredAttrsAreFilledOrError();
      await newPeriod.attrsValuesAreValidOrError();
      await newPeriod.attrsWithUniqueValueOrError();
      await newPeriod.oneXorAttrIsFilledOrError();
      await newPeriod.instanceIsNotInDbOrError();

      newPeriods.push(newPeriod.getAttributes());
    }

    return app.services.period.create(newPeriods);
  };

  const update = async (periodId, updatedPeriod) => {
    const [currentPeriod] = await read({ id: periodId });
    let newPeriod = new Period(currentPeriod);
    newPeriod.setAttributes(updatedPeriod);

    await newPeriod.attrsValuesAreValidOrError();
    await newPeriod.requiredAttrsAreFilledOrError();
    await newPeriod.attrsWithUniqueValueOrError(periodId);
    await newPeriod.oneXorAttrIsFilledOrError();
    await newPeriod.instanceIsNotInDbOrError(periodId);

    newPeriod = newPeriod.getAttributes();
    newPeriod.updated_at = 'now';

    return app.services.period.update(periodId, newPeriod);
  };

  const remove = async (periodId) => {
    let [currentPeriod] = await read({ id: periodId });
    currentPeriod = new Period(currentPeriod);

    await currentPeriod.dataIsNotForeignKeyOrError(periodId);

    return app.services.period.remove(periodId);
  };

  return { read, create, update, remove };
};
