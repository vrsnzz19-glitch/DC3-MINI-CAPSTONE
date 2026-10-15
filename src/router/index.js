// ============================================================
// src/router/index.js  —  VUE ROUTER CONFIGURATION
// ============================================================
// Real routes replace the old hash-page switching in App.vue.
// history: import.meta.env.BASE_URL uses HTML5 history mode
// (clean URLs like /library instead of #Library).
// ============================================================

import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import GenresView from '../views/GenresView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import AddSongView from '../views/AddSongView.vue'
import EditSongView from '../views/EditSongView.vue'
import AboutView from '../views/AboutView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // scrollBehavior: always start pages at the top.
  scrollBehavior() {
    return { top: 0 }
  },

  routes: [
    // Home / landing page
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    // Music Library (list + search + genre filter)
    {
      path: '/library',
      name: 'library',
      component: LibraryView
    },

    // Browse by genre
    {
      path: '/genres',
      name: 'genres',
      component: GenresView
    },

    // Favorites
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView
    },

    // Add Song (form route)
    {
      path: '/add-song',
      name: 'add-song',
      component: AddSongView
    },

    // Edit Song — /edit-song/:id is a DYNAMIC ROUTE PARAMETER.
    // The child reads route.params.id to know which song to load.
    {
      path: '/edit-song/:id',
      name: 'edit-song',
      component: EditSongView
    },

    // About / Profile
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },

    // 404 catch-all — must be LAST so it only matches unknown paths.
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

export default router
