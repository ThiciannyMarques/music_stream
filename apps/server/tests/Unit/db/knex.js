const knex = require('knex');

const testDb = knex({
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
});

module.exports = testDb;
