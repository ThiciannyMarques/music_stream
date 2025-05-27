const db = require('../db/knex');

module.exports = {
  getAll: () => db('musics'),
  getById: id => db('musics').where({ id }).first(),
  create: data => db('musics').insert(data),
  update: (id, data) => db('musics').where({ id }).update(data),
  remove: id => db('musics').where({ id }).del()
};