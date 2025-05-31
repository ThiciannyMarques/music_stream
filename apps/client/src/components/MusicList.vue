<template>
  <div>
    <h2>Lista de Músicas</h2>
    <ul>
<li v-for="music in musics" :key="music.id" class="music-card">
  <div>
    <strong>{{ music.title }}</strong> - {{ music.artist }}
  </div>
  <div class="actions">
    <button @click="$emit('play', music)">▶️ Tocar</button>
    <button @click="deleteMusic(music.id)">🗑️ Excluir</button>
  </div>
</li>

    </ul>
  </div>
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
</style>
