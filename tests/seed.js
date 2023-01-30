const { execSync } = require('child_process');

module.exports = {
  run: (filename) => execSync(`npx knex seed:run --specific=${filename}.js`),
};
