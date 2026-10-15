<script setup>
// ============================================================
// src/components/SongForm.vue  —  CHILD COMPONENT (FORM HANDLING)
// ============================================================
// Demonstrates LAB TOPIC: Form Handling + Emitting Events.
//  - v-model reactive form fields (title, artist, album, genre,
//    release year)
//  - per-field validation with clear error messages
//  - @submit.prevent for proper form submission handling
//  - emits `submit-song` (with the form data) and `cancel-form`
//    back to the parent; the parent calls useSongs() to add or
//    update the song, so the state lives ONLY in the parent.
//
// Used by both AddSongView and EditSongView (reused component).
// ============================================================

import { ref, computed, watch } from 'vue'
import { useSongs } from '../composables/useSongs.js'

// Separate localStorage key for UNSAVED form drafts (the song list
// itself uses `spotibai_songs` in useSongs.js).
const DRAFT_KEY = 'spotibai_song_draft'

const props = defineProps({
  // Pass the song being edited (or null for "add" mode).
  editing: {
    type: Object,
    default: null
  },
  submitLabel: {
    type: String,
    default: 'Add Song'
  }
})

// Events emitted to the parent.
const emit = defineEmits(['submit-song', 'cancel-form'])

// Genre options come from the shared song state (composable) —
// no duplicated copy of the genre list in this child.
const { genreOptions } = useSongs()

// Reactive form state.
//
// DRAFT PERSISTENCE: before overwriting with defaults, check for a
// saved draft in localStorage. The draft stores which song it
// belongs to (`draftEditingId`), so an EDIT draft is only restored
// when the form is opened for the SAME song. Add-mode drafts are
// stored with editingId = null.
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw === null) return null

    const draft = JSON.parse(raw)

    // Valid shape check: must be an object with a form object.
    if (!draft || typeof draft !== 'object' || typeof draft.form !== 'object') {
      return null
    }

    // An edit draft belongs to one song — only restore it when
    // this form instance is editing that same song.
    if (draft.editingId != null && draft.editingId !== props.editing?.id) {
      return null
    }

    // Merge so missing fields fall back to sensible defaults.
    return {
      title: draft.form.title ?? props.editing?.title ?? '',
      artist: draft.form.artist ?? props.editing?.artist ?? '',
      album: draft.form.album ?? props.editing?.album ?? '',
      genre: draft.form.genre ?? props.editing?.genre ?? 'BisRock',
      year: draft.form.year ?? props.editing?.year ?? ''
    }
  } catch {
    // Missing key or corrupted JSON -> just use the defaults.
    return null
  }
}

const savedDraft = loadDraft()

const form = ref({
  title: savedDraft?.title ?? props.editing?.title ?? '',
  artist: savedDraft?.artist ?? props.editing?.artist ?? '',
  album: savedDraft?.album ?? props.editing?.album ?? '',
  genre: savedDraft?.genre ?? props.editing?.genre ?? 'BisRock',
  year: savedDraft?.year ?? props.editing?.year ?? ''
})

// Save the draft to localStorage on EVERY keystroke (deep watch
// over the reactive form ref). This is what makes Ctrl+R safe.
watch(
  form,
  value => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          editingId: props.editing?.id ?? null, // null = add-song draft
          form: { ...value }
        })
      )
    } catch {
      /* storage full/unavailable — form still works, just not saved */
    }
  },
  { deep: true }
)

// Clear the draft ONLY after a successful submit or explicit cancel.
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

// Validation errors, keyed by field — each renders under its input.
const errors = ref({})
const submitted = ref(false)

// Extra dropdown entry when editing a song with a rare genre.
const genreList = computed(() => {
  const options = [...genreOptions.value]
  if (form.value.genre && !options.includes(form.value.genre)) {
    options.push(form.value.genre)
  }
  return options.sort()
})

// -------- Validation helpers --------
function validateField(field) {
  const value = String(form.value[field] ?? '').trim()

  switch (field) {
    case 'title':
      if (!value) return 'Song title is required.'
      if (value.length < 2) return 'Song title must be at least 2 characters.'
      return ''
    case 'artist':
      if (!value) return 'Artist name is required.'
      return ''
    case 'year':
      // Year is optional, but must be a sane number when given.
      if (!value) return ''
      const year = Number(value)
      if (!Number.isInteger(year)) return 'Release year must be a whole number.'
      if (year < 1900 || year > 2100) return 'Release year must be between 1900 and 2100.'
      return ''
    default:
      return ''
  }
}

function validateAll() {
  const next = {}
  for (const field of ['title', 'artist', 'year']) {
    const message = validateField(field)
    if (message) next[field] = message
  }
  errors.value = next
  return Object.keys(next).length === 0
}

// Clear a field's error as soon as the user fixes it.
function clearError(field) {
  if (errors.value[field]) {
    const { [field]: removed, ...rest } = errors.value
    errors.value = rest
  }
}

// -------- Form submission --------
function handleSubmit() {
  submitted.value = true

  if (!validateAll()) return

  // Success -> the draft has served its purpose.
  clearDraft()

  // Emit the CLEANED form data up to the parent. The parent
  // decides whether to create or update a song.
  emit('submit-song', {
    title: form.value.title.trim(),
    artist: form.value.artist.trim(),
    album: form.value.album.trim(),
    genre: form.value.genre,
    year: form.value.year
  })
}
</script>

<template>
  <form class="song-form" novalidate @submit.prevent="handleSubmit">
    <label :class="{ invalid: errors.title }">
      Song Title <span>*</span>
      <input
        v-model="form.title"
        type="text"
        placeholder="Enter song title"
        @input="clearError('title')"
      />
      <small v-if="errors.title" class="field-error">{{ errors.title }}</small>
    </label>

    <label :class="{ invalid: errors.artist }">
      Artist <span>*</span>
      <input
        v-model="form.artist"
        type="text"
        placeholder="Enter artist name"
        @input="clearError('artist')"
      />
      <small v-if="errors.artist" class="field-error">{{ errors.artist }}</small>
    </label>

    <label>
      Album
      <input
        v-model="form.album"
        type="text"
        placeholder="Enter album name (optional)"
      />
    </label>

    <div class="form-row">
      <label>
        Genre
        <select v-model="form.genre">
          <option v-for="genre in genreList" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>
      </label>

      <label :class="{ invalid: errors.year }">
        Release Year
        <input
          v-model="form.year"
          type="number"
          min="1900"
          max="2100"
          placeholder="Optional"
          @input="clearError('year')"
        />
        <small v-if="errors.year" class="field-error">{{ errors.year }}</small>
      </label>
    </div>

    <p v-if="submitted && Object.keys(errors).length" class="form-error">
      Please fix the highlighted fields before saving.
    </p>

    <div class="modal-actions">
      <button type="button" class="cancel-button" @click="clearDraft(); emit('cancel-form')">
        Cancel
      </button>

      <button type="submit" class="add-button">
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<style scoped>
/* Small additions only — reuses global modal/label styles. */
.song-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.song-form label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #d0dced;
  font-size: 11px;
  font-weight: 600;
}

.song-form label span {
  color: #f28ab4;
}

.song-form input,
.song-form select {
  width: 100%;
  min-height: 41px;
  padding: 10px 12px;
  border: 1px solid #32445e;
  border-radius: 8px;
  outline: none;
  background: #121a29;
  color: #edf4ff;
  font-size: 12px;
}

.song-form input:focus,
.song-form select:focus {
  border-color: #3b82f6;
}

.song-form input::placeholder {
  color: #71819a;
}

.song-form label.invalid input {
  border-color: #e35d86;
}

.field-error {
  color: #ff8eae;
  font-size: 10px;
  font-weight: 500;
}
</style>
