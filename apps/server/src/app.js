const express = require('express');
const cors = require('cors');
const musicRoutes = require('./routes/musicRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/musics', musicRoutes);
app.use('/api/playlists', playlistRoutes);

module.exports = app;