module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/db/database.sqlite'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/db/migrations'
    }
  },
   test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds/test'
    }
  }
};