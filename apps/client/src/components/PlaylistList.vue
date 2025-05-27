<template>
  <div>
    <h2>Playlists</h2>
    <ul>
      <li v-for="playlist in playlists" :key="playlist.id">
        <button @click="$emit('selectPlaylist', playlist.id)">
          {{ playlist.name }}
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
};
</script>
