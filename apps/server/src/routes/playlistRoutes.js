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

playlistRouter.delete('/:playlistId', async (req, res) => {
  const { playlistId } = req.params;

  try {
    await knex('playlist_musics').where('playlist_id', playlistId).del();

    const deleted = await knex('playlists').where('id', playlistId).del();

    if (deleted) {
      res.json({ message: 'Playlist excluída com sucesso.' });
    } else {
      res.status(404).json({ error: 'Playlist não encontrada.' });
    }
  } catch (error) {
    console.error('Erro ao excluir playlist:', error);
    res.status(500).json({ error: 'Erro ao excluir playlist.' });
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
      .orderBy('playlist_musics.order', 'asc')
      .select('musics.*');
    res.json(musics);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar músicas da playlist.' });
  }
});

playlistRouter.delete('/:playlistId/musics', async (req, res) => {
  const { playlistId } = req.params;
  const { musicIds } = req.body; 

  if (!Array.isArray(musicIds)) {
    return res.status(400).json({ error: 'musicIds deve ser um array.' });
  }

  try {
    await knex('playlist_musics')
      .whereIn('music_id', musicIds)
      .andWhere('playlist_id', playlistId)
      .del();

    res.json({ message: 'Músicas removidas da playlist com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover músicas da playlist.' });
  }
});

playlistRouter.put('/:playlistId/order', async (req, res) => {
  const { playlistId } = req.params;
  const { orderedMusicIds } = req.body;

  try {
    for (let i = 0; i < orderedMusicIds.length; i++) {
      await knex('playlist_musics')
        .where({ playlist_id: playlistId, music_id: orderedMusicIds[i] })
        .update({ order: i });
    }

    res.json({ message: 'Ordem da playlist atualizada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar ordem da playlist.' });
  }
});

module.exports = playlistRouter;
