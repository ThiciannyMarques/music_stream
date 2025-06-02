<template>
  <div class="search-box card mb-3">
    <div class="card-body">
      <div class="input-group mb-3">
        <input
          v-model="query"
          @keyup.enter="searchMusic"
          placeholder="Digite o nome da música..."
          class="form-control"
        />
        <button @click="searchMusic" class="btn btn-primary">
          <i class="bi bi-search me-1"></i>
          <span class="d-none d-md-inline">Buscar</span>
        </button>
      </div>

      <div class="results" v-if="results.length">
        <h3 class="h5 mb-3">Resultados:</h3>
        <div class="music-list-container" ref="musicList">
          <div
            v-for="music in results"
            :key="music.id"
            class="music-result card mb-2"
          >
            <div class="card-body d-flex align-items-center flex-wrap">
              <img
                :src="music.album.cover_medium"
                alt="Album cover"
                class="me-3 rounded"
                width="50"
                height="50"
              />
              <div class="music-info flex-grow-1">
                <strong class="d-block">{{ music.title }}</strong>
                <span class="text-muted small">{{ music.artist.name }}</span>
              </div>
              <div class="music-actions mt-2 mt-md-0">
                <button
                  @click="playPreview(music)"
                  class="btn btn-sm btn-outline-light me-2"
                >
                  <i class="bi bi-play-fill"></i> Play
                </button>
                <button
                  @click="openAddToPlaylistModal(music)"
                  class="btn btn-sm btn-primary"
                >
                  <i class="bi bi-plus-lg"></i> Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddToPlaylistModal
      v-if="showPlaylistModal"
      :playlists="playlists"
      :currentMusic="currentMusicForModal"
      :show="showPlaylistModal"
      @close="showPlaylistModal = false"
      @add-to-playlists="addToSelectedPlaylists"
    />
  </div>
</template>

<script>
import axios from "axios";
import AddToPlaylistModal from "./Modal/AddToPlaylistModal.vue";

export default {
  components: {
    AddToPlaylistModal,
  },
  props: {
    playlists: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      query: "",
      results: [],
      currentMusicForModal: null,
      showPlaylistModal: false,
    };
  },
  methods: {
    async searchMusic() {
      if (!this.query) return;

      try {
        const proxyUrl = "https://corsproxy.io/?";
        const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(
          this.query
        )}`;
        const fullUrl = `${proxyUrl}${deezerUrl}`;

        const response = await axios.get(fullUrl);
        this.results = response.data.data || [];
      } catch (error) {
        console.error("Erro ao buscar músicas:", error);
      }
    },

    playPreview(music) {
      this.$emit("play", {
        title: music.title,
        artist: music.artist.name,
        url: music.preview,
        album: {
          cover_medium: music.album.cover_medium,
        },
      });
    },

    openAddToPlaylistModal(music) {
      this.currentMusicForModal = {
        title: music.title,
        artist: music.artist.name,
        url: music.preview,
        album: {
          cover_small: music.album.cover_small,
        },
      };

      this.showPlaylistModal = true;
    },

    addToSelectedPlaylists(playlistIds) {
      if (!this.currentMusicForModal) return;

      this.$emit("addMusic", {
        music: this.currentMusicForModal,
        playlistIds,
      });

      this.showPlaylistModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.music-result {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.music-info {
  min-width: 0;

  strong {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.music-list-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

@media (max-width: 768px) {
  .music-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .music-list-container {
    max-height: 250px;
  }
}

@media (max-width: 576px) {
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .music-result .card-body {
    padding: 0.75rem;
  }

  .music-info {
    margin-bottom: 0.5rem;
  }
}
</style>
