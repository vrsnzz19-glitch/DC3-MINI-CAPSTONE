// ============================================================
// src/data/songs.js
// Default sample songs + audio file resolution.
// The mp3 files live in src/assets/musics; Vite turns each one
// into a real URL at build time via import.meta.glob below.
// IMPORTANT: only song METADATA (title, artist, ...) is saved
// to localStorage. The resolved `audio` URL is re-computed on
// every app start because it is not stable across builds.
// ============================================================

// Eagerly import every audio file in src/assets/musics as a URL
const musicFiles = import.meta.glob(
  '../assets/musics/*.{mp3,MP3,wav,WAV,ogg,OGG,m4a,M4A}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

// Lowercase and strip everything that is not a letter/number,
// so "Mahal magmahal" still matches "Mahal Magmahal.mp3".
function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Find the real audio URL that belongs to a song title.
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

// Default sample songs used ONLY when localStorage has nothing
// saved yet (or the saved data was corrupted).
const defaultSongs = [
  {
    id: 1,
    title: 'Mahal Magmahal',
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 2,
    title: 'Utang Pa More',
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 3,
    title: 'Englisera',
    artist: 'Missing Filemon',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 4,
    title: 'Inday',
    artist: 'Missing Filemon',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 5,
    title: 'Sine-Sine',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 6,
    title: 'Balay ni Mayang',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 7,
    title: 'Miss Tapia',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 8,
    title: 'Usahay',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 9,
    title: 'Puhon',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 10,
    title: 'Duyog',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 11,
    title: 'Bisan Pa',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 12,
    title: 'Gimingaw Ko Nimo',
    artist: 'BisRock Collection',
    album: 'BisRock Collection',
    genre: 'BisRock',
    year: '',
    cover: '',
    favorite: false
  },
  {
    id: 13,
    title: 'Kape sa Ulan',
    artist: 'Spotibai Demo',
    album: 'Mga Sugboanon nga Demo',
    genre: 'Reggae',
    year: '2025',
    cover: '',
    favorite: false,
    displayOnly: true
  },
  {
    id: 14,
    title: 'Kusog sa Kasingkasing',
    artist: 'Spotibai Demo',
    album: 'Mga Sugboanon nga Demo',
    genre: 'Rock',
    year: '2025',
    cover: '',
    favorite: false,
    displayOnly: true
  },
  {
    id: 15,
    title: 'Si Inday ug si Dodong',
    artist: 'Spotibai Demo',
    album: 'Mga Kataw-anan nga Demo',
    genre: 'Parody',
    year: '2025',
    cover: '',
    favorite: false,
    displayOnly: true
  },
  {
    id: 16,
    title: 'Damgo sa Sugbo',
    artist: 'Spotibai Demo',
    album: 'Mga Sugboanon nga Demo',
    genre: 'Acoustic',
    year: '2025',
    cover: '',
    favorite: false,
    displayOnly: true
  }
]

// Attach the resolved audio URL to every default song.
export const defaultSongsWithAudio = defaultSongs.map(song => ({
  ...song,
  audio: findAudio(song.title)
}))

export { findAudio }
