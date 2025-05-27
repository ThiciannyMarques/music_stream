<template>
  <div id="app">
    <h1>🎵 Music Streaming App</h1>

    <!-- Formulário para adicionar músicas -->
    <MusicForm @refreshList="fetchMusics" />

    <!-- Lista de músicas -->
    <MusicList :musics="musics" @refreshList="fetchMusics" />

    <hr />

    <!-- Formulário para criar playlists -->
    <PlaylistForm @playlistCreated="fetchPlaylists" />

    <!-- Lista de playlists -->
    <PlaylistList :playlists="playlists" @selectPlaylist="selectPlaylist" />

    <!-- Lista de músicas dentro da playlist selecionada -->
    <PlaylistMusics
      v-if="selectedPlaylistId"
      :playlistId="selectedPlaylistId"
      :allMusics="musics"
    />
  </div>
</template>

<script>
import MusicForm from './components/MusicForm.vue';
import MusicList from './components/MusicList.vue';
import PlaylistForm from './components/PlaylistForm.vue';
import PlaylistList from './components/PlaylistList.vue';
import PlaylistMusics from './components/PlaylistMusics.vue';

export default {
  components: {
    MusicForm,
    MusicList,
    PlaylistForm,
    PlaylistList,
    PlaylistMusics,
  },
  data() {
    return {
      musics: [],
      playlists: [],
      selectedPlaylistId: null,
    };
  },
  methods: {
    async fetchMusics() {
      try {
        const response = await fetch('http://localhost:3000/api/musics');
        this.musics = await response.json();
      } catch (error) {
        console.error('Erro ao buscar músicas:', error);
      }
    },
    async fetchPlaylists() {
      try {
        const response = await fetch('http://localhost:3000/api/playlists');
        this.playlists = await response.json();
      } catch (error) {
        console.error('Erro ao buscar playlists:', error);
      }
    },
    selectPlaylist(id) {
      this.selectedPlaylistId = id;
    },
  },
  mounted() {
    this.fetchMusics();
    this.fetchPlaylists();
  },
};
</script>

<style>
/* Estilos básicos */
</style>
