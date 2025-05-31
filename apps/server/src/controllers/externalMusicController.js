const axios = require('axios');

module.exports = {
  async search(req, res) {
    const { query } = req.query;

    try {
      const response = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
      const results = response.data.data.map(music => ({
        title: music.title,
        artist: music.artist.name,
        albumCover: music.album.cover_medium,
        previewUrl: music.preview,
      }));
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar música na Deezer API' });
    }
  },
};
