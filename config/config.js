const convict = require('convict');

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'staging', 'dev'],
    default: 'dev',
    env: 'NODE_ENV'
  },
  api: {
    path: {
      doc: 'The url to the api',
      format: 'url',
      default: '//localhost',

    },
    port: {
      doc: 'The port the api is on',
      format: 'port',
      default: 1337
    }
  },
  db: {
    username: {
      doc: 'the username used for the database',
      format: String,
      sensitive: true,
      default: ''
    },
    password: {
      doc: 'The password used for the database',
      format: String,
      sensitive: true,
      default: ''
    },
    port: {
      doc: 'The port used for the database',
      format: Number,
      default: 27017,
      sensitive: true,
    },
    url: {
      doc: 'The url used for the database',
      format: 'url',
      sensitive: true,
      default: ''
    },
    root: {
      doc: 'the root used for the database',
      format: String,
      sensitive: true,
      default: '',
    }
  },
  localStorageNamespace: {
    doc: 'The namespace used for local storage on the client',
    format: String,
    default: 'tetris',
  },
  port: {
    doc: 'The port the React server runs on',
    format: 'port',
    default: 1335
  },
  jwtToken: {
    doc: 'The encryption token used for jwt authentication',
    format: String,
    sensitive: true,
    default: ''
  }
});