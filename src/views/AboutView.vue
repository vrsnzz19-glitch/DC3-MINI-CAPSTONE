<script setup>
// ============================================================
// src/views/AboutView.vue — About / Profile page
// ============================================================

import OptionsApiDemo from '../components/OptionsApiDemo.vue'
</script>

<template>
  <OptionsApiDemo />

  <section class="about-section">
    <div class="section-heading">
      <div>
        <h2>About Spotibai</h2>
        <p>Your home for Bisaya music — built as a Vue 3 mini capstone.</p>
      </div>
    </div>

    <div class="about-grid">
      <div class="about-card">
        <span class="eyebrow">THE APP</span>
        <p>
          Spotibai is a Spotify-inspired music library for Bisaya songs:
          BisRock, reggae, rock, acoustic, and parody. Add, edit, delete,
          favorite, and play your collection.
        </p>
      </div>

      <div class="about-card">
        <span class="eyebrow">BUILT WITH</span>
        <ul>
          <li>Vue 3 (Composition API + one Options API demo page)</li>
          <li>Vue Router 4 — Home, Library, Genres, Favorites, Add/Edit Song, About, 404</li>
          <li>Reusable composable (<code>useSongs.js</code>) + one mixin demo</li>
          <li>localStorage persistence (key <code>spotibai_songs</code>)</li>
          <li>Props down, emits up — parent-child communication</li>
        </ul>
      </div>

      <div class="about-card">
        <span class="eyebrow">IMPORTANT — STORAGE NOTE</span>
        <p>
          Your song list is saved in this browser's <strong>localStorage</strong>.
          That is local to THIS browser on THIS device — it is NOT a cloud
          database. Clearing browser data, using another browser, or another
          device will show the default song list again. Audio files live in
          <code>src/assets/musics</code> in the project; localStorage only
          stores the song details (metadata), never the audio itself.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  margin-bottom: 36px;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.about-card {
  padding: 20px;
  border: 1px solid #26344b;
  border-radius: 13px;
  background: #121a29;
}

.about-card p {
  margin: 12px 0 0;
  color: #b4c3da;
  font-size: 12px;
  line-height: 1.8;
}

.about-card ul {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #b4c3da;
  font-size: 12px;
  line-height: 1.9;
}

.about-card code {
  color: #93c5fd;
  overflow-wrap: anywhere;
}
</style>
