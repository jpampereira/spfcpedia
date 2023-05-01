const app = require('express')();
const consign = require('consign');

const db = require('./configs/db');
const exits = require('./configs/exits');

app.db = db;

consign({ cwd: 'src', verbose: false })
  .include('./configs/middlewares.js')
  .then('./services')
  .then('./business')
  .then('./routes')
  .then('./configs/router.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).json('Vamos São Paulo! Vamo São Paulo! Vamos ser <b>C-A-M-P-E-Ã-O</b>!');
});

app.use((err, req, res, next) => {
  const { name, message } = err;

  if (name === 'ValidationError') res.status(exits.HTTP_BAD_REQUEST).json({ error: message });
  else res.status(exits.HTTP_SERVER_ERROR).json({ error: message });

  next(err);
});

module.exports = app;
