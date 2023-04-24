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
  router.use('/position', app.routes.position);
  router.use('/player', app.routes.player);
  router.use('/match', app.routes.match);
  router.use('/lineup', app.routes.lineup);
  router.use('/period', app.routes.period);
  router.use('/substitution', app.routes.substitution);
  router.use('/goal', app.routes.goal);

  app.use(router);
};
