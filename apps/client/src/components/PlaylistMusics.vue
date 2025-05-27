<template>
  <div>
    <h3>Músicas da Playlist</h3>
    <ul>
      <li v-for="music in musics" :key="music.id">
        {{ music.title }} - {{ music.artist }}
      </li>
    </ul>
    <div>
      <h4>Adicionar Música</h4>
      <select v-model="selectedMusicId">
        <option v-for="music in allMusics" :value="music.id" :key="music.id">
          {{ music.title }} - {{ music.artist }}
        </option>
      </select>
      <button @click="addMusicToPlaylist">Adicionar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playlistId: Number,
    allMusics: Array,
  },
  data() {
    return {
      musics: [],
      selectedMusicId: null,
    };
  },
  methods: {
    async fetchPlaylistMusics() {
      try {
        const response = await fetch(`http://localhost:3000/api/playlists/${this.playlistId}/musics`);
        this.musics = await response.json();
      } catch (error) {
        console.error('Erro ao buscar músicas da playlist:', error);
      }
    },
    async addMusicToPlaylist() {
      try {
        await fetch(`http://localhost:3000/api/playlists/${this.playlistId}/musics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ musicId: this.selectedMusicId }),
        });
        this.fetchPlaylistMusics();
      } catch (error) {
        console.error('Erro ao adicionar música à playlist:', error);
      }
    },
  },
  watch: {
    playlistId: 'fetchPlaylistMusics',
  },
  mounted() {
    this.fetchPlaylistMusics();
  },
};
</script>
