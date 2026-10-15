<script>
// ============================================================
// src/components/OptionsApiDemo.vue — OPTIONS API (demonstration)
// ============================================================
// This component uses the OLD Options API on purpose so you can
// show your instructor BOTH styles side by side:
//
//   OPTIONS API (this file)          COMPOSITION API (<script setup>)
//   -------------------------        --------------------------------
//   export default { }               plain <script setup> block
//   data() { return {...} }          const count = ref(0)
//   computed: { double() {} }        const double = computed(...)
//   methods: { ... }                 plain functions
//   created()/mounted() hooks        onMounted(() => {...})
//   `this.count` everywhere          no `this`, direct variables
//
// It also uses songMixin.js to demonstrate a MIXIN: notice how
// `formatYear` and `mixinLabel` appear here WITHOUT being
// declared in this file — that's the implicit merge mixins do,
// which composables make explicit.
// ============================================================

import songMixin from '../mixins/songMixin.js'

export default {
  name: 'OptionsApiDemo',

  // Mixin options are MERGED into this component.
  mixins: [songMixin],

  // data() returns the reactive state object (accessed as this.xxx)
  data() {
    return {
      clickCount: 0,
      albums: [
        { name: 'BisRock Collection', songs: 9 },
        { name: 'Mga Sugboanon nga Demo', songs: 3 }
      ],
      newAlbumName: ''
    }
  },

  // computed properties recompute when their dependencies change
  computed: {
    totalAlbumSongs() {
      return this.albums.reduce((sum, album) => sum + album.songs, 0)
    },
    statusMessage() {
      return this.clickCount === 0
        ? 'Click the button to see Options API state change.'
        : `You clicked ${this.clickCount} time(s) with Options API.`
    }
  },

  // methods are functions on `this`
  methods: {
    increment() {
      this.clickCount++
    },
    addAlbum() {
      const name = this.newAlbumName.trim()
      if (!name) return
      this.albums.push({ name, songs: 0 })
      this.newAlbumName = ''
    }
  },

  // Lifecycle hooks: created runs before mounted, mixin hooks
  // run first (see the console).
  created() {
    console.log('[OptionsApiDemo] created() — component options hook ran')
  },
  mounted() {
    console.log('[OptionsApiDemo] mounted() — DOM is ready')
  },

  template: `
    <section class="options-demo">
      <div class="section-heading">
        <div>
          <h2>Options API &amp; Mixin Demo</h2>
          <p>
            This page uses the Options API (data / computed / methods /
            lifecycle hooks) plus a mixin, while the rest of Spotibai uses
            the Composition API — both build the same reactive app.
          </p>
        </div>
      </div>

      <div class="demo-grid">
        <div class="demo-card">
          <span class="eyebrow">DATA + METHODS</span>
          <p class="demo-text">{{ statusMessage }}</p>
          <button class="add-button" @click="increment">Click me</button>
        </div>

        <div class="demo-card">
          <span class="eyebrow">COMPUTED</span>
          <p class="demo-text">
            Total songs across albums (computed): <strong>{{ totalAlbumSongs }}</strong>
          </p>
          <ul class="demo-list">
            <li v-for="album in albums" :key="album.name">
              {{ album.name }} — {{ album.songs }} songs
            </li>
          </ul>
          <div class="demo-row">
            <input v-model="newAlbumName" placeholder="New album name" @keyup.enter="addAlbum" />
            <button class="outline-button" @click="addAlbum">Add</button>
          </div>
        </div>

        <div class="demo-card">
          <span class="eyebrow">MIXIN</span>
          <p class="demo-text">{{ mixinLabel }}</p>
          <p class="demo-text">
            formatYear('2025') from the mixin → <strong>{{ formatYear('2025') }}</strong>
          </p>
          <p class="demo-note">
            The mixin injects data/computed/methods invisibly — a composable
            like useSongs() instead gives you the same powers through an
            explicit, traceable function call.
          </p>
        </div>
      </div>
    </section>
  `
}
</script>

<style scoped>
.options-demo {
  margin-bottom: 36px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.demo-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  border: 1px solid #26344b;
  border-radius: 13px;
  background: #121a29;
}

.demo-text {
  margin: 0;
  color: #b4c3da;
  font-size: 12px;
  line-height: 1.7;
}

.demo-text strong {
  color: #60a5fa;
}

.demo-list {
  margin: 0;
  padding-left: 18px;
  color: #93a2b8;
  font-size: 11px;
  line-height: 1.9;
}

.demo-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.demo-row input {
  flex: 1;
  min-width: 0;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid #32445e;
  border-radius: 8px;
  background: #121a29;
  color: #edf4ff;
  font-size: 12px;
}

.demo-row .outline-button {
  margin-top: 0;
}

.demo-note {
  margin: 0;
  color: #7f8da4;
  font-size: 10px;
  line-height: 1.7;
}
</style>
