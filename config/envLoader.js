const package = require('../package.json');

function LoadEnvironment() {
  let env = process.env.NODE_ENV || 'dev';
  let nodes = package.environment[env];
  let keys = Object.keys(nodes);
  let result = {};
  result[`ENV.DEPLOY_TARGET`] = JSON.stringify(env);
  result[`ENV.TARGET_DEV`] = JSON.stringify('dev');
  result[`ENV.TARGET_STAGING`] = JSON.stringify('staging');
  result[`ENV.TARGET_PRODUCTION`] = JSON.stringify('production');
  for (let i = 0; i < keys.length; i++) {
    result[`ENV.${keys[i]}`] = JSON.stringify(nodes[keys[i]]);
  }
  return result;
}

module.exports = LoadEnvironment;
