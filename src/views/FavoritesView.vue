<script setup>
// ============================================================
// src/views/FavoritesView.vue — favorite songs only
// ============================================================

import { computed } from 'vue'
import { useSongs } from '../composables/useSongs.js'
import SongCard from '../components/SongCard.vue'

const { songs, deleteSong, toggleFavorite } = useSongs()

const favoriteSongs = computed(() =>
  songs.value.filter(song => song.favorite)
)

function handlePlay(song) {
  window.dispatchEvent(new CustomEvent('spotibai:play', { detail: song }))
}

function handleEdit(song) {
  // Edit lives in the Library flow; simplest is to route there.
  window.dispatchEvent(new CustomEvent('spotibai:edit', { detail: song }))
}

function handleDelete(song) {
  if (confirm(`Delete "${song.title}" from your library?`)) {
    window.dispatchEvent(new CustomEvent('spotibai:stop-if-playing', { detail: song }))
    deleteSong(song.id)
  }
}
</script>

<template>
  <section class="library-section">
    <div class="section-heading">
      <div>
        <h2>Favorite Songs</h2>
        <p>The songs you have saved as favorites.</p>
      </div>
      <span class="result-count">{{ favoriteSongs.length }} songs</span>
    </div>

    <div v-if="favoriteSongs.length" class="song-grid">
      <SongCard
        v-for="song in favoriteSongs"
        :key="song.id"
        :song="song"
        @play-song="handlePlay"
        @edit-song="handleEdit"
        @delete-song="handleDelete"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">♡</div>
      <h3>No favorites yet</h3>
      <p>Tap the heart on any song to save it here.</p>
      <RouterLink class="add-button" :to="{ name: 'library' }">
        ♫ Go to Library
      </RouterLink>
    </div>
  </section>
</template>
