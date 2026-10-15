<script setup>
// ============================================================
// src/views/AddSongView.vue — ADD SONG FORM (route page)
// ============================================================
// Parent in the parent-child flow:
//   <SongForm> child emits `submit-song` → this parent handles
//   it by calling the useSongs() composable (shared state) and
//   navigating back to the Library.
// ============================================================

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSongs } from '../composables/useSongs.js'
import SongForm from '../components/SongForm.vue'

const router = useRouter()
const { addSong, songs } = useSongs()

// Success feedback shown after saving.
const successMessage = ref('')
const savedTitle = ref('')

function handleSubmit(formData) {
  addSong(formData)
  savedTitle.value = formData.title
  successMessage.value = `"${formData.title}" was added to your library and saved to localStorage.`

  // Navigate back to the library after a short pause so the
  // success message is visible.
  setTimeout(() => {
    router.push({ name: 'library' })
  }, 1200)
}

function handleCancel() {
  router.push({ name: 'library' })
}
</script>

<template>
  <section class="form-page">
    <div class="song-modal">
      <div class="modal-header">
        <div>
          <p class="eyebrow">GROW YOUR COLLECTION</p>
          <h2>Add a Song</h2>
        </div>
        <RouterLink
          class="modal-close"
          :to="{ name: 'library' }"
          aria-label="Close"
        >×</RouterLink>
      </div>

      <p class="modal-description">
        Enter the song details below. Fields marked with * are required.
        Your library is saved in this browser's localStorage.
      </p>

      <p v-if="successMessage" class="form-success">{{ successMessage }}</p>

      <SongForm
        :key="`add-${songs.length}`"
        submit-label="Add Song"
        @submit-song="handleSubmit"
        @cancel-form="handleCancel"
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
