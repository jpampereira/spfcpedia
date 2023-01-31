const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    return app.services.stage.read()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    return app.services.stage.read({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/byTournament/:id', (req, res, next) => {
    return app.services.stage.readByTournament(req.params.id)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.post('/', (req, res, next) => {
    return app.services.stage.create(req.body)
      .then((result) => res.status(201).json(result))
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    return app.services.stage.update(req.params.id, req.body)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    return app.services.stage.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};