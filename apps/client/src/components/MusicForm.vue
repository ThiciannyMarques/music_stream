<!-- apps/client/src/components/MusicForm.vue -->
<template>
  <form @submit.prevent="addMusic">
    <input v-model="title" placeholder="Título" required />
    <input v-model="artist" placeholder="Artista" required />
    <input v-model="url" placeholder="URL da música" required />
    <button type="submit">Adicionar Música</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      artist: '',
      url: '',
    };
  },
  methods: {
    async addMusic() {
      try {
        await fetch('http://localhost:3000/api/musics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: this.title,
            artist: this.artist,
            url: this.url,
          }),
        });
        this.title = '';
        this.artist = '';
        this.url = '';
        this.$emit('refreshList');
      } catch (error) {
        console.error('Erro ao adicionar música:', error);
      }
    },
  },
};
</script>

<style>
/* Estilos para o formulário */
</style>
