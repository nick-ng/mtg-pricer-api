const appRoot = require('app-root-path');

console.log('appRoot', appRoot.path);

const defaultSettings = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
};

module.exports = {
  local: Object.assign({}, defaultSettings),
  development: Object.assign({}, defaultSettings),
  staging: Object.assign({}, defaultSettings),
  production: Object.assign({}, defaultSettings),
  migrations: {
    tableName: 'knex_migrations',
    directory: `${appRoot.path}/src/database/migrations`,
  },
  seeds: {
    directory: `${appRoot.path}/src/database/seeds`,
  },
};
