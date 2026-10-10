
<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const musicFiles = import.meta.glob(
  './assets/musics/*.{mp3,MP3,wav,WAV,ogg,OGG,m4a,M4A}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function findAudio(title) {
  const wanted = normalize(title)

  for (const [path, url] of Object.entries(musicFiles)) {
    const filename = path.split('/').pop().replace(/\.[^.]+$/, '')

    if (normalize(filename) === wanted) {
      return url
    }
  }

  return ''
}

const songs = ref([
  {
    id: 1,
    title: 'Mahal Magmahal',
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: true,
    audio: findAudio('Mahal magmahal')
  },
  {
    id: 2,
    title: 'Utang Pa More',
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: true,
    audio: findAudio('Utang Pa More')
  },
  {
    id: 3,
    title: 'Englisera',
    artist: 'Missing Filemon',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Englisera')
  },
  {
    id: 4,
    title: 'Inday',
    artist: 'Missing Filemon',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Inday')
  },
  {
    id: 5,
    title: 'Sine-Sine',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Sine-Sine')
  },
  {
    id: 6,
    title: 'Balay ni Mayang',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Balay ni Mayang')
  },
  {
    id: 7,
    title: 'Miss Tapia',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Miss Tapia')
  },
  {
    id: 8,
    title: 'Usahay',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Usahay')
  },
  {
    id: 9,
    title: 'Puhon',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Puhon')
  },
  {
    id: 10,
    title: 'Duyog',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Duyog')
  },
  {
    id: 11,
    title: 'Bisan Pa',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Bisan Pa')
  },
  {
    id: 12,
    title: 'Gimingaw Ko Nimo',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false,
    protected: false,
    audio: findAudio('Gimingaw Ko Nimo')
  }
])

const searchQuery = ref('')
const selectedGenre = ref('All')
const activeTab = ref('All Songs')
const currentSong = ref(null)
const isPlaying = ref(false)
const showFullPlayer = ref(false)
const audioElement = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const showForm = ref(false)
const editingSong = ref(null)
const formError = ref('')

const form = ref({
  title: '',
  artist: '',
  album: '',
  genre: 'BisRock',
  year: ''
})

const genres = computed(() => [
  'All',
  ...new Set(songs.value.map(song => song.genre))
])

const favoriteCount = computed(() =>
  songs.value.filter(song => song.favorite).length
)

const filteredSongs = computed(() => {
  let result = songs.value

  if (activeTab.value === 'Favorites') {
    result = result.filter(song => song.favorite)
  }

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

function openAddForm() {
  editingSong.value = null
  formError.value = ''

  form.value = {
    title: '',
    artist: '',
    album: '',
    genre: 'BisRock',
    year: ''
  }

  showForm.value = true
}

function openEditForm(song) {
  if (song.protected) {
    alert('This song is protected and cannot be edited.')
    return
  }

  editingSong.value = song

  form.value = {
    title: song.title,
    artist: song.artist,
    album: song.album,
    genre: song.genre,
    year: song.year
  }

  formError.value = ''
  showForm.value = true
}

function saveSong() {
  formError.value = ''

  if (!form.value.title.trim() || !form.value.artist.trim()) {
    formError.value = 'Please enter the song title and artist.'
    return
  }

  if (editingSong.value) {
    const song = songs.value.find(
      item => item.id === editingSong.value.id
    )

    if (song && !song.protected) {
      song.title = form.value.title.trim()
      song.artist = form.value.artist.trim()
      song.album = form.value.album.trim() || 'Unknown Album'
      song.genre = form.value.genre
      song.year = form.value.year || ''
      song.audio = findAudio(song.title)
    }
  } else {
    songs.value.unshift({
      id: Date.now(),
      title: form.value.title.trim(),
      artist: form.value.artist.trim(),
      album: form.value.album.trim() || 'Unknown Album',
      genre: form.value.genre,
      year: form.value.year || '',
      cover: '',
      favorite: false,
      protected: false,
      audio: findAudio(form.value.title.trim())
    })
  }

  showForm.value = false
}

function deleteSong(song) {
  if (song.protected) {
    alert(`"${song.title}" is protected and cannot be deleted.`)
    return
  }

  if (confirm(`Delete "${song.title}" from your library?`)) {
    if (currentSong.value?.id === song.id) {
      stopSong()
    }

    songs.value = songs.value.filter(item => item.id !== song.id)
  }
}

function toggleFavorite(song) {
  song.favorite = !song.favorite
}

function openFullPlayer(song) {
  currentSong.value = song
  showFullPlayer.value = true
}

function playSong(song) {
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

watch(currentSong, () => {
  currentTime.value = 0
  duration.value = 0
})

onBeforeUnmount(() => {
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
          <p>BisRock Music Library</p>
        </div>
      </div>

      <div class="sidebar-label">LIBRARY</div>

      <button
        class="nav-item"
        :class="{ active: activeTab === 'All Songs' }"
        @click="activeTab = 'All Songs'"
      >
        <span>♫</span>
        <span>All Songs</span>
        <span class="nav-count">{{ songs.length }}</span>
      </button>

      <button
        class="nav-item"
        :class="{ active: activeTab === 'Favorites' }"
        @click="activeTab = 'Favorites'"
      >
        <span>♥</span>
        <span>Favorites</span>
        <span class="nav-count">{{ favoriteCount }}</span>
      </button>

      <div class="sidebar-bottom">
        <div class="sidebar-note">
          <span class="note-icon">♪</span>
          <p>Your home for BisRock music.</p>
        </div>
        <p class="copyright">Spotibai · Music Library</p>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <p class="eyebrow">YOUR PERSONAL COLLECTION</p>
          <h2>Music Library</h2>
        </div>

        <button class="add-button" @click="openAddForm">
          <span>＋</span> Add Song
        </button>
      </header>

      <section class="hero">
        <div class="hero-content">
          <span class="hero-tag">BISROCK COLLECTION</span>
          <h2>Feel the music.<br /><span>Feel the BisRock.</span></h2>
          <p>
            Your favorite Cebuano sounds, all in one place.
            Keep your songs organized and enjoy the music.
          </p>
          <button
            class="hero-button"
            @click="activeTab = 'All Songs'"
          >
            Explore Library <span>→</span>
          </button>
        </div>
        <div class="hero-decoration">♫</div>
      </section>

      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon purple">♫</div>
          <div>
            <p>Total Songs</p>
            <h3>{{ songs.length }}</h3>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pink">♥</div>
          <div>
            <p>Favorites</p>
            <h3>{{ favoriteCount }}</h3>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon blue">♪</div>
          <div>
            <p>Genres</p>
            <h3>{{ new Set(songs.map(song => song.genre)).size }}</h3>
          </div>
        </div>
      </section>

      <section class="library-section">
        <div class="section-heading">
          <div>
            <h2>
              {{ activeTab === 'Favorites' ? 'Favorite Songs' : 'Your Songs' }}
            </h2>
            <p>Manage and discover your music collection.</p>
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
            <option
              v-for="genre in genres"
              :key="genre"
              :value="genre"
            >
              {{ genre === 'All' ? 'All Genres' : genre }}
            </option>
          </select>
        </div>

        <div v-if="filteredSongs.length" class="song-grid">
          <article
            v-for="song in filteredSongs"
            :key="song.id"
            class="song-card"
            @click="openFullPlayer(song)"
          >
            <div class="cover-wrap">
              <img
                v-if="song.cover"
                :src="song.cover"
                :alt="song.title"
                class="song-cover"
              />

              <div v-else class="music-note-cover">
                <span class="cover-note">♫</span>
                <small>SPOTIBAI</small>
              </div>

              <button
                class="favorite-button"
                :class="{ favorited: song.favorite }"
                @click.stop="toggleFavorite(song)"
                :aria-label="song.favorite ? 'Remove from favorites' : 'Add to favorites'"
                :title="song.favorite ? 'Remove from favorites' : 'Add to favorites'"
              >
                {{ song.favorite ? '♥' : '♡' }}
              </button>

              <button
                class="cover-play"
                @click.stop="playSong(song)"
                :aria-label="'Play ' + song.title"
                title="Play song"
              >▶</button>
            </div>

            <div class="song-info">
              <div class="song-title-row">
                <h3 :title="song.title">{{ song.title }}</h3>
                <span
                  v-if="song.protected"
                  class="protected-mark"
                  title="Protected song"
                >🔒</span>
              </div>

              <p class="song-artist">{{ song.artist }}</p>

              <div class="song-meta">
                <span>{{ song.genre }}</span>
                <span>{{ song.year || 'Year unknown' }}</span>
              </div>

              <p class="song-album">{{ song.album || 'Unknown Album' }}</p>

              <div class="card-actions">
                <button
                  class="play-button"
                  @click.stop="playSong(song)"
                >
                  <span>▶</span> Play
                </button>

                <button
                  class="icon-action"
                  @click.stop="openEditForm(song)"
                  :disabled="song.protected"
                  :title="song.protected ? 'This song cannot be edited' : 'Edit song'"
                >✎</button>

                <button
                  class="icon-action delete-action"
                  @click.stop="deleteSong(song)"
                  :disabled="song.protected"
                  :title="song.protected ? 'This song cannot be deleted' : 'Delete song'"
                >⌫</button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">♫</div>
          <h3>No songs found</h3>
          <p>Try another search or add a song to your library.</p>
          <button class="add-button" @click="openAddForm">
            ＋ Add Song
          </button>
        </div>
      </section>

      <footer class="page-footer">
        <span>Spotibai Music Library</span>
        <span>Made for music lovers ♫</span>
      </footer>
    </main>

    <div
      v-if="showForm"
      class="modal-overlay"
      @click.self="showForm = false"
    >
      <div class="song-modal">
        <div class="modal-header">
          <div>
            <p class="eyebrow">
              {{ editingSong ? 'UPDATE YOUR LIBRARY' : 'GROW YOUR COLLECTION' }}
            </p>
            <h2>{{ editingSong ? 'Edit Song' : 'Add a Song' }}</h2>
          </div>
          <button
            class="modal-close"
            @click="showForm = false"
            aria-label="Close"
          >×</button>
        </div>

        <p class="modal-description">
          Enter the song details below.
        </p>

        <form @submit.prevent="saveSong">
          <label>
            Song Title <span>*</span>
            <input
              v-model="form.title"
              type="text"
              placeholder="Enter song title"
              required
            />
          </label>

          <label>
            Artist <span>*</span>
            <input
              v-model="form.artist"
              type="text"
              placeholder="Enter artist name"
              required
            />
          </label>

          <label>
            Album
            <input
              v-model="form.album"
              type="text"
              placeholder="Enter album name (optional)"
            />
          </label>

          <div class="form-row">
            <label>
              Genre
              <select v-model="form.genre">
                <option>BisRock</option>
                <option>OPM</option>
                <option>Rock</option>
                <option>Alternative</option>
                <option>Pop</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Release Year
              <input
                v-model="form.year"
                type="number"
                min="1900"
                max="2100"
                placeholder="Optional"
              />
            </label>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="modal-actions">
            <button
              type="button"
              class="cancel-button"
              @click="showForm = false"
            >
              Cancel
            </button>

            <button type="submit" class="add-button">
              {{ editingSong ? 'Save Changes' : 'Add Song' }}
            </button>
          </div>
        </form>
      </div>
    </div>

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
          >⌄</button>

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
              >⌄</button>
            </div>

            <p class="player-status">
              <span class="status-dot" :class="{ playing: isPlaying }"></span>
              {{ isPlaying ? 'Now playing' : currentSong.audio ? 'Ready to play' : 'Audio file not found' }}
            </p>
          </div>
        </div>

        <div class="full-player-footer">
          <span>♫</span>
          <p>Enjoy your favorite BisRock music.</p>
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
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  font-family: 'DM Sans', sans-serif;
  color: #f5f3ff;
  background: #100e18;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background: #100e18;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.app-shell {
  min-height: 100vh;
  background: #100e18;
}

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  width: 245px;
  padding: 28px 18px;
  background: #15121f;
  border-right: 1px solid #292337;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 36px;
}

.brand-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  border-radius: 14px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: white;
  font-size: 27px;
  font-weight: bold;
}

.brand h1 {
  margin: 0;
  font: 700 23px 'Space Grotesk', sans-serif;
  letter-spacing: -1px;
}

.brand p {
  margin: 3px 0 0;
  color: #8e879f;
  font-size: 10px;
}

.sidebar-label,
.eyebrow {
  color: #8e879f;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.sidebar-label {
  padding: 0 12px 13px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 7px;
  padding: 13px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: #a9a2b9;
  text-align: left;
  font-size: 13px;
  transition: 0.2s;
}

.nav-item > span:first-child {
  width: 19px;
  font-size: 19px;
}

.nav-item.active,
.nav-item:hover {
  background: #282035;
  border-color: #3a2a4e;
  color: #e7c6ff;
}

.nav-count {
  margin-left: auto;
  color: #8f849e;
  font-size: 11px;
}

.sidebar-bottom {
  margin-top: auto;
}

.sidebar-note {
  padding: 17px;
  border: 1px solid #33263f;
  border-radius: 13px;
  background: #201829;
}

.note-icon {
  color: #d58bff;
  font-size: 24px;
}

.sidebar-note p {
  margin: 9px 0 0;
  color: #b7adc7;
  font-size: 12px;
  line-height: 1.7;
}

.copyright {
  margin: 18px 5px 0;
  color: #655d73;
  font-size: 10px;
}

.main-content {
  max-width: 1600px;
  min-height: 100vh;
  margin-left: 245px;
  padding: 30px 38px 105px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}

.topbar h2,
.section-heading h2 {
  margin: 0;
  font: 700 25px 'Space Grotesk', sans-serif;
  letter-spacing: -0.7px;
}

.add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 17px;
  border: 0;
  border-radius: 9px;
  background: linear-gradient(110deg, #a855f7, #d946ef);
  color: white;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 5px 18px #a855f722;
  transition: transform 0.2s, opacity 0.2s;
}

.add-button:hover,
.hero-button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.add-button span {
  font-size: 18px;
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 255px;
  overflow: hidden;
  padding: 34px 37px;
  border: 1px solid #49305d;
  border-radius: 17px;
  background:
    radial-gradient(ellipse at 85% 10%, #7739a74d, transparent 40%),
    linear-gradient(115deg, #291b3d 0%, #1d1830 56%, #2b1740 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 550px;
}

.hero-tag {
  display: inline-block;
  padding: 6px 9px;
  border: 1px solid #8b5dbb66;
  border-radius: 5px;
  background: #8b5dbb22;
  color: #e5baff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.hero h2 {
  margin: 17px 0 10px;
  font: 700 clamp(27px, 3vw, 39px) 'Space Grotesk', sans-serif;
  line-height: 1.15;
  letter-spacing: -1.5px;
}

.hero h2 span {
  color: #d99aff;
}

.hero p {
  max-width: 430px;
  margin: 0;
  color: #bcb0cc;
  font-size: 12px;
  line-height: 1.8;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  margin-top: 19px;
  padding: 10px 15px;
  border: 0;
  border-radius: 8px;
  background: #f5eaff;
  color: #342044;
  font-size: 11px;
  font-weight: 700;
  transition: 0.2s;
}

.hero-decoration {
  position: absolute;
  right: 8%;
  top: 50%;
  color: #b86af6;
  font-size: 180px;
  line-height: 1;
  opacity: 0.14;
  transform: translateY(-50%) rotate(-12deg);
  user-select: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  margin: 22px 0 36px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 19px;
  border: 1px solid #2b2538;
  border-radius: 13px;
  background: #191622;
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  border-radius: 12px;
  font-size: 22px;
}

.stat-icon.purple {
  background: #7335a82b;
  color: #c38bff;
}

.stat-icon.pink {
  background: #c43e7924;
  color: #ff80b2;
}

.stat-icon.blue {
  background: #3b65b326;
  color: #8aaeff;
}

.stat-card p {
  margin: 0 0 5px;
  color: #92899f;
  font-size: 11px;
}

.stat-card h3 {
  margin: 0;
  font: 700 24px 'Space Grotesk', sans-serif;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 18px;
}

.section-heading h2 {
  font-size: 21px;
}

.section-heading p {
  margin: 6px 0 0;
  color: #8e879f;
  font-size: 11px;
}

.result-count {
  padding: 7px 10px;
  border: 1px solid #32283f;
  border-radius: 7px;
  background: #1b1625;
  color: #c4a1e6;
  font-size: 10px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 9px;
  min-width: 0;
  padding: 0 13px;
  border: 1px solid #302a3d;
  border-radius: 9px;
  background: #191622;
  color: #a99ab9;
}

.search-box > span {
  font-size: 23px;
}

.search-box input {
  width: 100%;
  padding: 12px 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #f5f3ff;
  font-size: 11px;
}

.search-box input::placeholder {
  color: #756d84;
}

.clear-search {
  border: 0;
  background: transparent;
  color: #b9afc7;
  font-size: 20px;
}

.genre-select,
.song-modal select {
  padding: 0 13px;
  border: 1px solid #302a3d;
  border-radius: 9px;
  outline: none;
  background: #191622;
  color: #d8cfe5;
  font-size: 11px;
}

.song-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 17px;
}

.song-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #2c2538;
  border-radius: 12px;
  background: #191622;
  transition: transform 0.2s, border-color 0.2s;
  cursor: pointer;
}

.song-card:hover {
  transform: translateY(-3px);
  border-color: #6d438a;
}

.cover-wrap {
  position: relative;
  aspect-ratio: 1 / 0.82;
  overflow: hidden;
  background: #211a2c;
}

.song-cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.music-note-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 20%, #8750a8 0, transparent 42%),
    linear-gradient(145deg, #302044, #17121f 70%);
  color: #dfb7ff;
}

.cover-note {
  font-size: 68px;
  line-height: 1;
  text-shadow: 0 0 25px #bc75ff88;
}

.music-note-cover small {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #a89ab8;
}

.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #ffffff22;
  border-radius: 50%;
  background: #15101dcc;
  color: #ddd2e7;
  font-size: 18px;
}

.favorite-button.favorited {
  color: #ff75ac;
}

.cover-play {
  position: absolute;
  right: 11px;
  bottom: 11px;
  display: grid;
  place-items: center;
  width: 37px;
  height: 37px;
  border: 0;
  border-radius: 50%;
  background: #c67bfa;
  color: #24102f;
  box-shadow: 0 3px 15px #0005;
  transition: transform 0.2s;
}

.cover-play:hover {
  transform: scale(1.08);
}

.song-info {
  padding: 13px;
}

.song-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.song-title-row h3 {
  overflow: hidden;
  margin: 0;
  color: #f2eafa;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.protected-mark {
  flex-shrink: 0;
  font-size: 10px;
}

.song-artist {
  overflow: hidden;
  margin: 6px 0 10px;
  color: #a399b2;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.song-meta span {
  padding: 4px 7px;
  border-radius: 5px;
  background: #33243f;
  color: #d1a9f0;
  font-size: 9px;
}

.song-album {
  overflow: hidden;
  margin: 9px 0 13px;
  color: #80768e;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.play-button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 8px 9px;
  border: 0;
  border-radius: 7px;
  background: #342342;
  color: #e2c2ff;
  font-size: 10px;
  font-weight: 700;
}

.play-button:hover {
  background: #4a2d60;
}

.icon-action {
  display: grid;
  place-items: center;
  width: 31px;
  height: 31px;
  border: 1px solid #352c42;
  border-radius: 7px;
  background: #211b2b;
  color: #b5a8c6;
  font-size: 16px;
}

.icon-action:hover:not(:disabled) {
  border-color: #8e55b8;
  color: #e8c5ff;
}

.delete-action:hover:not(:disabled) {
  border-color: #a33e60;
  color: #ff8aaa;
}

.empty-state {
  padding: 55px 20px;
  border: 1px dashed #3a3048;
  border-radius: 13px;
  text-align: center;
}

.empty-icon {
  color: #a877d1;
  font-size: 43px;
}

.empty-state h3 {
  margin: 13px 0 8px;
  font: 700 19px 'Space Grotesk', sans-serif;
}

.empty-state p {
  margin: 0 0 18px;
  color: #91879f;
  font-size: 12px;
}

.page-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 38px;
  padding-top: 20px;
  border-top: 1px solid #2b2538;
  color: #70677e;
  font-size: 10px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 20px;
  background: #08060dc9;
  backdrop-filter: blur(7px);
}

.song-modal {
  width: min(100%, 490px);
  padding: 26px;
  border: 1px solid #453253;
  border-radius: 16px;
  background: #1b1725;
  box-shadow: 0 20px 70px #0007;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
}

.modal-header h2 {
  margin: 0;
  font: 700 25px 'Space Grotesk', sans-serif;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: 1px solid #3d324b;
  border-radius: 8px;
  background: #272031;
  color: #d2c4df;
  font-size: 22px;
}

.modal-description {
  margin: 12px 0 22px;
  color: #9d92ad;
  font-size: 11px;
  line-height: 1.7;
}

.song-modal form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.song-modal label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #d8cee4;
  font-size: 11px;
  font-weight: 600;
}

.song-modal label span {
  color: #f28ab4;
}

.song-modal input,
.song-modal select {
  width: 100%;
  min-height: 41px;
  padding: 10px 12px;
  border: 1px solid #393047;
  border-radius: 8px;
  outline: none;
  background: #15121e;
  color: #f4edfa;
  font-size: 12px;
}

.song-modal input:focus,
.song-modal select:focus {
  border-color: #a855f7;
}

.song-modal input::placeholder {
  color: #71677e;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-error {
  margin: 0;
  color: #ff8eae;
  font-size: 11px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.cancel-button {
  padding: 10px 15px;
  border: 1px solid #40364c;
  border-radius: 8px;
  background: transparent;
  color: #c7bbd5;
  font-size: 11px;
}

/* Full-screen music player */

.full-player {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 25px 5vw 20px;
  overflow-y: auto;
  background:
    radial-gradient(ellipse at 50% 0%, #66368c 0%, transparent 42%),
    linear-gradient(145deg, #21152e 0%, #110e19 58%, #0c0a12 100%);
}

.full-player-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.back-button,
.player-menu-button {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid #ffffff20;
  border-radius: 50%;
  background: #ffffff0c;
  color: #f4eaff;
  font-size: 26px;
}

.back-button {
  transform: rotate(0deg);
}

.player-menu-button {
  justify-self: end;
  font-size: 27px;
}

.full-player-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.full-player-heading span {
  color: #cba6e8;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
}

.full-player-heading strong {
  color: #f3e9ff;
  font: 700 14px 'Space Grotesk', sans-serif;
  letter-spacing: 1px;
}

.full-player-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  align-items: center;
  gap: clamp(30px, 6vw, 90px);
  width: 100%;
  max-width: 900px;
  margin: auto;
  padding: 35px 0;
}

.large-cover {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1;
  overflow: hidden;
  justify-self: center;
  border: 1px solid #ffffff16;
  border-radius: 24px;
  background: #211a2c;
  box-shadow: 0 25px 80px #0007, 0 0 70px #ad5fe722;
}

.large-cover-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.large-note-cover {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at 25% 20%, #8b45b8 0%, transparent 42%),
    radial-gradient(circle at 80% 85%, #563178 0%, transparent 40%),
    linear-gradient(145deg, #30203f, #17101f 70%);
}

.large-note-glow {
  position: absolute;
  width: 65%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #c16cff;
  filter: blur(70px);
  opacity: 0.17;
}

.large-note {
  position: relative;
  color: #f0d9ff;
  font-size: clamp(110px, 17vw, 200px);
  line-height: 1;
  text-shadow: 0 0 40px #c184ff88;
}

.large-cover-brand {
  position: relative;
  color: #c8a8e3;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 6px;
}

.full-song-info {
  width: 100%;
  min-width: 0;
}

.full-song-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 35px;
}

.full-song-text h1 {
  overflow-wrap: anywhere;
  margin: 0;
  color: #fff8ff;
  font: 700 clamp(25px, 3.5vw, 38px) 'Space Grotesk', sans-serif;
  letter-spacing: -1px;
}

.full-song-text p {
  margin: 9px 0 0;
  color: #b9a8c9;
  font-size: 14px;
}

.full-favorite {
  flex-shrink: 0;
  border: 0;
  background: transparent;
  color: #b7a6c6;
  font-size: 31px;
}

.full-favorite.favorited {
  color: #ff79b1;
}

.progress-area {
  width: 100%;
}

.progress-slider {
  display: block;
  width: 100%;
  height: 5px;
  margin: 0;
  border-radius: 20px;
  outline: none;
  appearance: none;
  background: linear-gradient(
    to right,
    #d9a0ff 0%,
    #d9a0ff var(--progress, 0%),
    #51445f var(--progress, 0%),
    #51445f 100%
  );
  cursor: pointer;
}

.progress-slider::-webkit-slider-thumb {
  width: 13px;
  height: 13px;
  border: 2px solid #f8eaff;
  border-radius: 50%;
  appearance: none;
  background: #c084fc;
  box-shadow: 0 0 10px #c084fc66;
}

.progress-slider::-moz-range-thumb {
  width: 11px;
  height: 11px;
  border: 2px solid #f8eaff;
  border-radius: 50%;
  background: #c084fc;
}

.time-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #9888a9;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.full-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
}

.secondary-control {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  border: 1px solid #ffffff15;
  border-radius: 50%;
  background: #ffffff09;
  color: #d7c4e6;
  font-size: 24px;
}

.main-play-button {
  display: grid;
  place-items: center;
  width: 67px;
  height: 67px;
  border: 0;
  border-radius: 50%;
  background: #f4e6ff;
  color: #281636;
  font-size: 25px;
  box-shadow: 0 5px 30px #c084fc35;
  transition: transform 0.2s;
}

.main-play-button:hover {
  transform: scale(1.06);
}

.player-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 26px;
  color: #a999b9;
  font-size: 11px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #766582;
}

.status-dot.playing {
  background: #d69bff;
  box-shadow: 0 0 12px #d69bff;
}

.full-player-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 15px 0 0;
  border-top: 1px solid #ffffff12;
  color: #9d8baa;
}

.full-player-footer > span:first-child {
  color: #d6a5ff;
  font-size: 21px;
}

.full-player-footer p {
  margin: 0;
  font-size: 11px;
}

.full-player-footer > span:last-child {
  margin-left: 10px;
  padding: 5px 9px;
  border: 1px solid #ffffff15;
  border-radius: 6px;
  color: #d7b5f0;
  font-size: 10px;
}

.player-fade-enter-active,
.player-fade-leave-active {
  transition: opacity 0.22s ease;
}

.player-fade-enter-from,
.player-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1250px) {
  .song-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .main-content {
    padding-right: 25px;
    padding-left: 25px;
  }
}

@media (max-width: 900px) {
  .sidebar {
    width: 195px;
  }

  .main-content {
    margin-left: 195px;
  }

  .song-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero {
    padding: 28px;
  }

  .hero-decoration {
    right: 3%;
    font-size: 130px;
  }

  .full-player-content {
    gap: 30px;
  }

  .large-cover {
    max-width: 330px;
  }
}

@media (max-width: 600px) {
  .sidebar {
    position: static;
    width: 100%;
    padding: 17px;
    border-right: 0;
    border-bottom: 1px solid #292337;
  }

  .brand {
    padding: 0 5px 17px;
  }

  .sidebar-label,
  .sidebar-bottom {
    display: none;
  }

  .sidebar .nav-item {
    display: inline-flex;
    width: auto;
    margin: 0 5px 0 0;
    padding: 9px 12px;
  }

  .nav-count {
    display: none;
  }

  .main-content {
    margin-left: 0;
    padding: 22px 15px 30px;
  }

  .topbar h2 {
    font-size: 22px;
  }

  .topbar .add-button {
    padding: 10px 12px;
  }

  .hero {
    min-height: 235px;
    padding: 24px 20px;
  }

  .hero-decoration {
    right: -7%;
    font-size: 100px;
  }

  .hero h2 {
    font-size: 30px;
  }

  .hero p {
    max-width: 280px;
    font-size: 11px;
  }

  .stats-grid {
    gap: 8px;
  }

  .stat-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 9px;
    padding: 12px;
  }

  .stat-icon {
    width: 34px;
    height: 34px;
    font-size: 18px;
  }

  .stat-card p {
    font-size: 10px;
  }

  .stat-card h3 {
    font-size: 20px;
  }

  .filter-bar {
    flex-direction: column;
  }

  .search-box {
    flex: auto;
  }

  .genre-select {
    min-height: 39px;
  }

  .song-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .song-info {
    padding: 10px;
  }

  .song-title-row h3 {
    font-size: 11px;
  }

  .song-artist,
  .song-album {
    font-size: 9px;
  }

  .card-actions {
    gap: 5px;
  }

  .icon-action {
    width: 27px;
    height: 29px;
  }

  .play-button {
    padding: 7px 5px;
    font-size: 9px;
  }

  .page-footer {
    font-size: 9px;
  }

  .song-modal {
    padding: 20px;
  }

  .full-player {
    padding: 17px 20px;
  }

  .full-player-header {
    grid-template-columns: 1fr 2fr 1fr;
  }

  .full-player-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;
    padding: 30px 0;
  }

  .large-cover {
    width: min(75vw, 310px);
    max-width: 310px;
    flex-shrink: 0;
    border-radius: 18px;
  }

  .large-note {
    font-size: 145px;
  }

  .full-song-info {
    max-width: 420px;
  }

  .full-song-text {
    margin-bottom: 25px;
  }

  .full-song-text h1 {
    font-size: 27px;
  }

  .full-song-text p {
    font-size: 12px;
  }

  .full-controls {
    margin-top: 22px;
  }

  .main-play-button {
    width: 59px;
    height: 59px;
  }

  .full-player-footer {
    margin-top: auto;
  }
}
</style>
