<script setup>
// ============================================================
// src/App.vue — ROOT COMPONENT
// ============================================================
// The app shell (sidebar + topbar + <RouterView>) and the
// full-screen music player live here. ALL song data lives in
// the useSongs() composable shared by App and every view —
// there is NO duplicated song state anywhere.
//
// The player listens for the `spotibai:play` window event that
// LibraryView / FavoritesView emit from their SongCard children,
// so the player logic stays in one place without prop drilling.
// ============================================================

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useSongs } from './composables/useSongs.js'

const router = useRouter()
const { songs, songCount, favoriteCount, genreOptions, toggleFavorite } = useSongs()

// -------- Sidebar genre navigation --------
const genreCounts = computed(() =>
  genreOptions.value.map(genre => ({
    name: genre,
    count: songs.value.filter(song => song.genre === genre).length
  }))
)

// Page titles change per route.
const pageTitle = computed(() => ({
  home: 'Discover Bisaya Music',
  library: 'Your Music Library',
  genres: 'Browse by Genre',
  favorites: 'Your Favorites',
  'add-song': 'Add a Song',
  'edit-song': 'Edit Song',
  about: 'About Spotibai',
  'not-found': 'Page Not Found'
}[router.currentRoute.value.name] || 'Spotibai'))

// ============================================================
// FULL-SCREEN MUSIC PLAYER (unchanged behavior from before)
// ============================================================
const currentSong = ref(null)
const isPlaying = ref(false)
const showFullPlayer = ref(false)
const audioElement = ref(null)
const currentTime = ref(0)
const duration = ref(0)

const progress = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  return `${mins}:${String(secs).padStart(2, '0')}`
}

function playSong(song) {
  if (song.displayOnly) return

  if (currentSong.value?.id === song.id && audioElement.value) {
    if (isPlaying.value) {
      audioElement.value.pause()
    } else if (song.audio) {
      audioElement.value.play().catch(() => {
        isPlaying.value = false
        alert('Unable to play this audio file.')
      })
    } else {
      alert(`No audio file was found for "${song.title}".`)
    }

    return
  }

  currentSong.value = song
  showFullPlayer.value = true
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
}

function togglePlayback() {
  if (!currentSong.value) return

  if (!currentSong.value.audio) {
    alert(`No audio file was found for "${currentSong.value.title}".`)
    return
  }

  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play().catch(() => {
      isPlaying.value = false
      alert('Unable to play this audio file.')
    })
  }
}

function stopSong() {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.currentTime = 0
  }

  currentSong.value = null
  isPlaying.value = false
  showFullPlayer.value = false
  currentTime.value = 0
  duration.value = 0
}

function closeFullPlayer() {
  showFullPlayer.value = false
}

function handleAudioLoaded() {
  duration.value = audioElement.value?.duration || 0
}

function handleTimeUpdate() {
  currentTime.value = audioElement.value?.currentTime || 0
}

function handleAudioEnded() {
  isPlaying.value = false
  currentTime.value = 0
}

function handleAudioPlay() {
  isPlaying.value = true
}

function handleAudioPause() {
  isPlaying.value = false
}

function seekAudio(event) {
  if (!audioElement.value || !duration.value) return

  const value = Number(event.target.value)
  audioElement.value.currentTime = value
  currentTime.value = value
}

// Views dispatch `spotibai:play` when a SongCard child emits its
// play event; App handles actual playback here.
function handlePlayEvent(event) {
  playSong(event.detail)
}

// A song being deleted may be the one playing — stop it first.
function handleStopIfPlaying(event) {
  if (currentSong.value?.id === event.detail?.id) {
    stopSong()
  }
}

// Favorites view asks to edit: route to the edit page.
function handleEditEvent(event) {
  router.push({ name: 'edit-song', params: { id: event.detail.id } })
}

watch(currentSong, () => {
  currentTime.value = 0
  duration.value = 0
})

onMounted(() => {
  window.addEventListener('spotibai:play', handlePlayEvent)
  window.addEventListener('spotibai:stop-if-playing', handleStopIfPlaying)
  window.addEventListener('spotibai:edit', handleEditEvent)
})

onBeforeUnmount(() => {
  window.removeEventListener('spotibai:play', handlePlayEvent)
  window.removeEventListener('spotibai:stop-if-playing', handleStopIfPlaying)
  window.removeEventListener('spotibai:edit', handleEditEvent)
  if (audioElement.value) {
    audioElement.value.pause()
  }
})
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">♫</div>
        <div>
          <h1>Spotibai</h1>
          <p>Bisaya Music Library</p>
        </div>
      </div>

      <div class="sidebar-label">LIBRARY</div>

      <RouterLink
        class="nav-item"
        :class="{ active: $route.name === 'home' }"
        :to="{ name: 'home' }"
      >
        <span>⌂</span>
        <span>Home</span>
      </RouterLink>

      <RouterLink
        class="nav-item"
        :class="{ active: $route.name === 'library' }"
        :to="{ name: 'library' }"
      >
        <span>♫</span>
        <span>Library</span>
        <span class="nav-count">{{ songCount }}</span>
      </RouterLink>

      <RouterLink
        class="nav-item"
        :class="{ active: $route.name === 'genres' }"
        :to="{ name: 'genres' }"
      >
        <span>♪</span>
        <span>Genres</span>
        <span class="nav-count">{{ genreOptions.length }}</span>
      </RouterLink>

      <RouterLink
        class="nav-item"
        :class="{ active: $route.name === 'favorites' }"
        :to="{ name: 'favorites' }"
      >
        <span>♥</span>
        <span>Favorites</span>
        <span class="nav-count">{{ favoriteCount }}</span>
      </RouterLink>

      <div class="genre-nav">
        <div class="sidebar-label genre-nav-label">GENRES</div>
        <button
          v-for="genre in genreCounts"
          :key="genre.name"
          class="nav-item genre-nav-item"
          :class="{
            active:
              $route.name === 'library' && $route.query.genre === genre.name
          }"
          @click="router.push({ name: 'library', query: { genre: genre.name } })"
        >
          <span>♪</span>
          <span>{{ genre.name }}</span>
          <span class="nav-count">{{ genre.count }}</span>
        </button>
      </div>

      <div class="sidebar-bottom">
        <div class="sidebar-note">
          <span class="note-icon">♪</span>
          <p>Your home for Bisaya music, parody, and more.</p>
        </div>
        <p class="copyright">Spotibai · Music Library</p>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <p class="eyebrow">SPOTIBAI · BISAYA MUSIC HUB</p>
          <h2>{{ pageTitle }}</h2>
        </div>

        <RouterLink
          class="add-button"
          :to="{ name: 'add-song' }"
          title="Add a new song"
        >
          <span>＋</span> Add Song
        </RouterLink>
      </header>

      <!-- All pages render here through the router. -->
      <RouterView />

      <footer class="page-footer">
        <span>Spotibai Music Library</span>
        <span>Made for music lovers ♫</span>
      </footer>
    </main>

    <Transition name="player-fade">
      <section
        v-if="showFullPlayer && currentSong"
        class="full-player"
      >
        <header class="full-player-header">
          <button
            class="back-button"
            @click="closeFullPlayer"
            aria-label="Back to library"
          >←</button>

          <div class="full-player-heading">
            <span>NOW PLAYING</span>
            <strong>SPOTIBAI MUSIC</strong>
          </div>

          <button
            class="player-menu-button"
            @click="stopSong"
            aria-label="Close player"
          >×</button>
        </header>

        <div class="full-player-content">
          <div class="large-cover">
            <img
              v-if="currentSong.cover"
              :src="currentSong.cover"
              :alt="currentSong.title"
              class="large-cover-image"
            />

            <div v-else class="large-note-cover">
              <div class="large-note-glow"></div>
              <span class="large-note">♫</span>
              <span class="large-cover-brand">SPOTIBAI</span>
            </div>
          </div>

          <div class="full-song-info">
            <div class="full-song-text">
              <div>
                <h1>{{ currentSong.title }}</h1>
                <p>{{ currentSong.artist }}</p>
              </div>

              <button
                class="full-favorite"
                :class="{ favorited: currentSong.favorite }"
                @click="toggleFavorite(currentSong)"
                :aria-label="currentSong.favorite ? 'Remove from favorites' : 'Add to favorites'"
              >
                {{ currentSong.favorite ? '♥' : '♡' }}
              </button>
            </div>

            <div class="progress-area">
              <input
                class="progress-slider"
                type="range"
                min="0"
                :max="duration || 0"
                :value="currentTime"
                :style="{ '--progress': progress + '%' }"
                @input="seekAudio"
                aria-label="Song progress"
              />

              <div class="time-labels">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
              </div>
            </div>

            <div class="full-controls">
              <button
                class="secondary-control"
                @click="currentTime = 0; if (audioElement) audioElement.currentTime = 0"
                title="Restart song"
              >↺</button>

              <button
                class="main-play-button"
                @click="togglePlayback"
                :aria-label="isPlaying ? 'Pause' : 'Play'"
              >
                <span v-if="isPlaying">Ⅱ</span>
                <span v-else>▶</span>
              </button>

              <button
                class="secondary-control"
                @click="showFullPlayer = false"
                title="Back to library"
              >⏭</button>
            </div>

            <p class="player-status">
              <span class="status-dot" :class="{ playing: isPlaying }"></span>
              {{ isPlaying ? 'Now playing' : currentSong.audio ? 'Ready to play' : 'Audio file not found' }}
            </p>
          </div>
        </div>

        <div class="full-player-footer">
          <span>♫</span>
          <p>Enjoy Bisaya music in every style.</p>
          <span>{{ currentSong.genre }}</span>
        </div>
      </section>
    </Transition>

    <audio
      v-if="currentSong"
      ref="audioElement"
      :key="currentSong.id"
      :src="currentSong.audio || undefined"
      @loadedmetadata="handleAudioLoaded"
      @timeupdate="handleTimeUpdate"
      @ended="handleAudioEnded"
      @play="handleAudioPlay"
      @pause="handleAudioPause"
    ></audio>
  </div>
</template>

<style>
/* The entire original Spotibai design, extracted unchanged. */
@import './assets/spotibai.css';
</style>
