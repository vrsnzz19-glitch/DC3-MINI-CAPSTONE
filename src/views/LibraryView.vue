<script setup>
// ============================================================
// src/views/LibraryView.vue — MUSIC LIBRARY
// ============================================================
// The song LIST lives in the useSongs() composable (single
// source of truth). This view:
//   - receives nothing; gets songs from the composable
//   - passes each song DOWN to <SongCard> as a PROP
//   - listens to SongCard's EMITTED events and handles them here
//     (play / edit / delete / favorite), updating shared state
// ============================================================

import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSongs } from '../composables/useSongs.js'
import SongCard from '../components/SongCard.vue'

// Props: optional pre-selected genre (from GenresView navigation).
const props = defineProps({
  genre: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const route = useRoute()
const { songs, genreOptions, deleteSong, toggleFavorite } = useSongs()

// UI state that belongs only to this page.
const searchQuery = ref('')
const selectedGenre = ref(props.genre || 'All')

// When arriving with ?genre=xxx (from GenresView / sidebar),
// apply the route query to the filter and reset it when leaving.
watch(
  () => route.query.genre,
  value => {
    selectedGenre.value =
      value && genreOptions.value.includes(value) ? value : 'All'
  },
  { immediate: true }
)

// Computed filtering — derived state, not duplicated lists.
const filteredSongs = computed(() => {
  let result = songs.value

  if (selectedGenre.value !== 'All') {
    result = result.filter(song => song.genre === selectedGenre.value)
  }

  const query = searchQuery.value.toLowerCase().trim()

  if (query) {
    result = result.filter(song =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.album.toLowerCase().includes(query) ||
      song.genre.toLowerCase().includes(query)
    )
  }

  return result
})

// -------- Handlers for events EMITTED by <SongCard> --------
function handlePlay(song) {
  // Ask the App-level player (via the router-less event bus below)
  // to open the full-screen player. We use a custom DOM event so
  // the player state stays in App.vue without prop drilling.
  window.dispatchEvent(new CustomEvent('spotibai:play', { detail: song }))
}

function handleEdit(song) {
  router.push({ name: 'edit-song', params: { id: song.id } })
}

function handleDelete(song) {
  if (confirm(`Delete "${song.title}" from your library?`)) {
    window.dispatchEvent(new CustomEvent('spotibai:stop-if-playing', { detail: song }))
    deleteSong(song.id) // composable updates the list + localStorage
  }
}
</script>

<template>
  <section class="library-section">
    <div class="section-heading">
      <div>
        <h2>All Bisaya Songs</h2>
        <p>Add, edit, delete, and discover songs across your collection.</p>
      </div>
      <span class="result-count">{{ filteredSongs.length }} songs</span>
    </div>

    <div class="filter-bar">
      <div class="search-box">
        <span>⌕</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search songs, artists, or albums..."
        />
        <button
          v-if="searchQuery"
          class="clear-search"
          @click="searchQuery = ''"
          aria-label="Clear search"
        >×</button>
      </div>

      <select v-model="selectedGenre" class="genre-select">
        <option value="All">All Genres</option>
        <option v-for="genre in genreOptions" :key="genre" :value="genre">
          {{ genre }}
        </option>
      </select>
    </div>

    <div v-if="filteredSongs.length" class="song-grid">
      <!-- Child component receives the song as a PROP and emits
           events back up, handled by the @... listeners below. -->
      <SongCard
        v-for="song in filteredSongs"
        :key="song.id"
        :song="song"
        @play-song="handlePlay"
        @edit-song="handleEdit"
        @delete-song="handleDelete"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">♫</div>
      <h3>No songs found</h3>
      <p>Try another search or add a song to your library.</p>
      <RouterLink class="add-button" :to="{ name: 'add-song' }">
        ＋ Add Song
      </RouterLink>
    </div>
  </section>
</template>
