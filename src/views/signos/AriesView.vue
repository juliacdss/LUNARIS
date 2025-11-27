<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const showModal = ref(false)
const randomMovie = ref(null)
const ariesMovies = ref([])
const isLoading = ref(true)

// PORTAL
const showPortalReveal = ref(false)
const ariesMessage = ref(null)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// gêneros de Áries = ação, aventura, sci-fi, thriller
const ariesGenres = ['28', '12', '878', '53']

// FILME ASTRAL ALEATÓRIO
const fetchRandomMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: ariesGenres.join(','),
      language: 'pt-BR',
      sort_by: 'vote_average.desc',
      page: Math.floor(Math.random() * 5) + 1
    }
  })
  const movies = response.data.results
  randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
}

// LISTA PADRÃO
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

// PORTAL — Mensagens Arianas (atitude pura)
const ariesMessages = [
  "Vai com força, Áries — você foi feito para começar revoluções.",
  "Seu fogo abre caminhos que outros têm medo de trilhar.",
  "Coragem não te falta — só lembre de respirar antes de agir.",
  "Você não veio ao mundo para ser discreto.",
  "A vida te dá limites e você transforma em combustível.",
  "Confie no seu impulso — ele é mais sábio do que parece."
]

const fetchAriesVision = () => {
  ariesMessage.value =
    ariesMessages[Math.floor(Math.random() * ariesMessages.length)]
  showPortalReveal.value = true
}

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
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
</script>

<template>
  <div class="sign-container aries">
    <div v-if="!isLoading" class="sign-content">

      <div class="text-side">
        <h1>O universo escolheu um filme para você, Áries ♈︎</h1>
        <p class="description">
          Intenso, impulsivo e cheio de energia — assim como você, Áries.
          Aqui estão filmes explosivos, ousados e cheios de ação para combinar com o seu fogo.
        </p>

        <button @click="showModal = true" class="explore-btn">
          Explorar
        </button>
      </div>

      <div class="movie-side" v-if="randomMovie" @click="openMovie(randomMovie.id)">
        <h2>Filme do dia</h2>

        <img
          :src="`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`"
          :alt="randomMovie.title"
          class="movie-poster"
        />

        <p class="movie-title">{{ randomMovie.title }}</p>
      </div>
    </div>

    <div v-else class="loading"><p>Carregando o fogo astral...</p></div>

    <!-- lista ariana -->
    <div v-if="ariesMovies.length" class="aries-library">
      <h2 class="library-title">Filmes para o fogo indomável de Áries</h2>

      <div class="movie-list">
        <div
          v-for="movie in ariesMovies"
          :key="movie.id"
          class="movie-card"
          @click="openMovie(movie.id)"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
          <div class="movie-details">
            <p class="movie-title">{{ movie.title }}</p>
            <p class="movie-release-date">
              {{ movie.release_date ? new Date(movie.release_date).toLocaleDateString('pt-BR') : '' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- modal signos -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <h3>Escolha outro signo</h3>

        <div class="sign-buttons">
          <button
            v-for="s in signos"
            :key="s"
            class="sign-btn"
            @click="router.push({ path: `/${s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()}` })"
          >
            {{ s }}
          </button>
        </div>

        <button class="close-btn" @click="showModal = false">Fechar</button>
      </div>
    </div>

    <!-- PORTAL ÁRIANO -->
    <div class="portal-wrapper">
      <div class="portal" @click="fetchAriesVision"></div>
      <p class="portal-text">Clique no portal e receba uma visão ariana</p>
    </div>

    <div v-if="showPortalReveal" class="portal-modal">
      <div class="portal-modal-content-aries">

        <div v-if="ariesMessage" class="portal-message">
          <p>{{ ariesMessage }}</p>
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
  background: radial-gradient(circle at bottom, #4c0014 0%, #180008 70%);
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
  box-shadow: 0 0 40px rgba(255, 150, 150, 0.55); /* glow rosado mais forte */
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
.modal-overlay {
  animation: fadeOverlay 0.3s ease forwards;
}

@keyframes fadeOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
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
  font-family: "Poppins", sans-serif;
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

/*PORTAL ASTRAL ÁRIES*/

.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle, #ffb347, #ff5e00, #b30000);
  box-shadow: 
    0 0 25px #ff5e00,
    0 0 60px #ff2d00,
    0 0 90px #b30000;
  animation: portalPulseAries 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
}

.portal:hover {
  box-shadow: 
    0 0 40px #ff7a1a,
    0 0 90px #ff3d00,
    0 0 120px #b30000;
  transform: scale(1.08);
}

.portal-text {
  font-family: "Poppins", sans-serif;
  margin-top: 1rem;
  color: #ffd4d4;
  font-size: 1.1rem;
}

/* Portal Pulse Animation */
@keyframes portalPulseAries {
  from {
    transform: scale(1);
    box-shadow: 
      0 0 25px #ff5e00,
      0 0 60px #ff2d00;
  }
  to {
    transform: scale(1.06);
    box-shadow:
      0 0 40px #ff7a1a,
      0 0 90px #ff3d00;
  }
}
/*MODAL ÁRIES*/

.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(40, 0, 0, 0.7); /* fundo vermelho escuro astral */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.portal-modal-content-aries {
  background: #fff0f0;
  border: 1px solid #cc3a3a;
  border-radius: 22px;
  padding: 2rem;
  width: 85%;
  max-width: 420px;
  text-align: center;
  animation: fadeIn 0.4s ease;
}

.portal-message p {
  font-size: 1.25rem;
  margin: 1.5rem 0;
  color: #5a0000;
  line-height: 1.5;
}

/* Botão de fechar */
.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #cc3a3a;
  color: #cc3a3a;
  padding: .7rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s;
  font-weight: 600;
}

.close-portal:hover {
  background: #cc3a3a;
  color: #fff0f0;
}

/* Fade animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
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
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  color: #ffeeb0;
  width: 90%;
  max-width: 450px;
}

.sign-buttons {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .7rem;
}

.sign-btn {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #ffeeb0;
  border-radius: 12px;
  padding: .5rem .7rem;
  cursor: pointer;
  transition: 0.2s;
}

.sign-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: scale(1.05);
}

.close-btn {
  margin-top: 1.2rem;
  background: none;
  border: 1px solid #ffeeb0;
  color: #ffeeb0;
  padding: .6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.close-btn:hover {
  background: #ffeeb0;
  color: #1a0328;
}
</style>
