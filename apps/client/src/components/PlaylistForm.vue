<template>
  <form @submit.prevent="createPlaylist">
    <input v-model="name" placeholder="Nome da Playlist" required />
    <button type="submit">Criar Playlist</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      name: '',
    };
  },
  methods: {
    async createPlaylist() {
      try {
        await fetch('http://localhost:3000/api/playlists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.name }),
        });
        this.name = '';
        this.$emit('playlistCreated');
      } catch (error) {
        console.error('Erro ao criar playlist:', error);
      }
    },
  },
};
</script>
