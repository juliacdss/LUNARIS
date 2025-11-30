<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const randomMovie = ref(null)
const taurusMovies = ref([])
const isLoading = ref(true)
// PORTAL
const showPortalReveal = ref(false)
const ariesMessage = ref(null)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

const taurusGenres = ['10749', '18', '10402']

const fetchRandomMovie = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: taurusGenres.join(','),
        language: 'pt-BR',
        sort_by: 'popularity.desc',
        page: Math.floor(Math.random() * 5) + 1
      }
    })
    const movies = response.data.results || []
    if (movies.length) randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
  } catch (e) {
    console.error('fetchRandomMovie error', e)
  }
}

const fetchTaurusMovies = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: taurusGenres.join(','),
        language: 'pt-BR',
        sort_by: 'popularity.desc',
        page: 1
      }
    })
    taurusMovies.value = (response.data.results || []).slice(0, 20)
  } catch (e) {
    console.error('fetchTaurusMovies error', e)
  }
}

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchTaurusMovies()])
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

const ariesMessages = [
   "Touro representa estabilidade emocional, força interior e determinação constante.",
  "A energia taurina valoriza segurança, conforto e tudo aquilo que traz sensação de permanência.",
  "Touro é guiado pela paciência, pela calma e pela busca por ambientes tranquilos.",
  "O signo expressa afeto por meio de gestos concretos, consistência e presença.",
  "A personalidade taurina é marcada por persistência e firmeza diante dos desafios.",
  "Touro ensina a importância de construir com calma, sem pressa, mas com direção.",
  "A energia desse signo busca beleza, harmonia e prazer nas pequenas coisas do cotidiano.",
  "Taurinos têm forte conexão com o corpo, os sentidos e o mundo material.",
  "A estabilidade é o centro da força de Touro: tudo o que faz, faz com base sólida.",
  "Touro mostra que paciência e constância podem transformar qualquer plano em realidade."
]

const fetchAriesVision = () => {
  ariesMessage.value =
    ariesMessages[Math.floor(Math.random() * ariesMessages.length)]
  showPortalReveal.value = true
}
</script>

<template>
  <div class="sign-container">
    <div v-if="!isLoading" class="sign-content">
      <div class="text-side">
        <h1>O universo escolheu um filme para você, Touro ♉︎</h1>
        <p class="description">Paciente e sensível, Touro! Sua energia combina com histórias românticas, emocionantes e cheias de sentimento.</p>
        <button @click="showModal = true" class="explore-btn">Explorar</button>
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

    <div v-else class="loading"><p>Carregando a energia taurina...</p></div>

    <!-- Lista taurina -->
    <div v-if="taurusMovies.length" class="taurus-library">
      <h2 class="library-title">Filmes com a suavidade de Touro</h2>
      <div class="movie-list">
        <div
          v-for="movie in taurusMovies"
          :key="movie.id"
          class="movie-card"
          @click="openMovie(movie.id)"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
          />
          <div class="movie-details">
            <p class="movie-title">{{ movie.title }}</p>
            <p class="movie-release-date">
              {{ movie.release_date ? new Date(movie.release_date).toLocaleDateString('pt-BR') : '' }}
            </p>
          </div>
        </div>
      </div>
    </div>

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

    <!-- PORTAL -->
   <div class="portal-wrapper">
      <div class="portal" @click="fetchAriesVision"></div>
      <p class="portal-text">Clique no portal e receba uma visão taurina</p>
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
  background: linear-gradient(180deg, #8d7bc0, #947fd6, #b8acf0);
  color: #3b2a5f;
  font-family: "Poppins", sans-serif;
  padding: 3rem;
  justify-content: center;
}

.sign-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 4rem;
  margin-left: 15rem;
}

.text-side {
  flex: 1;
  max-width: 500px;
}

.movie-side {
  flex: 1;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
}
.movie-side:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 300px;
  border-radius: 20px;
  box-shadow: 0 0 25px rgba(180, 150, 240, 0.4);
  border: 1px solid rgba(72, 59, 109, 0.4);
}

h1 {
  font-size: 2.6rem;
  color: #3e3564;
  text-shadow: 0 0 12px rgba(180, 150, 240, 0.3);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #473d70;
}

.movie-title {
  margin-top: 1rem;
  color: #bab1df;
  font-weight: 600;
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
  text-align: center;
  color: #3b2a5f;
  font-size: 1.2rem;
}

.taurus-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #5e508f;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgba(180, 150, 240, 0.3);
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.movie-card {
  width: 180px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(111, 69, 150, 0.829);
  border: 1px solid rgba(180, 150, 240, 0.25);
  box-shadow: 0 0 15px rgba(180, 150, 240, 0.2);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(160, 130, 240, 0.4);
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
  color: #a8a3b9;
  font-size: 0.85rem;
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
 z-index: 9999 !important; /* GARANTE QUE FIQUE POR CIMA */
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
  animation: modalOpen 0.35s ease forwards;
  will-change: opacity, transform;
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

/* PORTAL ASTRAL GÊMEOS */

.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

/* portal geminiano: rosa → verde → turquesa */
.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle, #ffb3e6, #ff66c4, #40e0d0);
  box-shadow: 
    0 0 25px #ff66c4,
    0 0 60px #40e0d0,
    0 0 90px #00b894;
  animation: portalPulseGemini 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
}

.portal:hover {
  box-shadow: 
    0 0 40px #ff99dd,
    0 0 90px #5ef2dc,
    0 0 120px #00d1a0;
  transform: scale(1.08);
}

.portal-text {
  font-family: "Poppins", sans-serif;
  margin-top: 1rem;
  color: #eaffef;
  font-size: 1.1rem;
}

/* Portal Pulse Animation — rosa + verde */
@keyframes portalPulseGemini {
  from {
    transform: scale(1);
    box-shadow: 
      0 0 25px #ff66c4,
      0 0 60px #40e0d0;
  }
  to {
    transform: scale(1.06);
    box-shadow:
      0 0 40px #ff99dd,
      0 0 90px #5ef2dc;
  }
}

/* MODAL GÊMEOS */

.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(180, 255, 230, 0.35); /* verde menta translúcido */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.portal-modal-content-aries {
  background: #fff6fb; /* rosa muuuito claro */
  border: 1px solid #8de4c7; /* verde menta */
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
  color: #006f52; /* verde escuro */
  line-height: 1.5;
}

/* Botão de fechar — rosa e verde */
.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #8de4c7;
  color: #009768;
  padding: .7rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s;
  font-weight: 600;
}

.close-portal:hover {
  background: #8de4c7;
  color: #004c36;
}

/* Fade animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.sign-container {
  position: relative; /* ADICIONA ISSO */
  z-index: 1;
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