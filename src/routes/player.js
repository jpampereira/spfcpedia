const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    return app.services.player.read()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    return app.services.player.read({ id: req.params.id })
      .then((result) => res.status(200).json(result[0] || {}))
      .catch((err) => next(err));
  });

  router.post('/', (req, res, next) => {
    return app.services.player.create(req.body)
      .then((result) => res.status(201).json(result))
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    return app.services.player.update(req.params.id, req.body)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    return app.services.player.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};
