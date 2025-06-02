<template>
  <div id="app" class="app-wrapper">
    <header class="app-header">
      <h1>Music Stream</h1>
    </header>
    <main class="app-main container-fluid">
      <div class="row">
        <section class="left-panel col-lg-8 col-md-12 order-md-1 order-2">
          <MusicList
            :musics="musics"
            @play="playTrackFromEvent"
            @addMusic="addMusicToPlaylist"
          ></MusicList>
          <MusicSearch
            @addMusic="addMusicToPlaylist"
            :playlists="playlists"
            @play="playTrackFromEvent"
          />
          <hr class="divider d-md-block d-none" />
          <PlaylistForm @playlistCreated="fetchPlaylists" />
          <PlaylistList
            :playlists="playlists"
            @selectPlaylist="selectPlaylist"
            @playlistDeleted="fetchPlaylists"
            @play-playlist="playPlaylist"
          />
        </section>

        <aside
          v-if="selectedPlaylistId"
          class="playlist-panel col-lg-4 col-md-12 order-md-2 order-1 mb-md-0 mb-4"
        >
          <PlaylistMusics
            ref="playlistMusics"
            :playlistId="selectedPlaylistId"
            :allMusics="musics"
            :playlistName="getPlaylistName(selectedPlaylistId)"
            @play-track="playTrackFromList"
          />
        </aside>
      </div>
    </main>

    <footer class="music-player" v-if="currentMusic">
      <div class="player-content container">
        <div class="row align-items-center">
          <div class="col-md-3 col-12 mb-md-0 mb-2">
            <div class="d-flex align-items-center">
              <img
                :src="currentMusic.album?.cover_medium || placeholderImage"
                class="album-cover me-3"
              />
              <div class="track-info">
                <p class="track-title mb-1">{{ currentMusic.title }}</p>
                <p class="track-artist mb-0">{{ currentMusic.artist }}</p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-12">
            <div
              class="player-controls d-flex justify-content-center align-items-center"
            >
              <button
                @click="prevTrack"
                :disabled="!hasPrevTrack"
                class="btn btn-link text-white"
              >
                <i class="bi bi-skip-start-fill fs-4"></i>
              </button>
              <button @click="togglePlay" class="btn btn-link text-white mx-3">
                <i
                  class="bi"
                  :class="
                    isPlaying ? 'bi-pause-fill fs-2' : 'bi-play-fill fs-2'
                  "
                ></i>
              </button>
              <button
                @click="nextTrack"
                :disabled="!hasNextTrack"
                class="btn btn-link text-white"
              >
                <i class="bi bi-skip-end-fill fs-4"></i>
              </button>
            </div>

            <audio
              ref="audioPlayer"
              @ended="nextTrack"
              @timeupdate="updateProgress"
              @play="onAudioPlay"
              @pause="onAudioPause"
              @error="onAudioError"
              @loadedmetadata="onAudioLoaded"
              @canplay="onAudioCanPlay"
              @stalled="onAudioStalled"
              class="audio-controls"
            >
              <source :src="currentMusic.url" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </footer>
  </div>
</template>

<script>
import MusicSearch from "./components/MusicSearch.vue";
import PlaylistForm from "./components/PlaylistForm.vue";
import PlaylistList from "./components/PlaylistList.vue";
import PlaylistMusics from "./components/PlaylistMusics.vue";

export default {
  components: {
    MusicSearch,
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
      playlistQueue: [],
      currentTrackIndex: -1,
      isPlaying: false,
      progress: 0,
      placeholderImage: "https://via.placeholder.com/150",
      isAudioLoading: false,
      audioReady: false,
    };
  },
  computed: {
    hasNextTrack() {
      return this.currentTrackIndex < this.playlistQueue.length - 1;
    },
    hasPrevTrack() {
      return this.currentTrackIndex > 0;
    },
  },
  methods: {
    async addMusicToPlaylist({ music, playlistIds }) {
      try {
        const existingMusic = await this.findOrCreateMusic(music);

        const addPromises = playlistIds.map((playlistId) =>
          fetch(`http://localhost:3000/api/playlists/${playlistId}/musics`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ musicId: existingMusic.id }),
          })
        );

        await Promise.all(addPromises);

        if (
          this.selectedPlaylistId &&
          playlistIds.includes(this.selectedPlaylistId)
        ) {
          this.$refs.playlistMusics?.fetchPlaylistMusics();
        }

        this.fetchMusics();
      } catch (error) {
        console.error("Erro ao adicionar música:", error);
      }
    },

    async findOrCreateMusic(musicData) {
      const res = await fetch("http://localhost:3000/api/musics");
      const allMusics = await res.json();

      const existingMusic = allMusics.find(
        (m) => m.title === musicData.title && m.artist === musicData.artist
      );

      if (existingMusic) {
        return existingMusic;
      }

      const createRes = await fetch("http://localhost:3000/api/musics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(musicData),
      });

      return await createRes.json();
    },

    async fetchMusics() {
      const res = await fetch("http://localhost:3000/api/musics");
      this.musics = await res.json();
    },

    async fetchPlaylists() {
      const res = await fetch("http://localhost:3000/api/playlists");
      this.playlists = await res.json();
    },

    selectPlaylist(id) {
      this.selectedPlaylistId = id;
    },

    playTrackFromEvent(music) {
      this.playlistQueue = [music];
      this.currentTrackIndex = 0;
      this.playCurrentTrack();
    },

    playPlaylist(musics) {
      this.playlistQueue = [...musics];
      this.currentTrackIndex = 0;
      this.playCurrentTrack();
    },

    playTrackFromList({ musics, index }) {
      this.playlistQueue = [...musics];
      this.currentTrackIndex = index;
      this.playCurrentTrack();
    },

    async playCurrentTrack() {
      if (this.playlistQueue.length === 0 || this.currentTrackIndex < 0) return;

      this.currentMusic = this.playlistQueue[this.currentTrackIndex];
      this.isPlaying = true;
      this.isAudioLoading = true;
      this.audioReady = false;

      await this.$nextTick();

      try {
        const audioElement = this.$refs.audioPlayer;

        audioElement.pause();

        audioElement.src = this.currentMusic.url;

        audioElement.load();
        await new Promise((resolve, reject) => {
          const onCanPlay = () => {
            audioElement.removeEventListener("canplay", onCanPlay);
            resolve();
          };

          const onError = () => {
            audioElement.removeEventListener("error", onError);
            reject(new Error("Erro ao carregar áudio"));
          };

          audioElement.addEventListener("canplay", onCanPlay);
          audioElement.addEventListener("error", onError);
        });

        const playPromise = audioElement.play();

        if (playPromise !== undefined) {
          await playPromise
            .then(() => {
              this.audioReady = true;
            })
            .catch((error) => {
              console.error("Erro na reprodução:", error);
              this.isPlaying = false;
              setTimeout(() => {
                audioElement
                  .play()
                  .catch((e) =>
                    console.error("Tentativa de reprodução falhou:", e)
                  );
              }, 500);
            });
        }
      } catch (error) {
        console.error("Erro ao reproduzir:", error);
        this.isPlaying = false;
      } finally {
        this.isAudioLoading = false;
      }
    },

    async nextTrack() {
      if (this.hasNextTrack) {
        this.currentTrackIndex++;
        await this.playCurrentTrack();
      } else {
        this.isPlaying = false;
      }
    },

    async prevTrack() {
      if (this.hasPrevTrack) {
        this.currentTrackIndex--;
        await this.playCurrentTrack();
      }
    },

    async togglePlay() {
      if (!this.currentMusic || this.isAudioLoading) return;

      const audioElement = this.$refs.audioPlayer;

      if (this.isPlaying) {
        await audioElement.pause();
      } else {
        try {
          if (this.audioReady) {
            const playPromise = audioElement.play();
            if (playPromise !== undefined) {
              await playPromise.catch((error) => {
                console.error("Erro ao retomar reprodução:", error);
              });
            }
          } else {
            await this.playCurrentTrack();
          }
        } catch (error) {
          console.error("Erro ao retomar reprodução:", error);
        }
      }
    },

    updateProgress() {
      if (this.$refs.audioPlayer) {
        const { currentTime, duration } = this.$refs.audioPlayer;
        this.progress = (currentTime / duration) * 100 || 0;
      }
    },

    onAudioPlay() {
      this.isPlaying = true;
    },

    onAudioPause() {
      this.isPlaying = false;
    },

    onAudioError(error) {
      console.error("Erro no elemento de áudio:", error);
      this.isPlaying = false;
      this.isAudioLoading = false;
      this.audioReady = false;
    },

    onAudioLoaded() {
      this.audioReady = true;
    },

    onAudioCanPlay() {
      this.audioReady = true;
    },

    onAudioStalled() {
      console.log("Áudio parado - tentando recuperar...");
      this.$refs.audioPlayer.load();
    },

    getPlaylistName(playlistId) {
      const playlist = this.playlists.find((p) => p.id === playlistId);
      return playlist ? playlist.name : "Playlist";
    },
  },
  mounted() {
    this.fetchMusics();
    this.fetchPlaylists();
  },
};
</script>

<style lang="scss">
@import "./assets/styles/main.scss";

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $dark-bg;
  color: $text-color;
  padding-bottom: 80px;
}

.app-header {
  padding: 1rem;
  background-color: $dark-bg;
  border-bottom: 1px solid $border-color;

  h1 {
    color: $primary-color;
    font-weight: bold;
    margin: 0;
    font-size: 1.5rem;
  }
}

.app-main {
  flex: 1;
  padding: 1rem;
  margin-bottom: 20px;
}

.left-panel {
  padding-right: 1rem;
}

.playlist-panel {
  background-color: $panel-bg;
  border-radius: 8px;
  padding: 1rem;
  height: fit-content;
  max-height: 80vh;
  overflow-y: auto;
  margin-bottom: 20px;
}

.divider {
  border-color: $border-color;
  margin: 1rem 0;
}

.music-player {
  background-color: $player-bg;
  padding: 1rem 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  border-top: 1px solid $border-color;
  z-index: 1000;
  height: auto;
}

.player-content {
  padding: 0 1rem;
}

.album-cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.track-title {
  font-weight: bold;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.track-artist {
  font-size: 0.9rem;
  color: $secondary-text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.progress-bar {
  height: 4px;
  background: $progress-bg;
  width: 100%;
  margin-top: 0.5rem;
}

.progress {
  height: 100%;
  background: $primary-color;
  transition: width 0.1s linear;
}

.audio-controls {
  display: none;
}

.btn-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .music-player {
    height: 125px;
  }

  .app-main {
    padding: 2rem;
  }

  .left-panel {
    padding-right: 0;
  }

  .track-title,
  .track-artist {
    max-width: 150px;
  }
}

@media (max-width: 576px) {
  .app-header h1 {
    font-size: 1.2rem;
  }

  .track-title,
  .track-artist {
    max-width: 120px;
  }

  .album-cover {
    width: 40px;
    height: 40px;
  }
}
</style>
