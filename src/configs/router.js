const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.use('/tournament', app.routes.tournament);
  router.use('/stage', app.routes.stage);
  router.use('/opponent', app.routes.opponent);
  router.use('/referee', app.routes.referee);

  app.use(router);
};
