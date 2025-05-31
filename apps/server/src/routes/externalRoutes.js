const express = require('express');
const router = express.Router();
const controller = require('../controllers/externalMusicController');

router.get('/deezer/search', controller.search);

module.exports = router;
