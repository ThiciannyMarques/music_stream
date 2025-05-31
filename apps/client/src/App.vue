<template>
  <div id="app" class="app-wrapper">

    <header class="app-header">
      <h1>Music Stream</h1>
      <div class="bg-red-500 p-4">Teste Tailwind</div>
    </header>
    <main class="app-main">
      <section class="left-panel">
        <MusicSearch 
          @addMusic="addMusicToPlaylist" 
          :playlists="playlists" 
        />
        <hr />
        <PlaylistForm @playlistCreated="fetchPlaylists" />
        <PlaylistList
          :playlists="playlists"
          @selectPlaylist="selectPlaylist"
          @playlistDeleted="fetchPlaylists"
        />

      </section>

      <aside v-if="selectedPlaylistId && !showModal" class="playlist-panel">
        <PlaylistMusics
          ref="playlistMusics"
          :playlistId="selectedPlaylistId"
          :allMusics="musics"
          @play="playMusic"
        />
      </aside>

      <aside v-if="showModal" class="playlist-panel">
        <div class="bg-gray-800 h-full p-6 rounded-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Adicionar à playlist</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <div class="mb-4">
            <div class="flex items-center space-x-3 p-2 bg-gray-700 rounded">
              <img :src="currentMusic.album.cover_medium" class="w-12 h-12 rounded" />
              <div>
                <p class="font-medium">{{ currentMusic.title }}</p>
                <p class="text-sm text-gray-400">{{ currentMusic.artist.name }}</p>
              </div>
            </div>
          </div>

          <div class="h-[calc(100%-180px)] overflow-y-auto mb-4">
            <div 
              v-for="playlist in playlists" 
              :key="playlist.id"
              class="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
              @click="togglePlaylistSelection(playlist.id)"
            >
              <input 
                type="checkbox" 
                :id="'playlist-' + playlist.id" 
                :value="playlist.id" 
                v-model="selectedPlaylistIds"
                class="mr-3 h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                @click.stop
              >
              <label :for="'playlist-' + playlist.id" class="flex-1 cursor-pointer">
                {{ playlist.name }}
              </label>
            </div>
          </div>

          <button 
            @click="addToSelectedPlaylists"
            :disabled="!selectedPlaylistIds.length"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar às {{ selectedPlaylistIds.length }} playlists
          </button>
        </div>
      </aside>
    </main>

    <footer class="music-player" v-if="currentMusic">
      <p>{{ currentMusic.title }} - {{ currentMusic.artist }}</p>
      <audio :src="currentMusic.url" controls autoplay />
    </footer>
  </div>
</template>

<script>
import MusicForm from './components/MusicForm.vue';
import MusicSearch from './components/MusicSearch.vue';
import MusicList from './components/MusicList.vue';
import PlaylistForm from './components/PlaylistForm.vue';
import PlaylistList from './components/PlaylistList.vue';
import PlaylistMusics from './components/PlaylistMusics.vue';


export default {
  components: {
    MusicForm,
    MusicSearch,
    MusicList,
    PlaylistForm,
    PlaylistList,
    PlaylistMusics,
  },

  data() {
    return {
      musics: [],
      playlists: [],
      selectedPlaylistId: null,
      currentMusic: null,
    };
  },
  methods: {
    async addMusicToPlaylist({ music, playlistIds }) {
      try {
        const existingMusic = await this.findOrCreateMusic(music);
        
        const addPromises = playlistIds.map(playlistId => 
          fetch(
            `http://localhost:3000/api/playlists/${playlistId}/musics`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ musicId: existingMusic.id }),
            }
          )
        );
        
        await Promise.all(addPromises);
        
        if (this.selectedPlaylistId && playlistIds.includes(this.selectedPlaylistId)) {
          this.$refs.playlistMusics?.fetchPlaylistMusics();
        }
        
        this.fetchMusics();
      } catch (error) {
        console.error('Erro ao adicionar música:', error);
      }
    },
    async findOrCreateMusic(musicData) {
      const res = await fetch('http://localhost:3000/api/musics');
      const allMusics = await res.json();
      
      const existingMusic = allMusics.find(
        m => m.title === musicData.title && m.artist === musicData.artist
      );
      
      if (existingMusic) {
        return existingMusic;
      }
      
      const createRes = await fetch('http://localhost:3000/api/musics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(musicData)
      });
      
      return await createRes.json();
    },
    async addMusicFromSearch({ music, playlistIds }) {
      const data = {
        title: music.title,
        artist: music.artist.name,
        url: music.preview
      };

      const existingMusic = this.musics.find(m => m.title === data.title && m.artist === data.artist);

      let musicId;

      if (!existingMusic) {
        const response = await fetch('http://localhost:3000/api/musics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const created = await response.json();
        musicId = created.id;
        await this.fetchMusics();
      } else {
        musicId = existingMusic.id;
      }

      for (const playlistId of playlistIds) {
        await fetch(`http://localhost:3000/api/playlists/${playlistId}/musics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ musicId })
        });
      }

      if (this.selectedPlaylistId && playlistIds.includes(this.selectedPlaylistId)) {
        this.selectedPlaylistId = null;
        this.$nextTick(() => {
          this.selectedPlaylistId = playlistIds[0];
        });
      }
    },
    async fetchMusics() {
      const res = await fetch('http://localhost:3000/api/musics');
      this.musics = await res.json();
    },
    async fetchPlaylists() {
      const res = await fetch('http://localhost:3000/api/playlists');
      this.playlists = await res.json();

    },
    selectPlaylist(id) {
      this.selectedPlaylistId = id;
    },
    playMusic(music) {
      this.currentMusic = music;
    },
  },
  mounted() {
    this.fetchMusics();
    this.fetchPlaylists();
  },
};
</script>

<style scoped>
.app-wrapper {
  font-family: 'Segoe UI', sans-serif;
  background-color: #1e1b2e;
  color: #f0e9ff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 1rem;
  text-align: center;
  color: white;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
  flex-wrap: wrap;
}

.left-panel {
  flex: 1 1 60%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playlist-panel {
  flex: 1 1 35%;
  background-color: #2d1f46;
  padding: 1rem;
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
}

.music-player {
  background-color: #3b1f57;
  padding: 1rem;
  text-align: center;
  position: sticky;
  bottom: 0;
  color: white;
}
</style>
