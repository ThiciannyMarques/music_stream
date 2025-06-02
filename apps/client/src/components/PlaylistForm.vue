<template>
  <div class="card mb-3">
    <div class="card-body">
      <h2 class="h5 card-title mb-3">Criar Playlist</h2>
      <form
        @submit.prevent="createPlaylist"
        class="d-flex flex-column flex-md-row"
      >
        <input
          v-model="name"
          placeholder="Nome da Playlist"
          required
          class="form-control me-md-2 mb-2 mb-md-0"
        />
        <button type="submit" class="btn btn-primary">
          <i class="bi bi-plus-lg"></i> Criar
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
    };
  },
  methods: {
    async createPlaylist() {
      try {
        await fetch("http://localhost:3000/api/playlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: this.name }),
        });
        this.name = "";
        this.$emit("playlistCreated");
      } catch (error) {
        console.error("Erro ao criar playlist:", error);
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 576px) {
  .card-title {
    font-size: 1rem;
  }

  .form-control {
    font-size: 0.9rem;
  }

  .btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
