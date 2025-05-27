const express = require('express');
const playlistRouter = express.Router();
const knex = require('../db/knex'); 

playlistRouter.get('/', async (req, res) => {
    console.log('Fetching playlists');
  try {
    const playlists = await knex('playlists').select('*');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar playlists.' });
  }
});

playlistRouter.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const [id] = await knex('playlists').insert({ name });
    res.status(201).json({ id, name });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar playlist.' });
  }
});

playlistRouter.post('/:playlistId/musics', async (req, res) => {
  const { playlistId } = req.params;
  const { musicId } = req.body;
  try {
    await knex('playlist_musics').insert({ playlist_id: playlistId, music_id: musicId });
    res.status(201).json({ message: 'Música adicionada à playlist.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar música à playlist.' });
  }
});

playlistRouter.get('/:playlistId/musics', async (req, res) => {
  const { playlistId } = req.params;
  try {
    const musics = await knex('playlist_musics')
      .join('musics', 'playlist_musics.music_id', 'musics.id')
      .where('playlist_musics.playlist_id', playlistId)
      .select('musics.*');
    res.json(musics);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar músicas da playlist.' });
  }
});

module.exports = playlistRouter;
