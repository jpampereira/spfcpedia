const app = require('express')();
const consign = require('consign');

const db = require('./configs/db');

app.db = db;

consign({ cwd: 'src' })
  .include('./configs/middlewares.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).json('Vamos São Paulo! Vamo São Paulo! Vamos ser <b>C-A-M-P-E-Ã-O</b>!');
});

module.exports = app;
