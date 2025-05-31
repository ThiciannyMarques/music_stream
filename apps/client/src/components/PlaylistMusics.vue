<template>
  <div>
    <h3>Músicas da Playlist</h3>

<ul>
  <draggable
    v-model="musics"
    item-key="id"
    group="playlist"
    animation="200"
    handle=".drag-handle"
    @end="onDragEnd"
  >
    <template #item="{ element }">
      <li :style="{ display: 'flex', alignItems: 'center', gap: '0.5rem' }">
        <span class="drag-handle" style="cursor: grab">⠿</span>
        <input type="checkbox" v-model="selectedMusics" :value="element.id" />
        <span>{{ element.title }} - {{ element.artist }}</span>
      </li>
    </template>
  </draggable>
</ul>

    <div style="margin-top: 1rem; display: flex; gap: 0.5rem">
      <button @click="removeSelectedMusics" :disabled="selectedMusics.length === 0">
        Remover Selecionadas
      </button>
      <button @click="saveOrder">Salvar Nova Ordem</button>
    </div>

    <div style="margin-top: 2rem">
      <h4>Adicionar Música</h4>
      <select v-model="selectedMusicId">
        <option v-for="music in allMusics" :value="music.id" :key="music.id">
          {{ music.title }} - {{ music.artist }}
        </option>
      </select>
      <button @click="addMusicToPlaylist">Adicionar</button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: { draggable },
  props: {
    playlistId: Number,
    allMusics: Array,
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
        console.error('Erro ao buscar músicas da playlist:', error);
      }
    },
    async addMusicToPlaylist() {
      try {
        await fetch(
          `http://localhost:3000/api/playlists/${this.playlistId}/musics`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ musicId: this.selectedMusicId }),
          }
        );
        this.fetchPlaylistMusics();
      } catch (error) {
        console.error('Erro ao adicionar música à playlist:', error);
      }
    },
    async removeSelectedMusics() {
      try {
        await fetch(`http://localhost:3000/api/playlists/${this.playlistId}/musics`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ musicIds: this.selectedMusics }),
        });
        this.fetchPlaylistMusics();
      } catch (error) {
        console.error('Erro ao remover músicas da playlist:', error);
      }
    },
    moveToTop(musicId) {
      const index = this.musics.findIndex((m) => m.id === musicId);
      if (index > 0) {
        const music = this.musics.splice(index, 1)[0];
        this.musics.unshift(music);
      }
    },
    async saveOrder() {

      const orderedMusicIds = this.musics.map((m) => m.id);
      try {
        await fetch(`http://localhost:3000/api/playlists/${this.playlistId}/order`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedMusicIds }),
        });
      } catch (error) {
        console.error('Erro ao salvar nova ordem:', error);
      }
    },
    onDragEnd() {
      this.saveOrder();
    },
  },
  watch: {
    playlistId: 'fetchPlaylistMusics',
  },
  mounted() {
    this.fetchPlaylistMusics();
  },
};
</script>


<style scoped>
li:hover {
  background-color: #3a2b56;
  cursor: pointer;
}

.drag-handle {
  font-weight: bold;
  user-select: none;
}
</style>
