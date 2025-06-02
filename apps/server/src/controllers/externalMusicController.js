const axios = require("axios");

module.exports = {
  async search(req, res) {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res
        .status(400)
        .json({ error: "Query parameter is required and cannot be empty" });
    }

    try {
      const response = await axios.get(
        `https://api.deezer.com/search?q=${encodeURIComponent(query)}`,
        {
          timeout: 5000,
        }
      );

      if (!response.data || !Array.isArray(response.data.data)) {
        return res
          .status(404)
          .json({ error: "No results found or invalid response format" });
      }

      const results = response.data.data.map((music) => ({
        title: music.title || "Unknown Title",
        artist: music.artist?.name || "Unknown Artist",
        albumCover: music.album?.cover_medium || "",
        previewUrl: music.preview || "",
      }));

      if (results.length === 0) {
        return res.status(404).json({ error: "No results found" });
      }

      return res.json(results);
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        console.error("Request timeout:", err.message);
        return res.status(504).json({
          error: "Request timeout",
          details: "The request to Deezer API timed out",
        });
      } else if (err.response) {
        console.error(
          "Deezer API Error:",
          err.response.status,
          err.response.data
        );
        return res.status(err.response.status).json({
          error: "Error from Deezer API",
          details: err.response.data,
        });
      } else {
        console.error("Request error:", err.message);
        return res.status(500).json({
          error: "Internal server error",
          details: err.message,
        });
      }
    }
  },
};
