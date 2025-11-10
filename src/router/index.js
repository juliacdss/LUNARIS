import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/filmes',
    name: 'Movies',
    component: () => import('../views/MoviesView.vue'),
  },
  {
    path: '/tv',
    name: 'TV',
    component: () => import('../views/TvView.vue'),
  },
  {
    path: '/movie/:movieId',
    name: 'MovieDetails',
    component: () => import('../views/MovieDetailsView.vue'),
    props: true,
  },
  {
    path: '/tv/:tvId',
    name: 'TvDetails',
    component: () => import('../views/TvDetailsView.vue'),
    props: true,
  },

  // === ROTAS DOS SIGNOS ===
  {
    path: '/aries',
    name: 'Aries',
    component: () => import('../views/signos/AriesView.vue'),
  },
  {
    path: '/touro',
    name: 'Touro',
    component: () => import('../views/signos/TouroView.vue'),
  },
  {
    path: '/gemeos',
    name: 'Gemeos',
    component: () => import('../views/signos/GemeosView.vue'),
  },
  {
    path: '/cancer',
    name: 'Cancer',
    component: () => import('../views/signos/CancerView.vue'),
  },
  {
    path: '/leao',
    name: 'Leao',
    component: () => import('../views/signos/LeaoView.vue'),
  },
  {
    path: '/virgem',
    name: 'Virgem',
    component: () => import('../views/signos/VirgemView.vue'),
  },
  {
    path: '/libra',
    name: 'Libra',
    component: () => import('../views/signos/LibraView.vue'),
  },
  {
    path: '/escorpiao',
    name: 'Escorpiao',
    component: () => import('../views/signos/EscorpiaoView.vue'),
  },
  {
    path: '/sagitario',
    name: 'Sagitario',
    component: () => import('../views/signos/SagitarioView.vue'),
  },
  {
    path: '/capricornio',
    name: 'Capricornio',
    component: () => import('../views/signos/CapricornioView.vue'),
  },
  {
    path: '/aquario',
    name: 'Aquario',
    component: () => import('../views/signos/AquarioView.vue'),
  },
  {
    path: '/peixes',
    name: 'Peixes',
    component: () => import('../views/signos/PeixesView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
