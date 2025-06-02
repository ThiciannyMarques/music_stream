<template>
  <div class="playlist-musics">
    <div
      class="playlist-header d-flex justify-content-between align-items-center mb-3"
    >
      <h3 class="h5 mb-0">{{ playlistName }}</h3>
      <button
        @click="playPlaylist"
        class="btn btn-sm btn-primary"
        :disabled="musics.length === 0"
      >
        <i class="bi bi-play-fill me-1"></i>
        <span class="d-none d-sm-inline">Tocar Playlist</span>
      </button>
    </div>

    <ul class="list-group mb-3">
      <draggable
        v-model="musics"
        item-key="id"
        group="playlist"
        animation="200"
        handle=".drag-handle"
        @end="onDragEnd"
      >
        <template #item="{ element, index }">
          <li
            :class="{
              'list-group-item': true,
              playing: isCurrentTrack(element),
            }"
            @click="playTrack(index)"
          >
            <div class="d-flex align-items-center">
              <span class="drag-handle me-2"
                ><i class="bi bi-grip-vertical"></i
              ></span>
              <span class="text-muted me-3">{{ index + 1 }}</span>
              <img
                v-if="element.album?.cover_small"
                :src="element.album.cover_small"
                class="track-cover me-3 rounded"
                width="40"
                height="40"
              />
              <div class="track-info flex-grow-1">
                <span class="track-title d-block">{{ element.title }}</span>
                <span class="track-artist small text-muted">{{
                  element.artist
                }}</span>
              </div>
              <div class="form-check">
                <input
                  type="checkbox"
                  v-model="selectedMusics"
                  :value="element.id"
                  class="form-check-input"
                  @click.stop
                />
              </div>
            </div>
          </li>
        </template>
      </draggable>
    </ul>

    <div class="actions d-flex gap-2 mb-4 flex-column flex-sm-row">
      <button
        @click="removeSelectedMusics"
        :disabled="selectedMusics.length === 0"
        class="btn btn-sm btn-danger flex-grow-1"
      >
        <i class="bi bi-trash me-1"></i> Remover Selecionadas
      </button>
      <button
        @click="saveOrder"
        class="btn btn-sm btn-outline-primary flex-grow-1"
      >
        <i class="bi bi-save me-1"></i> Salvar Ordem
      </button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: { draggable },
  props: {
    playlistId: Number,
    allMusics: Array,
    playlistName: String,
  },
  data() {
    return {
      musics: [],
      selectedMusicId: null,
      selectedMusics: [],
    };
  },
  methods: {
    async fetchPlaylistMusics() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/playlists/${this.playlistId}/musics`
        );
        const result = await response.json();
        this.musics = result;
        this.selectedMusics = [];
      } catch (error) {
        console.error("Erro ao buscar músicas da playlist:", error);
      }
    },

    async addMusicToPlaylist() {
      try {
        await fetch(
          `http://localhost:3000/api/playlists/${this.playlistId}/musics`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ musicId: this.selectedMusicId }),
          }
        );
        this.selectedMusicId = null;
        this.fetchPlaylistMusics();
      } catch (error) {
        console.error("Erro ao adicionar música à playlist:", error);
      }
    },

    async removeSelectedMusics() {
      try {
        await fetch(
          `http://localhost:3000/api/playlists/${this.playlistId}/musics`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ musicIds: this.selectedMusics }),
          }
        );
        this.fetchPlaylistMusics();
      } catch (error) {
        console.error("Erro ao remover músicas da playlist:", error);
      }
    },

    async saveOrder() {
      const orderedMusicIds = this.musics.map((m) => m.id);
      try {
        await fetch(
          `http://localhost:3000/api/playlists/${this.playlistId}/order`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderedMusicIds }),
          }
        );
      } catch (error) {
        console.error("Erro ao salvar nova ordem:", error);
      }
    },

    onDragEnd() {
      this.saveOrder();
    },

    playPlaylist() {
      if (this.musics.length > 0) {
        this.$emit("play-track", { musics: this.musics, index: 0 });
      }
    },

    playTrack(index) {
      this.$emit("play-track", { musics: this.musics, index });
    },

    isCurrentTrack(music) {
      return this.$parent.currentMusic?.id === music.id;
    },
  },
  watch: {
    playlistId: {
      immediate: true,
      handler() {
        this.fetchPlaylistMusics();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@use "../assets/styles/variables" as *;
.playlist-header {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--bs-border-color);
}

.list-group-item {
  cursor: pointer;
  transition: background-color 0.2s;

  &.playing {
    background-color: rgba($primary-color, 0.1);
    border-left: 3px solid $primary-color;
  }

  &:hover {
    background-color: rgba(white, 0.05);
  }
}

.drag-handle {
  cursor: grab;
  color: var(--bs-secondary-color);

  &:active {
    cursor: grabbing;
  }
}

.track-info {
  min-width: 0;

  .track-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.add-music {
  margin-top: 1.5rem;
}

.form-check-input {
  background-color: rgb(190, 169, 207) !important;
  border-radius: 50% !important;
  width: 15px;
  height: 15px;
  padding: 0;

  &:checked {
    background-color: #630777 !important;
  }
}

@media (max-width: 768px) {
  .playlist-header {
    flex-direction: column;
    align-items: flex-start;

    h3 {
      margin-bottom: 0.5rem;
    }

    button {
      width: 100%;
    }
  }

  .track-title {
    max-width: 150px;
  }
}

@media (max-width: 576px) {
  .track-title {
    max-width: 120px;
    font-size: 0.9rem;
  }

  .track-artist {
    font-size: 0.8rem;
  }

  .track-cover {
    width: 30px;
    height: 30px;
    margin-right: 0.5rem;
  }

  .list-group-item {
    padding: 0.5rem;
  }

  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
