/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('playlist_musics', function(table) {
    table.increments('id').primary();
    table.integer('playlist_id').unsigned().notNullable();
    table.integer('music_id').unsigned().notNullable();
    table.foreign('playlist_id').references('playlists.id').onDelete('CASCADE');
    table.foreign('music_id').references('musics.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('playlist_musics');
  
};
