<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const showModal = ref(false)
const showPortalReveal = ref(false)

const randomMovie = ref(null)
const ariesMovies = ref([])
const secretMovie = ref(null)

const isLoading = ref(true)

// gêneros vibe ariana
const ariesGenres = ['28', '12', '878', '53']

// filme secreto do portal (mistura louca kkk)
const portalGenres = ['27','80','18','9648','53']

const fetchRandomMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: ariesGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: Math.floor(Math.random() * 5) + 1
    }
  })
  const movies = response.data.results
  randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
}

const fetchAriesMovies = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: ariesGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: 1
    }
  })
  ariesMovies.value = response.data.results.slice(0, 20)
}

const fetchSecretMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: portalGenres.join(','),
      language: 'pt-BR',
      sort_by: 'vote_average.desc',
      page: 1
    }
  })
  const movies = response.data.results
  secretMovie.value = movies[Math.floor(Math.random() * movies.length)]
  showPortalReveal.value = true
}

const openMovie = (id) => {
  router.push({ name: 'MovieDetails', params: { movieId: id } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchAriesMovies()])
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

const carouselTrack = ref(null)

const scrollCarousel = (amount) => {
  carouselTrack.value.scrollLeft += amount
}

</script>

<template>
  <div class="sign-container">

    <!-- topo da página -->
    <div v-if="!isLoading" class="sign-content">
      <div class="text-side">
        <h1>O universo escolheu um filme pra você, Áries ♈︎</h1>
        <p class="description">Descubra o que os astros prepararam com base no seu signo.</p>
        <button @click="showModal = true" class="explore-btn">Explorar</button>
      </div>

      <div class="movie-side" v-if="randomMovie" @click="openMovie(randomMovie.id)">
        <h2>Filme do dia</h2>
        <img
          :src="`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`"
          class="movie-poster"
        />
        <p class="movie-title">{{ randomMovie.title }}</p>
      </div>
    </div>

    <!-- LOADING -->
    <div v-else class="loading"><p>Carregando o filme do universo...</p></div>

    <!-- CARROSSEL -->
    <h2 class="carousel-title">Filmes que combinam com energia ariana</h2>
    <div class="carousel">
      <button class="arrow left" @click="scrollCarousel(-350)">‹</button>

      <div class="carousel-track" ref="carouselTrack">
        <div
          v-for="movie in ariesMovies"
          :key="movie.id"
          class="carousel-item"
          @click="openMovie(movie.id)"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" />
        </div>
      </div>

      <button class="arrow right" @click="scrollCarousel(350)">›</button>
    </div>

    <!-- GRID COM OS 20 FILMES -->
    <div class="aries-library">
      <h2 class="library-title">Biblioteca Ariana</h2>

      <div class="movie-grid">
        <div
          v-for="movie in ariesMovies"
          :key="movie.id"
          class="grid-card"
          @click="openMovie(movie.id)"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" />
          <p class="movie-title">{{ movie.title }}</p>
          <p class="movie-release-date">
            {{ new Date(movie.release_date).toLocaleDateString('pt-BR') }}
          </p>
        </div>
      </div>
    </div>

    <!-- PORTAL NO FINAL DA PÁGINA -->
    <div class="portal-wrapper">
      <div class="portal" @click="fetchSecretMovie"></div>
      <p class="portal-text">Clique no portal e receba uma visão</p>
    </div>

    <!-- MODAL DO PORTAL -->
    <div v-if="showPortalReveal" class="portal-modal">
      <div class="portal-modal-content">
        <h2>Visão do Portal</h2>

        <div v-if="secretMovie" class="portal-movie">
          <img :src="`https://image.tmdb.org/t/p/w500${secretMovie.poster_path}`" />
          <h3>{{ secretMovie.title }}</h3>
          <p>{{ new Date(secretMovie.release_date).toLocaleDateString('pt-BR') }}</p>
        </div>

        <button class="close-portal" @click="showPortalReveal = false">Fechar</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@600&family=Poppins:wght@400;600&display=swap');

.sign-container {
  min-height: 100vh;
  background: radial-gradient(circle at bottom, #2a032f 0%, #1c022c 70%);
  color: #f5d78a;
  font-family: "Poppins", sans-serif;
  padding: 3rem;
}

.sign-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  margin-bottom: 4rem;
}

.text-side {
  flex: 1;
  max-width: 500px;
}

.movie-side {
  flex: 1;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.movie-side:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 300px;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(255, 80, 80, 0.4);
}

h1 {
  font-size: 2.6rem;
  color: #ffeeb0;
  text-shadow: 0 0 10px rgba(255, 80, 80, 0.5);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #fada8a;
}

.movie-title {
  margin-top: 1rem;
  font-weight: 600;
  color: #ffb284;
}

.explore-btn {
  background-color: #ff4e4e;
  color: #fff4c2;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.explore-btn:hover {
  background-color: #ff7a7a;
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 100, 100, 0.7);
}

.loading {
  color: #ffeeb0;
  font-size: 1.2rem;
  text-align: center;
}

.aries-library {
  margin-top: 4rem;
}
.library-title {
  text-align: center;
  font-size: 2rem;
  color: #ffeeb0;
  margin-bottom: 2rem;
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.movie-card {
  width: 180px;
  border-radius: 10px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 10px rgba(255, 80, 80, 0.3);
  cursor: pointer;
  transition: transform 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
}
.movie-card img {
  width: 100%;
  height: 270px;
  object-fit: cover;
}
.movie-details {
  padding: 0.5rem;
  text-align: center;
}
.movie-release-date {
  font-size: 0.9rem;
  color: #f5d78a;
}

/* modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(28, 2, 44, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-box {
  background-color: rgba(28, 2, 44, 0.95);
  border: 2px solid #f5d78a;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  text-align: center;
  color: #f5d78a;
  max-width: 500px;
  animation: fadeIn 0.3s ease-in-out;
}

.sign-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
.sign-btn {
  background: #ff4e4e;
  border: none;
  border-radius: 20px;
  color: #fff4c2;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: 0.3s;
}
.sign-btn:hover {
  background: #ff7a7a;
  transform: scale(1.05);
}
.close-btn {
  margin-top: 2rem;
  background: none;
  border: 1px solid #f5d78a;
  color: #f5d78a;
  border-radius: 20px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  transition: 0.3s;
}
.close-btn:hover {
  background-color: #f5d78a;
  color: #1a0328;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* PORTAL ASTRAL */
.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle, #ff8a47, #ff3c00, #9b0000);
  box-shadow: 0 0 25px #ff4500, 0 0 60px #ff3200;
  animation: portalPulse 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
}

.portal:hover {
  box-shadow: 0 0 40px #ff7e00, 0 0 90px #ff4500;
  transform: scale(1.05);
}

.portal-text {
  margin-top: 1rem;
  color: #ffb284;
  font-size: 1.1rem;
}

/* MODAL DO PORTAL */
.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 0, 20, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.portal-modal-content {
  background: #2a032f;
  border: 2px solid #ffb284;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  animation: fadeIn 0.4s ease;
}

.portal-movie img {
  width: 200px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(255, 80, 80, 0.5);
}

.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #ffb284;
  color: #ffb284;
  padding: .7rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
}

@keyframes portalPulse {
  from { transform: scale(0.95); }
  to { transform: scale(1.05); }
}

/* CARROSSEL */
.carousel-title {
  text-align: center;
  font-size: 2rem;
  margin-top: 4rem;
  color: #ffeeb0;
}

.carousel {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 2rem;
}

.arrow {
  background: rgba(255, 80, 80, 0.4);
  border: none;
  color: #ffeeb0;
  font-size: 2.5rem;
  width: 50px;
  height: 120px;
  cursor: pointer;
  transition: 0.2s;
}

.arrow:hover {
  background: rgba(255, 80, 80, 0.7);
}

.carousel-track {
  overflow-x: auto;
  display: flex;
  gap: 1rem;
  scroll-behavior: smooth;
  padding: 1rem;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-item img {
  height: 220px;
  width: 150px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.carousel-item img:hover {
  transform: scale(1.07);
}

/* GRID DE 20 FILMES */
.movie-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.grid-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding-bottom: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
  text-align: center;
  box-shadow: 0 0 15px rgba(255, 80, 80, 0.3);
}

.grid-card:hover {
  transform: scale(1.05);
}

.grid-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}
</style>
