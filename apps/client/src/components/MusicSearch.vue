<template>
  <div class="search-box">
    <input v-model="query" @keyup.enter="searchMusic" placeholder="Digite o nome da música..." />
    <button @click="searchMusic">🔍 Buscar</button>

    <AddToPlaylistModal
      v-if="showModal"
      :playlists="playlists"
      :currentMusic="currentMusic"
      :show="showModal"
      @close="closeModal"
      @add-to-playlists="addToPlaylists"
    />
    <div class="results" v-if="results.length">
      <h3>Resultados:</h3>
      <div v-for="music in results" :key="music.id" class="music-result">
        <img :src="music.album.cover_medium" alt="Album cover" />
        <div class="music-info">
          <strong>{{ music.title }}</strong>
          <span>{{ music.artist.name }}</span>
        </div>
        <button 
          @click="openModal(music)"
          class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full text-sm"
        >
          Adicionar às playlists
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import AddToPlaylistModal from './Modal/AddToPlaylistModal.vue';

export default {
  components: {
    AddToPlaylistModal
  },
  props: {
    playlists: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      query: '',
      results: [],
      showModal: false,
      currentMusic: null
    };
  },
  methods: {
    async searchMusic() {
      if (!this.query) return;

      try {
        const proxyUrl = 'https://corsproxy.io/?';
        const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(this.query)}`;
        const fullUrl = `${proxyUrl}${deezerUrl}`;

        const response = await axios.get(fullUrl);
        this.results = response.data.data || [];
      } catch (error) {
        console.error('Erro ao buscar músicas:', error);
      }
    },
    openModal(music) {
      this.currentMusic = music;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    addToPlaylists(playlistIds) {
      const musicData = {
        title: this.currentMusic.title,
        artist: this.currentMusic.artist.name,
        url: this.currentMusic.preview,
        album: {
          cover_small: this.currentMusic.album.cover_small
        }
      };
      
      this.$emit('addMusic', {
        music: musicData,
        playlistIds: playlistIds
      });
    }
  }
};
</script>

<style scoped>
.search-box {
  background: #2d1f46;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.music-result {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #3a2b56;
  border-radius: 6px;
}

.music-result img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.music-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.music-info strong {
  font-size: 0.9rem;
}

.music-info span {
  font-size: 0.8rem;
  color: #a0a0a0;
}
</style>