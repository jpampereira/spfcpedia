const Stage = require('../entities/Stage');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('stage').select(['id', 'name', 'tournament_id']).where(filter).orderBy('id');
  };

  const create = async (stages) => {
    const newStages = [];

    for (const stage of stages) {
      const newStage = new Stage(stage);

      await newStage.allRequiredAttributesAreFilledOrError();
      await newStage.validAttributesOrError();
      await newStage.uniqueAttributesValuesOrError();
      await newStage.instanceDoesntExistOrError();

      newStages.push(newStage.getObject());
    }

    return app.db('stage').insert(newStages, ['id', 'name', 'tournament_id']);
  };

  const update = async (stageId, updatedStage) => {
    const [currentStage] = await read({ id: stageId });
    let newStage = new Stage({ ...currentStage, ...updatedStage });
    
    await newStage.validAttributesOrError();
    await newStage.allRequiredAttributesAreFilledOrError();
    await newStage.uniqueAttributesValuesOrError(stageId);
    await newStage.instanceDoesntExistOrError(stageId);
    
    newStage = newStage.getObject();
    newStage.updated_at = 'now';

    return app.db('stage').update(newStage).where({ id: stageId });
  };

  const remove = async (stageId) => {
    await validator.notExistsInDbOrError('match', { tournament_stage: stageId }, 'A fase possui partidas associadas');

    return app.db('stage').del().where({ id: stageId });
  };

  return { read, create, update, remove };
};
