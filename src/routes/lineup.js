const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    return app.services.lineup.read()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    return app.services.lineup.read({ id: req.params.id })
      .then((result) => res.status(200).json(result[0] || {}))
      .catch((err) => next(err));
  });

  router.get('/byMatch/:matchId', (req, res, next) => {
    return app.services.lineup.read({ match_id: req.params.matchId })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.post('/', (req, res, next) => {
    return app.services.lineup.create(req.body)
      .then((result) => res.status(201).json(result))
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    return app.services.lineup.update(req.params.id, req.body)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  router.delete('/byMatch/:matchId', (req, res, next) => {
    return app.services.lineup.remove(req.params.matchId)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};
