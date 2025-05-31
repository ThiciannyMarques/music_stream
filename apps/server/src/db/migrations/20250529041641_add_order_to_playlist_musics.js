/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
  return knex.schema.table('playlist_musics', function(table) {
    table.integer('order').defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.down = function(knex) {
  return knex.schema.table('playlist_musics', function(table) {
    table.dropColumn('order');
  });
};
