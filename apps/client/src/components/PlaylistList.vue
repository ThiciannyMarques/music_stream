<template>
  <div>
    <h2>Playlists</h2>
    <ul>
      <li v-for="playlist in playlists" :key="playlist.id">
        <button @click="$emit('selectPlaylist', playlist.id)">
          🎧 {{ playlist.name }}
        </button>
        <button @click="deletePlaylist(playlist.id)" style="margin-left: 0.5rem">
          🗑️
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    playlists: Array,
  },
  methods: {
    async deletePlaylist(id) {
      if (confirm('Tem certeza que deseja excluir esta playlist?')) {
        try {
          await fetch(`http://localhost:3000/api/playlists/${id}`, {
            method: 'DELETE',
          });
          this.$emit('playlistDeleted');
        } catch (error) {
          console.error('Erro ao excluir playlist:', error);
        }
      }
    },
  },
};
</script>
