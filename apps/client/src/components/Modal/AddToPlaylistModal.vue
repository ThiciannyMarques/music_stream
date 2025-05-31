<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-start justify-center pt-16">
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="close"></div>

    <div class="relative w-full max-w-xl rounded-3xl bg-[#1e1e2f] text-white shadow-2xl border border-gray-700 backdrop-blur-xl overflow-hidden z-10">
      
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-600 bg-[#2a2a3b]">
        <h3 class="text-2xl font-semibold tracking-tight">Escolha a playlist</h3>
        <button
          @click="close"
          class="text-white bg-transparent hover:text-red-400 hover:bg-red-400/10 rounded-full transition p-1.5 ml-4"
          aria-label="Fechar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Lista de playlists -->
      <div class="max-h-96 overflow-y-auto divide-y divide-gray-700">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="flex items-center px-6 py-4 hover:bg-gray-700/30 transition-colors cursor-pointer group"
          @click="togglePlaylistSelection(playlist.id)"
        >
          <div class="relative">
            <input
              type="checkbox"
              :id="'playlist-' + playlist.id"
              :value="playlist.id"
              v-model="selectedPlaylistIds"
              class="sr-only"
            />
            <div
              class="h-5 w-5 flex items-center justify-center rounded-full border-2 transition-all duration-200"
              :class="selectedPlaylistIds.includes(playlist.id)
                ? 'bg-gradient-to-tr from-purple-600 to-purple-500 border-purple-600'
                : 'border-gray-500 group-hover:border-gray-400'"
            >
              <svg
                v-if="selectedPlaylistIds.includes(playlist.id)"
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <label
            :for="'playlist-' + playlist.id"
            class="ml-4 text-base cursor-pointer flex-1 truncate"
          >
            {{ playlist.name }}
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-700 bg-[#2a2a3b] flex justify-end">
        <button
          @click="confirmSelection"
          :disabled="!selectedPlaylistIds.length"
          class="px-6 py-2 rounded-full font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
        >
          Adicionar a {{ selectedPlaylistIds.length }} playlist{{ selectedPlaylistIds.length !== 1 ? 's' : '' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playlists: Array,
    show: Boolean,
    currentMusic: Object
  },
  data() {
    return {
      selectedPlaylistIds: []
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirmSelection() {
      this.$emit('add-to-playlists', this.selectedPlaylistIds)
      this.close()
    },
    togglePlaylistSelection(playlistId) {
      const index = this.selectedPlaylistIds.indexOf(playlistId)
      if (index === -1) {
        this.selectedPlaylistIds.push(playlistId)
      } else {
        this.selectedPlaylistIds.splice(index, 1)
      }
    }
  },
  watch: {
    show(newVal) {
      if (!newVal) {
        this.selectedPlaylistIds = []
      }
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #1a1a1a;
}
::-webkit-scrollbar-thumb {
  background-color: #4b4b4b;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #666;
}
</style>
