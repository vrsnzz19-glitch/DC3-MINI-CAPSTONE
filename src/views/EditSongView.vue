<script setup>
// ============================================================
// src/views/EditSongView.vue — EDIT SONG (dynamic route param)
// ============================================================
// Reads /edit-song/:id via route params, looks up the song in
// the SHARED composable state (no copied state), passes it as a
// prop to <SongForm>, and updates on `submit-song`.
// ============================================================

import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSongs } from '../composables/useSongs.js'
import SongForm from '../components/SongForm.vue'

const route = useRoute()
const router = useRouter()
const { songs, updateSong, getSongById } = useSongs()

// The song to edit, straight from the shared song list.
const song = computed(() => getSongById(route.params.id))
const notFound = computed(() => !song.value)

const successMessage = ref('')

function handleSubmit(formData) {
  updateSong(song.value.id, formData)
  successMessage.value = `"${formData.title}" was updated and saved to localStorage.`

  setTimeout(() => {
    router.push({ name: 'library' })
  }, 1200)
}
</script>

<template>
  <section class="form-page">
    <div v-if="notFound" class="empty-state">
      <div class="empty-icon">♫</div>
      <h3>Song not found</h3>
      <p>This song may have been deleted.</p>
      <RouterLink class="add-button" :to="{ name: 'library' }">
        Back to Library
      </RouterLink>
    </div>

    <div v-else class="song-modal">
      <div class="modal-header">
        <div>
          <p class="eyebrow">UPDATE YOUR LIBRARY</p>
          <h2>Edit Song</h2>
        </div>
        <RouterLink
          class="modal-close"
          :to="{ name: 'library' }"
          aria-label="Close"
        >×</RouterLink>
      </div>

      <p class="modal-description">
        Editing “{{ song.title }}”. Leave the year blank if unknown.
      </p>

      <p v-if="successMessage" class="form-success">{{ successMessage }}</p>

      <SongForm
        :key="song.id"
        :editing="song"
        submit-label="Save Changes"
        @submit-song="handleSubmit"
        @cancel-form="router.push({ name: 'library' })"
      />
    </div>
  </section>
</template>

<style scoped>
.form-page {
  display: flex;
  justify-content: center;
  padding: 10px 0 36px;
}

.form-page .song-modal {
  width: min(100%, 560px);
}

.modal-close {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid #32445e;
  border-radius: 8px;
  background: #1e2b40;
  color: #d0dced;
  font-size: 22px;
  text-decoration: none;
}

.form-success {
  margin: 0 0 15px;
  padding: 11px 13px;
  border: 1px solid #2e6b46;
  border-radius: 9px;
  background: #12281c;
  color: #7ee2a8;
  font-size: 11px;
}
</style>
