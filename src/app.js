const app = require('express')();
const consign = require('consign');

const db = require('./configs/db');

app.db = db;

consign({ cwd: 'src', verbose: false })
  .include('./configs/middlewares.js')
  .then('./errors/validator.js')
  .then('./services')
  .then('./routes')
  .then('./configs/router.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).json('Vamos São Paulo! Vamo São Paulo! Vamos ser <b>C-A-M-P-E-Ã-O</b>!');
});

app.use((err, req, res, next) => {
  const { name, message } = err;

  if (name === 'ValidationError') res.status(400).json({ error: message });
  else res.status(500).json({ error: message });

  next(err);
});

module.exports = app;
