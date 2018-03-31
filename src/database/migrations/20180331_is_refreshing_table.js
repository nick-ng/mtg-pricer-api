const TABLE_NAME = 'last_refreshed';

exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable(TABLE_NAME, (t) => {
    t.increments('id').primary();
    t.string('service').notNullable().index();
    t.timestamp('timestamp')
      .notNullable()
      .defaultTo(knex.fn.now());
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable(TABLE_NAME),
]);
