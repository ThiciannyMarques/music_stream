<template>
  <div class="card">
    <div class="card-body">
      <h2 class="h5 card-title mb-3">Suas Playlists</h2>
      <ul class="list-group">
        <li
          v-for="playlist in playlists"
          :key="playlist.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div
            class="playlist-info flex-grow-1 d-flex align-items-center"
            @click="$emit('selectPlaylist', playlist.id)"
          >
            <span class="me-3"><i class="bi bi-music-note-list"></i></span>
            <span class="playlist-name flex-grow-1">{{ playlist.name }}</span>
          </div>
          <div class="playlist-actions">
            <button
              @click.stop="playPlaylist(playlist.id)"
              class="btn btn-sm btn-outline-success me-2"
              title="Tocar playlist"
            >
              <i class="bi bi-play-fill"></i>
            </button>
            <button
              @click.stop="deletePlaylist(playlist.id)"
              class="btn btn-sm btn-outline-danger"
              title="Excluir playlist"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playlists: Array,
  },
  methods: {
    async deletePlaylist(id) {
      if (confirm("Tem certeza que deseja excluir esta playlist?")) {
        try {
          await fetch(`http://localhost:3000/api/playlists/${id}`, {
            method: "DELETE",
          });
          this.$emit("playlistDeleted");
        } catch (error) {
          console.error("Erro ao excluir playlist:", error);
        }
      }
    },

    async playPlaylist(id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/playlists/${id}/musics`
        );
        const musics = await response.json();
        this.$emit("play-playlist", musics);
        this.$emit("selectPlaylist", id);
      } catch (error) {
        console.error("Erro ao tocar playlist:", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.playlist-info {
  cursor: pointer;

  .playlist-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.playlist-actions {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .list-group-item {
    padding: 0.75rem;
  }

  .playlist-name {
    max-width: 150px;
  }
}

@media (max-width: 576px) {
  .card-title {
    font-size: 1rem;
  }

  .playlist-name {
    max-width: 120px;
    font-size: 0.9rem;
  }

  .btn-sm {
    padding: 0.25rem;
    font-size: 0.8rem;
  }
}
</style>
