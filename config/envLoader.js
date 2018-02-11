const package = require('../package.json');

function LoadEnvironmentToStrings() {
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

function LoadEnv() {
  let env = LoadEnvironmentToStrings();
  return Object.keys(env)
    .map(key => ({[key.slice(4)]: env[key].replace(/[\'|\"]/g, '')}))
    .reduce((a, c) => ({...a, ...c}), {}); 
}

module.exports = {
  loader: LoadEnvironmentToStrings,
  node: LoadEnv
}
