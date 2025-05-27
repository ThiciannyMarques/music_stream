<!-- apps/client/src/components/MusicList.vue -->
<template>
  <ul>
    <li v-for="music in musics" :key="music.id">
      <strong>{{ music.title }}</strong> - {{ music.artist }}
      <audio :src="music.url" controls></audio>
      <button @click="deleteMusic(music.id)">Excluir</button>
      <!-- Botão de edição pode ser adicionado aqui -->
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    musics: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async deleteMusic(id) {
      try {
        await fetch(`http://localhost:3000/api/musics/${id}`, {
          method: 'DELETE',
        });
        this.$emit('refreshList');
      } catch (error) {
        console.error('Erro ao excluir música:', error);
      }
    },
  },
};
</script>

<style>
/* Estilos para a lista de músicas */
</style>
