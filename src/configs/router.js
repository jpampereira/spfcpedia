const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.use('/tournament', app.routes.tournament);

  app.use(router);
};
