const appRoot = require('app-root-path');

const defaultSettings = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,

};

module.exports = {
  development: Object.assign({}, defaultSettings),
  staging: Object.assign({}, defaultSettings),
  production: Object.assign({}, defaultSettings),
  migrations: {
    tableName: 'knex_migrations',
    directory: `${appRoot}/src/database/migrations`,
  },
  seeds: {
    directory: `${appRoot}/src/database/seeds`,
  },
};
