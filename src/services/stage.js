const {
  existsOrError,
  existsInDbOrError,
  notExistsInDbOrError,
  removeTableControlFields,
} = require('../configs/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('stage').select(['id', 'name', 'tournament_id']).where(filter).orderBy('id');
  };

  const create = async (newStages) => {
    for (const stage of newStages) {
      existsOrError(stage.name, 'O atributo name é obrigatório');
      existsOrError(stage.tournament_id, 'O atributo tournament_id é obrigatório');
      await existsInDbOrError('tournament', { id: stage.tournament_id }, 'O valor de tournament_id é inválido');
      await notExistsInDbOrError('stage', stage, 'O campeonato já possui uma fase com esse nome');

      removeTableControlFields(stage);
    }

    return app.db('stage').insert(newStages, ['id', 'name', 'tournament_id']);
  };

  const update = async (stageId, updatedStage) => {
    const [stageInDb] = await read({ id: stageId });
    const newStage = { ...stageInDb, ...updatedStage };
    removeTableControlFields(newStage);

    existsOrError(newStage.name, 'O valor de name é inválido');
    await existsInDbOrError('tournament', { id: newStage.tournament_id }, 'O valor de tournament_id é inválido');
    await notExistsInDbOrError('stage', ['name = ? and tournament_id = ? and id <> ?', [newStage.name, newStage.tournament_id, stageId]], 'O campeonato já possui uma fase com esse nome');

    newStage.updated_at = 'now';

    return app.db('stage').update(newStage).where({ id: stageId });
  };

  const remove = async (stageId) => {
    await notExistsInDbOrError('match', { tournament_stage: stageId }, 'A fase possui partidas associadas');

    return app.db('stage').del().where({ id: stageId });
  };

  return {
    read, create, update, remove,
  };
};
