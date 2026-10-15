<script setup>
// ============================================================
// src/components/SongCard.vue  —  CHILD COMPONENT
// ============================================================
// PARENT -> CHILD communication: receives the song object via
// the `song` PROP (data flows DOWN).
// CHILD -> PARENT communication: sends user actions back UP
// with defineEmits() events (play, edit, delete, toggle-favorite).
// The card never changes the song itself — the parent (which
// owns the state via useSongs) does that.
// ============================================================

// Define the events this child can emit to its parent.
const emit = defineEmits(['play-song', 'edit-song', 'delete-song', 'toggle-favorite'])

// Define the props received from the parent.
defineProps({
  song: {
    type: Object,
    required: true
  }
})

// These handlers just re-emit the action upward — the parent
// decides what actually happens (state stays in the parent).
</script>

<template>
  <article
    class="song-card"
    :class="{ 'display-only': song.displayOnly }"
    @click="$emit('play-song', song)"
  >
    <div class="cover-wrap">
      <img
        v-if="song.cover"
        :src="song.cover"
        :alt="song.title"
        class="song-cover"
      />

      <div v-else class="music-note-cover">
        <span class="cover-note">♫</span>
        <small>SPOTIBAI</small>
      </div>

      <button
        class="favorite-button"
        :class="{ favorited: song.favorite }"
        @click.stop="$emit('toggle-favorite', song)"
        :aria-label="song.favorite ? 'Remove from favorites' : 'Add to favorites'"
        :title="song.favorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        {{ song.favorite ? '♥' : '♡' }}
      </button>

      <button
        v-if="!song.displayOnly"
        class="cover-play"
        @click.stop="$emit('play-song', song)"
        :aria-label="'Play ' + song.title"
        title="Play song"
      >▶</button>
    </div>

    <div class="song-info">
      <div class="song-title-row">
        <h3 :title="song.title">{{ song.title }}</h3>
      </div>

      <p class="song-artist">{{ song.artist }}</p>

      <div class="song-meta">
        <span>{{ song.genre }}</span>
        <span>{{ song.year || 'Year unknown' }}</span>
        <span v-if="song.displayOnly" class="display-badge">Display only</span>
      </div>

      <p class="song-album">{{ song.album || 'Unknown Album' }}</p>

      <div class="card-actions">
        <button
          class="play-button"
          @click.stop="$emit('play-song', song)"
          :disabled="song.displayOnly"
          :title="song.displayOnly ? 'Display-only sample; no audio available' : 'Play song'"
        >
          <template v-if="song.displayOnly">
            <span>◉</span> Display only
          </template>
          <template v-else>
            <span>▶</span> Play
          </template>
        </button>

        <button
          class="icon-action"
          @click.stop="$emit('edit-song', song)"
          title="Edit song"
        >✎</button>

        <button
          class="icon-action delete-action"
          @click.stop="$emit('delete-song', song)"
          title="Delete song"
        >⌫</button>
      </div>
    </div>
  </article>
</template>
