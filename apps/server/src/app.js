const express = require('express');
const cors = require('cors');
const musicRoutes = require('./routes/musicRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const externalRoutes = require('./routes/externalRoutes');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/musics', musicRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/external', externalRoutes);

module.exports = app;