const Period = require('../entities/Period');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('period').select(['id', 'symbol', 'name']).where(filter).orderBy('id');
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

    return app.db('period').insert(newPeriods, ['id', 'symbol', 'name']);
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

    return app.db('period').update(newPeriod).where({ id: periodId });
  };

  const remove = async (periodId) => {
    let [currentPeriod] = await read({ id: periodId });
    currentPeriod = new Period(currentPeriod);

    await currentPeriod.dataIsNotForeignKeyOrError(periodId);

    return app.db('period').del().where({ id: periodId });
  };

  return { read, create, update, remove };
};
