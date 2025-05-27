/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('musics', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('artist').notNullable();
    table.string('url').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function(knex) {
  return knex.schema.dropTable('musics');
};
