const Music = require('../models/musicModel');

module.exports = {
  async index(req, res) {
    const musics = await Music.getAll();
    res.json(musics);
  },

  async show(req, res) {
    const { id } = req.params;
    const music = await Music.getById(id);
    if (!music) return res.status(404).json({ error: 'Music not found' });
    res.json(music);
  },

  async store(req, res) {
    const { title, artist, url } = req.body;
    const [id] = await Music.create({ title, artist, url });
    res.status(201).json({ id, title, artist, url });
  },

  async update(req, res) {
    const { id } = req.params;
    const updated = await Music.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Music not found' });
    res.json({ message: 'Updated' });
  },

  async destroy(req, res) {
    const { id } = req.params;
    const deleted = await Music.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Music not found' });
    res.json({ message: 'Deleted' });
  }
};