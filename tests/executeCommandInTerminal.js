const { execSync } = require('child_process');

module.exports = (command) => {
  return execSync(command);
};
