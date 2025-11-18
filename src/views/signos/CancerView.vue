<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const showModal = ref(false)
const randomMovie = ref(null)
const cancerMovies = ref([])
const isLoading = ref(true)

const secretMovie = ref(null)
const showPortalReveal = ref(false)

const carouselTrack = ref(null)
const scrollCarousel = (amount) => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({ left: amount, behavior: "smooth" })
  }
}

// Signos
const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// Gêneros vibe Cancers: romance + drama + fantasia + família
const cancerGenres = ['10749', '18', '14', '10751']

// FILME DO DIA
const fetchRandomMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: cancerGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: Math.floor(Math.random() * 5) + 1
    }
  })
  const movies = response.data.results
  const validMovies = movies.filter(m => m.poster_path)
randomMovie.value = validMovies[Math.floor(Math.random() * validMovies.length)]
}

// LISTA
const fetchCancerMovies = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: cancerGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: 1
    }
  })
  cancerMovies.value = response.data.results.slice(0, 20)
}

// PORTAL
const fetchSecretMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: cancerGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: Math.floor(Math.random() * 4) + 1
    }
  })

  const movies = response.data.results
  secretMovie.value = movies[Math.floor(Math.random() * movies.length)]
  showPortalReveal.value = true
}

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchCancerMovies()])
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="sign-container">

    <!-- topo -->
    <div v-if="!isLoading" class="sign-content">
      <div class="text-side">
        <h1>O universo escolheu um filme pra você, Câncer ♋︎</h1>
        <p class="description">
          Descubra o que os astros prepararam com base no seu signo.
        </p>

        <button @click="showModal = true" class="explore-btn">Explorar</button>

        <!-- modal signos -->
        <div v-if="showModal" class="modal-overlay">
          <div class="modal-box">
            <h3>Escolha outro signo</h3>

            <div class="sign-buttons">
              <button
                v-for="s in signos"
                :key="s"
                class="sign-btn"
                @click="
                  router.push({
                    path: '/' + s.normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .toLowerCase()
                  });
                  showModal = false;
                "
              >
                {{ s }}
              </button>
            </div>

            <button class="close-btn" @click="showModal = false">Fechar</button>
          </div>
        </div>
      </div>

      <div class="movie-side" v-if="randomMovie" @click="openMovie(randomMovie.id)">
        <h2>Filme do dia</h2>
        <img :src="`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`" class="movie-poster" />
        <p class="movie-title">{{ randomMovie.title }}</p>
      </div>
    </div>

    <div v-else class="loading"><p>Carregando o filme do universo...</p></div>

    <!-- carrossel -->
    <h2 class="carousel-title">Filmes com vibe canceriana</h2>
    <div class="carousel">
      <button class="arrow left" @click="scrollCarousel(-350)">‹</button>

      <div class="carousel-track" ref="carouselTrack">
        <div
          v-for="movie in cancerMovies"
          :key="movie.id"
          class="carousel-item"
          @click="openMovie(movie.id)"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" />
        </div>
      </div>

      <button class="arrow right" @click="scrollCarousel(350)">›</button>
    </div>

    <!-- grid -->
    <div class="cancer-library">
      <h2 class="library-title">Biblioteca Canceriana</h2>

      <div class="movie-grid">
        <div
          v-for="movie in cancerMovies"
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

    <!-- portal lunar -->
    <div class="portal-wrapper">
      <div class="portal" @click="fetchSecretMovie"></div>
      <p class="portal-text">Toque no portal e receba uma mensagem da lua</p>
    </div>

    <!-- modal portal -->
    <div v-if="showPortalReveal" class="portal-modal">
      <div class="portal-modal-content">
        <h2>Mensagem da Lua</h2>

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
  color: #fff;
  padding: 3rem;
    font-family: "Poppins", sans-serif;
}

/* CONTEÚDO PRINCIPAL */
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
  transition: transform 0.3s;
}
.movie-side:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 300px;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(255, 200, 230, 0.5);
}

h1 {
  font-size: 2.6rem;
  color: #ffe8f6;
  text-shadow: 0 0 10px rgba(255, 200, 230, 0.7);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #f7dde8;
}

.movie-title {
  margin-top: 1rem;
  font-weight: 600;
  color: #fff1fa;
}

/* BOTÃO GLASS */
.explore-btn {
  background: rgba(255, 255, 255, 0.08); /* mais transparente */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  
  color: #fff4c2;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  border: 1.5px solid rgba(255, 255, 255, 0.45); /* borda mais forte de vidro */
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.25); /* glow de vidro */
}

.explore-btn:hover {
  background: rgba(255, 255, 255, 0.15); /* mais “gelado” */
  transform: scale(1.07);
  box-shadow: 0 0 40px rgba(155, 150, 255, 0.55); /* glow rosado mais forte */
}

.loading {
  color: #ffe8f6;
  text-align: center;
}

/* LISTA */
.cancer-library {
  margin-top: 4rem;
}
.library-title {
  text-align: center;
  font-size: 2rem;
  color: #ffe8f6;
  margin-bottom: 2rem;
}

/* MODAL SIGNOS */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  color: #ffdcec;
  width: 90%;
  max-width: 450px;
    /* EFEITO SUAVE */
  opacity: 0;
  transform: scale(0.85);
  animation: modalOpen 0.35s ease forwards;
}

.sign-buttons {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .7rem;
}

.sign-btn {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #ffdcec;
  border-radius: 12px;
  padding: .5rem .7rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
    font-family: "Poppins", sans-serif;
}
.sign-btn:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: scale(1.05);
}

.close-btn {
  margin-top: 1.2rem;
  background: none;
  border: 1px solid #ffdcec;
  color: #ffdcec;
  padding: .6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
}

.close-btn:hover {
  background: #ffdcec;
  color: #2c1f27;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
/* PORTAL LUNAR */
.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle, #ffe6f2, #ffc8dd, #b5b5b5);
  box-shadow: 0 0 25px #ffc8dd, 0 0 60px #ffffff;
  animation: portalPulse 2s infinite alternate ease-in-out;
  cursor: pointer;
}
.portal:hover {
  transform: scale(1.05);
  box-shadow: 0 0 40px #ffe4f1, 0 0 90px #ffffff;
}

.portal-text {
  margin-top: 1rem;
  color: #ffe6f2;
  font-size: 1.1rem;
}

/* MODAL PORTAL */
.portal-modal {
  position: fixed;
  inset: 0;
  background: rgba(10, 0, 20, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.portal-modal-content {
  background: #3b3240;
  border: 2px solid #ffdcec;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  animation: fadeIn 0.4s ease;
}

.portal-movie img {
  width: 200px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(255, 220, 236, 0.6);
}

.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #ffdcec;
  color: #ffdcec;
  padding: .7rem 1.5rem;
  border-radius: 10px;
}

/* CARROSSEL */
.carousel-title {
  text-align: center;
  font-size: 2rem;
  margin-top: 4rem;
  color: #ffe8f6;
}

.carousel {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 2rem;
}

.arrow {
  background: rgba(255, 230, 245, 0.3);
  border: none;
  color: #ffe6f2;
  font-size: 2.5rem;
  width: 50px;
  height: 120px;
  cursor: pointer;
  transition: 0.2s;
}
.arrow:hover {
  background: rgba(255, 230, 245, 0.6);
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

/* GRID */
.movie-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.grid-card {
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 15px;
  padding-bottom: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
  text-align: center;
  box-shadow: 0 0 15px rgba(255, 200, 230, 0.25);
}

.grid-card:hover {
  transform: scale(1.05);
}

.grid-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

@keyframes portalPulse {
  from { transform: scale(0.95); }
  to { transform: scale(1.05); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes modalOpen {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>