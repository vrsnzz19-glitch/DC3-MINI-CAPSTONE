// ============================================================
// src/composables/useSongs.js  —  REUSABLE COMPOSABLE
// ============================================================
// A composable is a plain function (named "useXxx") that uses
// Vue reactivity (ref/computed/watch) and returns state +
// functions. Any component can call it and SHARE the same state
// because the refs are created once at module level (singleton
// pattern). This is the modern Composition API replacement for
// mixins — see src/mixins/songMixin.js for the old Options API
// way of doing the same thing.
//
// This composable owns ALL song state:
//   - song list (loaded from localStorage, fallback = defaults)
//   - add / edit / delete / toggleFavorite
//   - automatic localStorage persistence (key: spotibai_songs)
// ============================================================

import { ref, computed, watch } from 'vue'
import { defaultSongsWithAudio, findAudio } from '../data/songs.js'

// Storage key used everywhere — keep it consistent.
export const STORAGE_KEY = 'spotibai_songs'

// ------------------------------------------------------------
// Safe localStorage loading.
// Handles: missing key, corrupted/invalid JSON, wrong shapes,
// entries that are not objects, missing titles.
// ------------------------------------------------------------
function loadSavedSongs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    // No saved data at all -> caller falls back to defaults.
    if (raw === null) return null

    const parsed = JSON.parse(raw)

    // Must be an array of song objects with at least a title.
    if (!Array.isArray(parsed)) return null

    const songs = parsed.filter(
      item =>
        item &&
        typeof item === 'object' &&
        typeof item.title === 'string' &&
        item.title.trim()
    )

    return songs
  } catch (error) {
    // Corrupted JSON or localStorage unavailable -> ignore it and
    // fall back to the default sample songs. Never crash the app.
    console.warn('Spotibai: saved songs in localStorage are corrupted, using defaults.', error)
    return null
  }
}

// ------------------------------------------------------------
// Shared singleton state (created ONCE for the whole app, so
// every component that calls useSongs() sees the same list —
// no duplicated state).
// ------------------------------------------------------------
const saved = loadSavedSongs()

// Initialize from saved data FIRST; only fall back to the
// default sample songs when there is nothing valid saved.
// This is why your added songs survive a refresh: we never
// overwrite saved data with the default list.
const songs = ref(saved ? saved.map(song => ({ ...song })) : defaultSongsWithAudio.map(song => ({ ...song })))

// If saved songs came from localStorage, re-attach real audio
// URLs (the stored `audio` field may be stale after a rebuild).
if (saved) {
  songs.value = songs.value.map(song => ({
    ...song,
    audio: song.displayOnly ? '' : findAudio(song.title)
  }))
}

// ------------------------------------------------------------
// Persist to localStorage whenever the list changes.
// watch() fires on add, edit, delete, and favorite toggles.
// We only store plain metadata — NOT object URLs or blobs,
// because localStorage can only hold strings.
// ------------------------------------------------------------
watch(
  songs,
  list => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          list.map(song => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            genre: song.genre,
            year: song.year,
            cover: song.cover,
            favorite: song.favorite,
            displayOnly: song.displayOnly || false
          }))
        )
      )
    } catch (error) {
      console.warn('Spotibai: could not save songs to localStorage.', error)
    }
  },
  { deep: true }
)

// ------------------------------------------------------------
// The composable function itself.
// ------------------------------------------------------------
export function useSongs() {
  const songCount = computed(() => songs.value.length)

  const favoriteCount = computed(
    () => songs.value.filter(song => song.favorite).length
  )

  // Unique genre list derived from the songs (computed = no
  // duplicate state to keep in sync).
  const genreOptions = computed(() =>
    [...new Set(songs.value.map(song => song.genre))].sort()
  )

  function addSong(formData) {
    songs.value.unshift({
      id: Date.now(),
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      album: formData.album.trim() || 'Unknown Album',
      genre: formData.genre,
      year: formData.year || '',
      cover: '',
      favorite: false,
      displayOnly: false,
      audio: findAudio(formData.title.trim())
    })
  }

  function updateSong(id, formData) {
    const song = songs.value.find(item => item.id === id)

    if (!song) return false

    song.title = formData.title.trim()
    song.artist = formData.artist.trim()
    song.album = formData.album.trim() || 'Unknown Album'
    song.genre = formData.genre
    song.year = formData.year || ''
    // Re-match the audio file in case the title changed.
    song.audio = findAudio(song.title)
    return true
  }

  function deleteSong(id) {
    songs.value = songs.value.filter(item => item.id !== id)
  }

  function toggleFavorite(song) {
    song.favorite = !song.favorite
  }

  function getSongById(id) {
    return songs.value.find(song => song.id === Number(id))
  }

  // Everything a component needs.
  return {
    songs,
    songCount,
    favoriteCount,
    genreOptions,
    addSong,
    updateSong,
    deleteSong,
    toggleFavorite,
    getSongById
  }
}
