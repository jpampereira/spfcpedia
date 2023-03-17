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

      newStage.allRequiredAttributesAreFilled();
      await newStage.attributesValidation();
      await validator.notExistsInDbOrError('stage', newStage.getObject(), 'O campeonato já possui uma fase com esse nome');

      newStages.push(newStage.getObject());
    }

    return app.db('stage').insert(newStages, ['id', 'name', 'tournament_id']);
  };

  const update = async (stageId, updatedStage) => {
    const [currentStage] = await read({ id: stageId });
    let newStage = new Stage({ ...currentStage, ...updatedStage });
    
    await newStage.attributesValidation();
    await validator.notExistsInDbOrError('stage', ['name = ? and tournament_id = ? and id <> ?', [newStage.name.value, newStage.tournament_id.value, stageId]], 'O campeonato já possui uma fase com esse nome');
    
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
