const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.use('/tournament', app.routes.tournament);
  router.use('/stage', app.routes.stage);
  router.use('/opponent', app.routes.opponent);
  router.use('/referee', app.routes.referee);
  router.use('/country', app.routes.country);
  router.use('/city', app.routes.city);
  router.use('/stadium', app.routes.stadium);
  router.use('/match', app.routes.match);

  app.use(router);
};
