<script setup>
// ============================================================
// src/views/HomeView.vue — landing page (Composition API)
// Uses the shared useSongs() composable for stats only.
// ============================================================

import { useSongs } from '../composables/useSongs.js'

const { songs, songCount, favoriteCount } = useSongs()

const genreCount = new Set(songs.value.map(song => song.genre)).size
</script>

<template>
  <section class="hero landing-hero">
    <div class="hero-content">
      <span class="hero-tag">WELCOME TO SPOTIBAI</span>
      <h2>One home for<br /><span>Bisaya music.</span></h2>
      <p>
        Explore BisRock, reggae, rock, acoustic, and parody songs.
        Build your own collection and celebrate Bisaya sounds.
      </p>
      <div class="landing-actions">
        <RouterLink class="hero-button" :to="{ name: 'library' }">
          Explore Library <span>→</span>
        </RouterLink>
        <RouterLink class="outline-button" :to="{ name: 'genres' }">
          Browse Genres
        </RouterLink>
      </div>
    </div>
    <div class="hero-decoration">♫</div>
  </section>

  <section class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon blue">♫</div>
      <div>
        <p>Total Songs</p>
        <h3>{{ songCount }}</h3>
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
        <h3>{{ genreCount }}</h3>
      </div>
    </div>
  </section>
</template>
