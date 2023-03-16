const validator = require('../configs/validator')();
const Stage = require('../entities/Stage');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('stage').select(['id', 'name', 'tournament_id']).where(filter).orderBy('id');
  };

  const create = async (stages) => {
    const newStages = [];

    for (const stage of stages) {
      let newStage = new Stage(stage);

      newStage.allRequiredFieldsAreFilled();
      await validator.existsInDbOrError('tournament', { id: newStage.tournament_id.value }, 'O valor de tournament_id é inválido');
      await validator.notExistsInDbOrError('stage', newStage.getObject(), 'O campeonato já possui uma fase com esse nome');

      newStages.push(newStage.getObject());
    }

    return app.db('stage').insert(newStages, ['id', 'name', 'tournament_id']);
  };

  const update = async (stageId, updatedStage) => {
    const [currentStage] = await read({ id: stageId });
    let newStage = new Stage({ ...currentStage, ...updatedStage });
    
    validator.existsOrError(newStage.name.value, 'O valor de name é inválido');
    await validator.existsInDbOrError('tournament', { id: newStage.tournament_id.value }, 'O valor de tournament_id é inválido');
    await validator.notExistsInDbOrError('stage', ['name = ? and tournament_id = ? and id <> ?', [newStage.name.value, newStage.tournament_id.value, stageId]], 'O campeonato já possui uma fase com esse nome');
    
    newStage = newStage.getObject();
    newStage.updated_at = 'now';

    return app.db('stage').update(newStage).where({ id: stageId });
  };

  const remove = async (stageId) => {
    await validator.notExistsInDbOrError('match', { tournament_stage: stageId }, 'A fase possui partidas associadas');

    return app.db('stage').del().where({ id: stageId });
  };

  return {
    read, create, update, remove,
  };
};
