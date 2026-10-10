
<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'

const musicFiles = import.meta.glob(
  './assets/musics/*.{mp3,MP3,wav,WAV,ogg,OGG,m4a,M4A}',
  { eager: true, query: '?url', import: 'default' }
)

const coverImages = [
  'https://images.genius.com/88a6382386c6a5940ada8b728f102e1b.1000x1000x1.png',
  'https://i.ytimg.com/vi/0R6YO0IAN48/maxresdefault.jpg',
  'https://images.genius.com/b987a0d3e07d6f10d3c434bfb69a651f.1000x1000x1.jpg',
  'https://i.scdn.co/image/ab67616d0000b273d08209944468440145f01524',
  'https://i.discogs.com/my-Hw-OAoNKQoTss4C8BhpJUPCPa4WXOJNcFY9myKls/rs:fit/g:sm/q:90/h:600/w:598/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMxNDky/NjM0LTE3MjQzMjYw/NzItOTIwNi5qcGVn.jpeg',
  'https://public-files.gumroad.com/x6he51oqc22mxvoqi55mdjwq8bcn',
  'https://i1.sndcdn.com/artworks-zkxvm6QyrzQXTlhx-1TU06A-t1080x1080.jpg',
  'https://p1.music.126.net/n6BatGZdnRaEnIC0h7kVOg==/109951167815599264.jpg',
  'https://i.discogs.com/zbhoYcZv3JeGmNH7BCriAQanJkwALwpVIstvpbIM8hM/rs:fit/g:sm/q:90/h:593/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTczMTAx/OS0xNjg2MDUwNjYw/LTE0NTYuanBlZw.jpeg',
  'https://images.genius.com/38045c69587da8a5ed7abc0c7ca059f8.1000x1000x1.png',
  'https://guitartunio.com/wp-content/uploads/2023/05/Those-Eyes-Chords-by-New-West.jpg',
  'https://images.genius.com/211bc5c59b071c5613ce9ce82d70f6eb.1000x1000x1.png',

]

const demoData = [
  ['Perfect', 'Ed Sheeran', 'Divide', 'Pop', 2017],
  ['Shape of You', 'Ed Sheeran', 'Divide', 'Pop', 2017],
  ['Photograph', 'Ed Sheeran', 'Multiply', 'Pop', 2014],
  ['Die With A Smile', 'Lady Gaga, Bruno Mars', 'Single', 'Pop', 2024],
  ['Birds of a Feather', 'Billie Eilish', 'Hit Me Hard and Soft', 'Pop', 2024],
  ['Cruel Summer', 'Taylor Swift', 'Lover', 'Pop', 2019],
  ['Yellow', 'Coldplay', 'Parachutes', 'Alternative', 2000],
  ['The Scientist', 'Coldplay', 'A Rush of Blood to the Head', 'Alternative', 2002],
  ['Until I Found You', 'Stephen Sanchez', 'Easy On My Eyes', 'Indie', 2022],
  ['Those Eyes', 'New West', 'Call Me When You Hear This Song', 'Indie', 2019],
  ['Best Part', 'Daniel Caesar ft. H.E.R.', 'Freudian', 'R&B', 2017],
  ['Love Yourself', 'Justin Bieber', 'Purpose', 'Pop', 2015],
  ['All of Me', 'John Legend', 'Love in the Future', 'R&B', 2013],
  ['A Thousand Years', 'Christina Perri', 'The Twilight Saga', 'Pop', 2011],
  ['Pasilyo', 'Sunkissed Lola', 'Single', 'OPM', 2022],
  ['Mahika', 'Adie, Janine Berdin', 'Single', 'OPM', 2022],
  ['Mundo', 'IV of Spades', 'ClapClapClap!', 'OPM', 2018],
  ['Araw-Araw', 'Ben&Ben', 'Pebble House', 'OPM', 2019],
  ['Kathang Isip', 'Ben&Ben', 'Limasawa Street', 'OPM', 2017],
  ['Tadhana', 'Up Dharma Down', 'Capacities', 'OPM', 2012],
  ['Leaves', 'Ben&Ben', 'Maybe the Night', 'OPM', 2017],
  ['Huling Sandali', 'December Avenue', 'Single', 'OPM', 2018],
  ['Buwan', 'Juan Karlos', 'Single', 'OPM', 2018],
  ['Ikaw at Ako', 'Johnoy Danao', 'Dapithapon', 'OPM', 2015]
]

let nextId = 1

const demoSongs = demoData.map((item, index) => ({
  id: nextId++,
  title: item[0],
  artist: item[1],
  album: item[2],
  genre: item[3],
  year: item[4],
  cover: coverImages[index % coverImages.length],
  audio: '',
  favorite: false,
  demo: true
}))

function titleFromFilename(path) {
  const filename = path.split('/').pop() || 'Unknown Song'
  return decodeURIComponent(filename)
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const localSongs = Object.entries(musicFiles).map(([path, audio]) => ({
  id: nextId++,
  title: titleFromFilename(path),
  artist: 'Local Artist',
  album: 'My Music',
  genre: 'Local',
  year: new Date().getFullYear(),
  cover: coverImages[(nextId - 2) % coverImages.length],
  audio,
  favorite: false,
  demo: false
}))

const songs = ref([...localSongs, ...demoSongs])

const searchText = ref('')
const selectedFilter = ref('All Songs')
const showNowPlaying = ref(false)
const showForm = ref(false)
const editingId = ref(null)
const currentSong = ref(null)
const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const formError = ref('')

const emptyForm = () => ({
  title: '',
  artist: '',
  album: '',
  genre: 'Pop',
  year: new Date().getFullYear(),
  cover: coverImages[0]
})

const form = ref(emptyForm())

const filters = [
  'All Songs',
  'Favorites',
  'OPM',
  'Pop',
  'R&B',
  'Indie',
  'Alternative',
  'Local'
]

const visibleSongs = computed(() => {
  const query = searchText.value.toLowerCase().trim()

  return songs.value.filter(song => {
    const matchesSearch =
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      (song.album || '').toLowerCase().includes(query)

    const matchesFilter =
      selectedFilter.value === 'All Songs' ||
      (selectedFilter.value === 'Favorites' && song.favorite) ||
      song.genre === selectedFilter.value

    return matchesSearch && matchesFilter
  })
})

const favoriteCount = computed(
  () => songs.value.filter(song => song.favorite).length
)

const playableSongs = computed(
  () => songs.value.filter(song => song.audio)
)

const progress = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
)

function timeLabel(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

async function playSong(song) {
  if (!song) {
    alert('No songs are available to play yet.')
    return
  }

  currentSong.value = song
  showNowPlaying.value = true

  if (!song.audio) {
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    alert('This is a display-only song. Add its audio file to src/assets/musics to play it.')
    return
  }

  await nextTick()

  if (!audioRef.value) return

  try {
    audioRef.value.src = song.audio
    audioRef.value.load()
    await audioRef.value.play()
    isPlaying.value = true
  } catch (error) {
    isPlaying.value = false
    console.error('Unable to play this audio file:', error)
    alert('Unable to play this file. Check that the audio format is supported.')
  }
}

function openSong(song) {
  showNowPlaying.value = true

  if (song.audio) {
    if (currentSong.value?.id === song.id && isPlaying.value) return
    playSong(song)
  } else {
    currentSong.value = song
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
  }
}

async function togglePlayer() {
  if (!currentSong.value) {
    const firstPlayable = playableSongs.value[0]
    if (firstPlayable) await playSong(firstPlayable)
    else alert('Add an audio file to src/assets/musics first.')
    return
  }

  if (!currentSong.value.audio) {
    alert('This is a display-only song. Add its audio file to play it.')
    return
  }

  if (!audioRef.value) return

  try {
    if (audioRef.value.paused) {
      await audioRef.value.play()
      isPlaying.value = true
    } else {
      audioRef.value.pause()
      isPlaying.value = false
    }
  } catch (error) {
    console.error(error)
    isPlaying.value = false
  }
}

function playAdjacent(direction) {
  const playable = playableSongs.value
  if (!playable.length) {
    alert('Add audio files to src/assets/musics to use these controls.')
    return
  }

  const index = playable.findIndex(song => song.id === currentSong.value?.id)
  const nextIndex = index === -1
    ? 0
    : (index + direction + playable.length) % playable.length

  playSong(playable[nextIndex])
}

function playPrevious() {
  playAdjacent(-1)
}

function playNext() {
  playAdjacent(1)
}

function seek(event) {
  if (!audioRef.value || !duration.value) return
  const percent = Number(event.target.value)
  audioRef.value.currentTime = (percent / 100) * duration.value
  currentTime.value = audioRef.value.currentTime
}

function updateTime() {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime || 0
}

function updateDuration() {
  if (!audioRef.value) return
  duration.value = Number.isFinite(audioRef.value.duration)
    ? audioRef.value.duration
    : 0
}

function handleEnded() {
  isPlaying.value = false
  playNext()
}

function toggleFavorite(song) {
  if (!song) return
  song.favorite = !song.favorite
}

function openAddForm() {
  editingId.value = null
  form.value = emptyForm()
  formError.value = ''
  showForm.value = true
}

function openEditForm(song) {
  editingId.value = song.id
  form.value = {
    title: song.title,
    artist: song.artist,
    album: song.album || '',
    genre: song.genre,
    year: song.year || new Date().getFullYear(),
    cover: song.cover || coverImages[0]
  }
  formError.value = ''
  showForm.value = true
}

function saveSong() {
  formError.value = ''

  if (!form.value.title.trim() || !form.value.artist.trim()) {
    formError.value = 'Please enter both the song title and artist.'
    return
  }

  if (editingId.value !== null) {
    const index = songs.value.findIndex(song => song.id === editingId.value)
    if (index !== -1) {
      const updatedSong = {
        ...songs.value[index],
        title: form.value.title.trim(),
        artist: form.value.artist.trim(),
        album: form.value.album.trim() || 'Single',
        genre: form.value.genre,
        year: Number(form.value.year) || new Date().getFullYear(),
        cover: form.value.cover
      }

      songs.value[index] = updatedSong

      if (currentSong.value?.id === updatedSong.id) {
        currentSong.value = updatedSong
      }
    }
  } else {
    songs.value.unshift({
      id: nextId++,
      title: form.value.title.trim(),
      artist: form.value.artist.trim(),
      album: form.value.album.trim() || 'Single',
      genre: form.value.genre,
      year: Number(form.value.year) || new Date().getFullYear(),
      cover: form.value.cover,
      audio: '',
      favorite: false,
      demo: false
    })
  }

  showForm.value = false
}

function deleteSong(song) {
  if (!confirm(`Delete "${song.title}" from Spotibai?`)) return

  if (currentSong.value?.id === song.id) {
    audioRef.value?.pause()
    currentSong.value = null
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
  }

  songs.value = songs.value.filter(item => item.id !== song.id)
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    showForm.value = false
    showNowPlaying.value = false
  }
}

window.addEventListener('keydown', handleKeydown)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  audioRef.value?.pause()
})
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="#" @click.prevent="showNowPlaying = false">
        <span class="brand-icon">♫</span>
        <span>spoti<span class="brand-highlight">bai</span></span>
      </a>

      <div class="side-label">YOUR SPACE</div>

      <button
        class="nav-item"
        :class="{ active: !showNowPlaying && selectedFilter === 'All Songs' }"
        @click="selectedFilter = 'All Songs'; showNowPlaying = false"
      >
        <span class="nav-icon">⌂</span> Home
      </button>

      <button
        class="nav-item"
        :class="{ active: selectedFilter === 'All Songs' && showNowPlaying }"
        @click="showNowPlaying = false; selectedFilter = 'All Songs'"
      >
        <span class="nav-icon">♫</span> All Songs
      </button>

      <button
        class="nav-item"
        :class="{ active: selectedFilter === 'Favorites' }"
        @click="selectedFilter = 'Favorites'; showNowPlaying = false"
      >
        <span class="nav-icon">♥</span> Favorites
      </button>

      <div class="side-label library-label">YOUR LIBRARY</div>

      <button
        v-for="filter in ['OPM', 'Pop', 'R&B', 'Indie', 'Alternative', 'Local']"
        :key="filter"
        class="nav-item genre-nav"
        :class="{ active: selectedFilter === filter }"
        @click="selectedFilter = filter; showNowPlaying = false"
      >
        <span class="genre-dot"></span>{{ filter }}
      </button>

      <div class="sidebar-bottom">
        <div class="sidebar-note">GOOD MUSIC, GOOD MOOD.</div>
        <div class="sidebar-note-small">Your music, your vibe.</div>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div class="topbar-arrows">
          <button title="Back to library" @click="showNowPlaying = false">‹</button>
          <button title="Show songs" @click="showNowPlaying = false">›</button>
        </div>

        <div class="search-box">
          <span>⌕</span>
          <input
            v-model="searchText"
            placeholder="What do you want to listen to?"
            aria-label="Search songs"
          />
          <kbd>⌘ K</kbd>
        </div>

        <button class="add-button" @click="openAddForm">＋ Add Song</button>
      </header>

      <template v-if="!showNowPlaying">
        <section class="hero">
          <div class="hero-content">
            <div class="eyebrow"><span class="live-dot"></span> YOUR PERSONAL MUSIC SPACE</div>
            <h1>Feel the <span>music.</span><br />Live your vibe.</h1>
            <p>All your favorite sounds, all in one place.</p>
            <button class="hero-button" @click="selectedFilter = 'All Songs'">
              <span>▶</span> Explore music
            </button>
            <div class="hero-stats">
              <div>
                <strong>{{ songs.length }}</strong>
                <span>TRACKS</span>
              </div>
              <div>
                <strong>{{ favoriteCount }}</strong>
                <span>FAVORITES</span>
              </div>
              <div>
                <strong>{{ localSongs.length }}</strong>
                <span>LOCAL FILES</span>
              </div>
            </div>
          </div>

          <div class="hero-art" aria-hidden="true">
            <div class="hero-ring ring-one"></div>
            <div class="hero-ring ring-two"></div>
            <div class="vinyl">
              <div class="vinyl-groove"></div>
              <div class="vinyl-label"><span>♫</span></div>
            </div>
            <div class="floating-note note-one">♪</div>
            <div class="floating-note note-two">♫</div>
            <div class="hero-art-caption">PLAY YOUR WORLD</div>
          </div>
        </section>

        <section class="section-block">
          <div class="section-heading">
            <div>
              <div class="section-kicker">YOUR COLLECTION</div>
              <h2>Made for your ears <span>✳</span></h2>
              <p class="section-subtitle">Find your next favorite track.</p>
            </div>
            <button class="text-button" @click="selectedFilter = 'All Songs'">
              View all <span>→</span>
            </button>
          </div>

          <div class="filter-row">
            <button
              v-for="filter in filters"
              :key="filter"
              class="filter-chip"
              :class="{ selected: selectedFilter === filter }"
              @click="selectedFilter = filter"
            >
              {{ filter }}
            </button>
          </div>

          <div class="song-grid" v-if="visibleSongs.length">
            <article
              v-for="(song, index) in visibleSongs"
              :key="song.id"
              class="music-card"
              @click="openSong(song)"
            >
              <div class="cover-art">
                <img class="album-cover" :src="song.cover" :alt="`Cover for ${song.title}`" />
                <span class="cover-index">{{ String(index + 1).padStart(2, '0') }}</span>
                <button
                  class="favorite-button"
                  :class="{ liked: song.favorite }"
                  :aria-label="song.favorite ? 'Remove from favorites' : 'Add to favorites'"
                  @click.stop="toggleFavorite(song)"
                >{{ song.favorite ? '♥' : '♡' }}</button>
                <button class="card-play" :aria-label="`Open ${song.title}`" @click.stop="openSong(song)">▶</button>
              </div>

              <div class="card-info">
                <div class="card-title-row">
                  <h3>{{ song.title }}</h3>
                  <button class="more-button" @click.stop="openEditForm(song)" title="Edit song">•••</button>
                </div>
                <p>{{ song.artist }}</p>
                <div class="card-meta">
                  <span>{{ song.genre }}</span>
                  <span>{{ song.year }}</span>
                </div>
                <div class="card-actions">
                  <button @click.stop="openEditForm(song)">Edit</button>
                  <button class="delete-action" @click.stop="deleteSong(song)">Delete</button>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">♫</div>
            <h3>No songs found</h3>
            <p>Try another search or add a new song to your collection.</p>
            <button class="add-button" @click="openAddForm">＋ Add Song</button>
          </div>
        </section>

        <footer class="page-footer">
          <span>♫ SPOTIBAI</span>
          <span>PARA SA MGA BISAYA NI.</span>
        </footer>
      </template>

      <section v-else class="now-playing-screen">
        <button class="back-button" @click="showNowPlaying = false">← Back to library</button>

        <div v-if="currentSong" class="big-player">
          <div class="big-cover-wrap">
            <img class="big-cover" :src="currentSong.cover" :alt="`Cover for ${currentSong.title}`" />
          </div>

          <div class="big-song-details">
            <div class="section-kicker"><span class="live-dot"></span> NOW PLAYING</div>
            <h1>{{ currentSong.title }}</h1>
            <p class="big-artist">{{ currentSong.artist }}</p>
            <p class="big-album">{{ currentSong.album || 'Single' }} · {{ currentSong.year || 'Unknown year' }}</p>

            <div class="big-player-controls">
              <button @click="playPrevious" aria-label="Previous song">|◀</button>
              <button class="big-play-button" @click="togglePlayer" :aria-label="isPlaying ? 'Pause' : 'Play'">
                {{ isPlaying ? 'Ⅱ' : '▶' }}
              </button>
              <button @click="playNext" aria-label="Next song">▶|</button>
              <button
                class="big-like-button"
                :class="{ liked: currentSong.favorite }"
                @click="toggleFavorite(currentSong)"
                aria-label="Toggle favorite"
              >{{ currentSong.favorite ? '♥' : '♡' }}</button>
            </div>

            <div class="big-progress">
              <span>{{ timeLabel(currentTime) }}</span>
              <input type="range" min="0" max="100" step="0.1" :value="progress" @input="seek" aria-label="Song progress" />
              <span>{{ timeLabel(duration) }}</span>
            </div>

            <p v-if="!currentSong.audio" class="display-only-message">
              This is a display-only track. Add an audio file to
              <code>src/assets/musics/</code> to enable playback.
            </p>
            <p v-else class="playing-status">{{ isPlaying ? '♫ Playing your music' : 'Ready to play' }}</p>
          </div>
        </div>

        <div v-else class="empty-state">
          <h3>Select a song to start listening</h3>
          <button class="add-button" @click="showNowPlaying = false">Back to library</button>
        </div>

        <div class="up-next" v-if="currentSong">
          <div>
            <div class="section-kicker">KEEP THE MUSIC GOING</div>
            <h2>Up next</h2>
          </div>
          <button class="text-button" @click="showNowPlaying = false">Browse library →</button>
        </div>

        <div class="up-next-card" v-if="currentSong">
          <img :src="currentSong.cover" :alt="`Cover for ${currentSong.title}`" />
          <div>
            <strong>{{ currentSong.title }}</strong>
            <p>{{ currentSong.artist }}</p>
          </div>
          <span class="up-next-tag">{{ currentSong.audio ? 'LOCAL AUDIO' : 'DEMO TRACK' }}</span>
        </div>
      </section>
    </main>

    <footer class="player-bar">
      <div class="player-song" v-if="currentSong">
        <img class="player-art" :src="currentSong.cover" :alt="`Cover for ${currentSong.title}`" />
        <div class="player-song-info">
          <strong>{{ currentSong.title }}</strong>
          <span>{{ currentSong.artist }}</span>
        </div>
        <button
          class="player-heart"
          :class="{ liked: currentSong.favorite }"
          @click="toggleFavorite(currentSong)"
          aria-label="Toggle favorite"
        >{{ currentSong.favorite ? '♥' : '♡' }}</button>
      </div>

      <div class="player-song player-placeholder" v-else>
        <div class="player-art placeholder-art">♫</div>
        <div class="player-song-info">
          <strong>Nothing playing</strong>
          <span>Choose a song to begin</span>
        </div>
      </div>

      <div class="player-center">
        <div class="player-controls">
          <button @click="playPrevious" aria-label="Previous song">|◀</button>
          <button class="main-play" @click="togglePlayer" aria-label="Play or pause">
            {{ isPlaying ? 'Ⅱ' : '▶' }}
          </button>
          <button @click="playNext" aria-label="Next song">▶|</button>
        </div>
        <div class="mini-progress">
          <span>{{ timeLabel(currentTime) }}</span>
          <input type="range" min="0" max="100" step="0.1" :value="progress" @input="seek" aria-label="Playback progress" />
          <span>{{ timeLabel(duration) }}</span>
        </div>
      </div>

      <button class="expand-player" @click="showNowPlaying = true" aria-label="Open now playing screen" title="Open Now Playing">⛶</button>
    </footer>

    <audio
      ref="audioRef"
      @timeupdate="updateTime"
      @loadedmetadata="updateDuration"
      @durationchange="updateDuration"
      @ended="handleEnded"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    ></audio>

    <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
      <form class="song-modal" @submit.prevent="saveSong">
        <div class="modal-heading">
          <div>
            <div class="section-kicker">{{ editingId !== null ? 'UPDATE YOUR COLLECTION' : 'GROW YOUR COLLECTION' }}</div>
            <h2>{{ editingId !== null ? 'Edit song' : 'Add a song' }}</h2>
          </div>
          <button type="button" class="close-button" @click="showForm = false" aria-label="Close form">×</button>
        </div>

        <label>
          Song title *
          <input v-model="form.title" required maxlength="100" placeholder="Enter song title" />
        </label>

        <label>
          Artist *
          <input v-model="form.artist" required maxlength="100" placeholder="Enter artist name" />
        </label>

        <label>
          Album
          <input v-model="form.album" maxlength="100" placeholder="Album or single" />
        </label>

        <div class="form-row">
          <label>
            Genre
            <select v-model="form.genre">
              <option>Pop</option>
              <option>OPM</option>
              <option>R&B</option>
              <option>Indie</option>
              <option>Alternative</option>
              <option>Rock</option>
              <option>Local</option>
            </select>
          </label>

          <label>
            Release year
            <input v-model="form.year" type="number" min="1900" max="2100" />
          </label>
        </div>

        <label>Album cover</label>
        <div class="cover-picker">
          <button
            v-for="(cover, index) in coverImages"
            :key="cover"
            type="button"
            :class="{ chosen: form.cover === cover }"
            @click="form.cover = cover"
            :aria-label="`Choose cover ${index + 1}`"
          >
            <img :src="cover" alt="" />
          </button>
        </div>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <div class="modal-actions">
          <button type="button" class="cancel-button" @click="showForm = false">Cancel</button>
          <button type="submit" class="save-button">{{ editingId !== null ? 'Save changes' : 'Add song' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
