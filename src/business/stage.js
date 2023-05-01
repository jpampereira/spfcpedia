const Stage = require('../entities/Stage');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.stage.read(filter);
  };

  const create = async (stages) => {
    const newStages = [];

    for (const stage of stages) {
      const newStage = new Stage(stage);

      await newStage.requiredAttrsAreFilledOrError();
      await newStage.attrsValuesAreValidOrError();
      await newStage.attrsWithUniqueValueOrError();
      await newStage.oneXorAttrIsFilledOrError();
      await newStage.instanceIsNotInDbOrError();

      newStages.push(newStage.getAttributes());
    }

    return app.services.stage.create(newStages);
  };

  const update = async (stageId, updatedStage) => {
    const [currentStage] = await read({ id: stageId });
    let newStage = new Stage(currentStage);
    newStage.setAttributes(updatedStage);

    await newStage.attrsValuesAreValidOrError();
    await newStage.requiredAttrsAreFilledOrError();
    await newStage.attrsWithUniqueValueOrError(stageId);
    await newStage.oneXorAttrIsFilledOrError();
    await newStage.instanceIsNotInDbOrError(stageId);

    newStage = newStage.getAttributes();
    newStage.updated_at = 'now';

    return app.services.stage.update(stageId, newStage);
  };

  const remove = async (stageId) => {
    let [currentStage] = await read({ id: stageId });
    currentStage = new Stage(currentStage);

    await currentStage.dataIsNotForeignKeyOrError(stageId);

    return app.services.stage.remove(stageId);
  };

  return { read, create, update, remove };
};
