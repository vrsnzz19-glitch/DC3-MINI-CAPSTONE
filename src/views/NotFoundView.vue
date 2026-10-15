<script setup>
// ============================================================
// src/views/NotFoundView.vue — 404 page (router catch-all)
// ============================================================
</script>

<template>
  <section class="empty-state notfound">
    <div class="empty-icon">404</div>
    <h3>Page not found</h3>
    <p>The page you are looking for does not exist in Spotibai.</p>
    <RouterLink class="add-button" :to="{ name: 'home' }">
      ⌂ Back to Home
    </RouterLink>
  </section>
</template>

<style scoped>
.notfound {
  margin-bottom: 36px;
}

.empty-icon {
  font: 700 43px 'Space Grotesk', sans-serif;
}
</style>
