const express = require('express');
const exits = require('../configs/exits');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    return app.business.period.read()
      .then((result) => res.status(exits.HTTP_SUCCESS).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    return app.business.period.read({ id: req.params.id })
      .then((result) => res.status(exits.HTTP_SUCCESS).json(result[0] || {}))
      .catch((err) => next(err));
  });

  router.post('/', (req, res, next) => {
    return app.business.period.create(req.body)
      .then((result) => res.status(exits.HTTP_CREATED).json(result))
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    return app.business.period.update(req.params.id, req.body)
      .then(() => res.status(exits.HTTP_NO_CONTENT).send())
      .catch((err) => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    return app.business.period.remove(req.params.id)
      .then(() => res.status(exits.HTTP_NO_CONTENT).send())
      .catch((err) => next(err));
  });

  return router;
};
