<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    style="background-color: rgba(0, 0, 0, 0.7)"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div
        class="modal-content"
        style="
          background: linear-gradient(145deg, #2d1f46, #3b1f57);
          border: 1px solid #4a2d6b;
        "
      >
        <div class="modal-header border-bottom border-secondary">
          <h5 class="modal-title text-white">
            <i class="bi bi-music-note-list me-2"></i>
            Adicionar à playlist
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="close"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body p-0" style="max-height: 60vh; overflow-y: auto">
          <div class="list-group list-group-flush">
            <div
              v-for="playlist in playlists"
              :key="playlist.id"
              class="list-group-item list-group-item-action d-flex align-items-center py-3"
              :style="{
                backgroundColor: selectedPlaylistIds.includes(playlist.id)
                  ? 'rgba(155, 77, 255, 0.15)'
                  : 'transparent',
                borderColor: '#4a2d6b',
              }"
              @click="togglePlaylistSelection(playlist.id)"
            >
              <div class="form-check form-check-lg me-3">
                <input
                  type="checkbox"
                  :id="'playlist-' + playlist.id"
                  :value="playlist.id"
                  v-model="selectedPlaylistIds"
                  class="form-check-input"
                  :style="{
                    backgroundColor: selectedPlaylistIds.includes(playlist.id)
                      ? '#9b4dff'
                      : 'transparent',
                    borderColor: selectedPlaylistIds.includes(playlist.id)
                      ? '#9b4dff'
                      : '#bdb1c3',
                  }"
                  @click.stop
                />
              </div>
              <div class="d-flex align-items-center w-100">
                <div class="flex-grow-1">
                  <label
                    :for="'playlist-' + playlist.id"
                    class="form-check-label d-block mb-1 fw-bold text-white"
                  >
                    {{ playlist.name }}
                  </label>
                </div>
                <i
                  class="bi bi-check-circle-fill text-success ms-2"
                  v-if="selectedPlaylistIds.includes(playlist.id)"
                  style="font-size: 1.2rem"
                ></i>
              </div>
            </div>

            <div
              v-if="playlists.length === 0"
              class="text-center py-5 text-muted"
            >
              <i class="bi bi-music-note-beamed display-5"></i>
              <p class="mt-3">Nenhuma playlist encontrada</p>
            </div>
          </div>
        </div>

        <div class="modal-footer border-top border-secondary">
          <button type="button" class="btn btn-outline-light" @click="close">
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmSelection"
            :disabled="!selectedPlaylistIds.length"
          >
            <i class="bi bi-plus-circle me-1"></i>
            Adicionar a {{ selectedPlaylistIds.length }} playlist{{
              selectedPlaylistIds.length !== 1 ? "s" : ""
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playlists: Array,
    show: Boolean,
    currentMusic: Object,
  },
  data() {
    return {
      selectedPlaylistIds: [],
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    confirmSelection() {
      this.$emit("add-to-playlists", this.selectedPlaylistIds);
      this.close();
    },
    togglePlaylistSelection(playlistId) {
      const index = this.selectedPlaylistIds.indexOf(playlistId);
      if (index === -1) {
        this.selectedPlaylistIds.push(playlistId);
      } else {
        this.selectedPlaylistIds.splice(index, 1);
      }
    },
  },
  watch: {
    show(newVal) {
      if (!newVal) {
        this.selectedPlaylistIds = [];
      }
    },
  },
};
</script>

<style scoped>
.modal-content {
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.5);
}

.list-group-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.list-group-item:hover {
  background-color: rgba(155, 77, 255, 0.1) !important;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #2d1f46;
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: #4a2d6b;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background-color: #5a3a7b;
}

.form-check-input {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0.1em;
}

.form-check-input:checked {
  background-color: #9b4dff;
  border-color: #9b4dff;
}
</style>
