<script setup>
// ============================================================
// src/views/GenresView.vue — browse by genre (Composition API)
// Clicking a genre routes to the Library with the genre as a
// route PARAMETER (query), demonstrating router navigation.
// ============================================================

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSongs } from '../composables/useSongs.js'

const router = useRouter()
const { songs, genreOptions } = useSongs()

const genreDirectory = computed(() => [
  { name: 'All', count: songs.value.length },
  ...genreOptions.value.map(genre => ({
    name: genre,
    count: songs.value.filter(song => song.genre === genre).length
  }))
])

function selectGenre(genre) {
  // Navigate with a query param; LibraryView reads it into its filter.
  router.push({ name: 'library', query: genre === 'All' ? {} : { genre } })
}
</script>

<template>
  <section class="genre-page">
    <div class="section-heading">
      <div>
        <h2>Find your sound</h2>
        <p>Choose a genre to see its Bisaya song collection.</p>
      </div>
    </div>

    <div class="genre-grid">
      <button
        v-for="genre in genreDirectory"
        :key="genre.name"
        class="genre-card"
        @click="selectGenre(genre.name)"
      >
        <span class="genre-card-icon">♫</span>
        <span class="genre-card-name">
          {{ genre.name === 'All' ? 'All Genres' : genre.name }}
        </span>
        <span class="genre-card-count">{{ genre.count }} songs</span>
        <span class="genre-card-arrow">→</span>
      </button>
    </div>
  </section>
</template>
