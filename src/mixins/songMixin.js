// ============================================================
// src/mixins/songMixin.js  —  OPTIONS API MIXIN (demonstration)
// ============================================================
// MIXIN (old Options API way): reusable logic is merged into a
// component's options (data, methods, computed). Pros: simple.
// Cons: implicit — the component "magically" gains `formatYear`,
// hidden name collisions, hard to trace where a property comes
// from, and cannot share reactive STATE between components.
//
// COMPOSABLE (modern Composition API way — see
// src/composables/useSongs.js): an explicit function you call,
// fully traceable imports, and refs can be shared as a singleton
// so multiple components see the SAME state.
//
// This mixin is kept only to demonstrate the difference for the
// laboratory requirement; it is used by OptionsApiDemo.vue.
// ============================================================

export default {
  data() {
    return {
      // Note the "mixin" prefix to avoid name collisions — this
      // is one of the classic mixin problems the composable solves.
      mixinCallCount: 0
    }
  },

  computed: {
    mixinLabel() {
      return `Mixin logic active (${this.mixinCallCount} calls)`
    }
  },

  methods: {
    // Shared helper: formats a song year for display.
    formatYear(year) {
      this.mixinCallCount++
      return year ? `Released ${year}` : 'Year unknown'
    }
  },

  // Mixins can also have lifecycle hooks, merged with the
  // component's own hooks (mixin hook runs first).
  created() {
    console.log('[songMixin] created — mixin lifecycle hook ran')
  }
}
