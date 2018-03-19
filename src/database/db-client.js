const knex = require('knex');

const config = require('./knexfile');

const environment = process.env.NODE_ENV || 'local';

const knexConfigured = knex(config[environment]);

knexConfigured.migrate.latest(config.migrations)
  .then(() => {
    if (environment === 'pull-request') {
      return knexConfigured.seed.run(config.seeds);
    }
    return null;
  });

module.exports = knexConfigured;
