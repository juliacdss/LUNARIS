<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const randomMovie = ref(null)
const scorpioMovies = ref([])
const isLoading = ref(true)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// 🖤 Gêneros intensos do signo de Escorpião
const scorpioGenres = ['27', '53', '80', '9648']
// terror, suspense, crime, mistério

// 🎬 Buscar filme aleatório
const fetchRandomMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: scorpioGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: Math.floor(Math.random() * 5) + 1
    }
  })
  const movies = response.data.results
  randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
}

// 🎞️ Buscar lista de filmes vibe escorpiana
const fetchScorpioMovies = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: scorpioGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: 1
    }
  })
  scorpioMovies.value = response.data.results.slice(0, 20)
}

// 🔗 Redirecionar p/ detalhes
const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchScorpioMovies()])
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

// PORTAL
const showPortalReveal = ref(false)
const ariesMessage = ref(null)
const ariesMessages = [
  "Escorpião, hoje sua intuição enxerga o que os olhos não veem. Confie nela.",

"O dia traz profundidade: mergulhe sem medo no que você sente.",

"Transformação silenciosa acontece dentro de você — respeite esse processo.",

"Sua força está na intensidade, não diminua seu próprio poder.",

"Hoje, um ciclo pode se renovar se você liberar o que já não faz sentido.",

"O universo te convida a ouvir o que seu coração sussurra quando tudo está quieto.",

"Escorpião, sua sensibilidade é uma bússola — siga o que vibra verdadeiro.",

"O dia pede coragem emocional: seja honesta com o que realmente deseja.",

"Hoje você atrai o que é profundo, sincero e significativo.",

"A energia do dia favorece decisões firmes — confie no seu instinto."
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
        <h1>O universo escolheu um filme para você, Escorpião ♏︎</h1>
        <p class="description">Prepare-se para mergulhar em mistérios profundos, intensos e cheios de emoção.</p>
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

    <div v-else class="loading"><p>Carregando as energias do universo...</p></div>

    <!-- Lista de filmes escorpianos -->
    <div v-if="scorpioMovies.length" class="scorpio-library">
      <h2 class="library-title">Filmes com a energia intensa de Escorpião</h2>
      <div class="movie-list">
        <div v-for="movie in scorpioMovies" :key="movie.id" class="movie-card" @click="openMovie(movie.id)">
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
          />
          <div class="movie-details">
            <p class="movie-title">{{ movie.title }}</p>
            <p class="movie-release-date">
              {{ new Date(movie.release_date).toLocaleDateString('pt-BR') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
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
      <p class="portal-text">Clique no portal e receba uma visão escorpiana</p>
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

/* 🖤 TEMA ESCORPIÃO — PRETO PROFUNDO E INTENSO */
.sign-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #000000, #050505, #0a0a0a);
  color: #e2e2e2;
  font-family: "Poppins", sans-serif;
  padding: 3rem;
}

/* CENTRALIZA A SEÇÃO PRINCIPAL */
.sign-content {
  display: flex;
  align-items: center;
  justify-content: center; /* <-- AQUI centraliza */
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
  transition: 0.3s;
}
.movie-side:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 300px;
  border-radius: 20px;
  box-shadow: 0 0 25px rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(150, 0, 0, 0.25);
}

h1 {
  font-size: 2.6rem;
  color: #f1f1f1;
  text-shadow: 0 0 12px rgba(255, 0, 0, 0.25);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #c8c8c8;
}

.movie-title {
  margin-top: 1rem;
  color: #ffdddd;
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
  background: rgba(255, 255, 255, 0.15); /* mais "gelado" */
  transform: scale(1.07);
  box-shadow: 0 0 40px rgba(155, 150, 255, 0.55); /* glow rosado mais forte */
}
.loading {
  color: #dddddd;
  font-size: 1.2rem;
  text-align: center;
}

/* LISTA ESCORPIÃO */
.scorpio-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #f0f0f0;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgba(255, 0, 0, 0.25);
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
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 0, 0, 0.15);
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.15);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
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
  color: #cfcfcf;
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
  z-index: 999 !important;
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

/*PORTAL ASTRAL (versão vinho e vermelho escuro)*/

.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle, #7a0026, #4d0018, #2b000d); /* vinho → vermelho escuro */
  box-shadow: 
    0 0 25px #7a0026,
    0 0 60px #4d0018,
    0 0 90px #2b000d;
  animation: portalPulseAries 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
}

.portal:hover {
  box-shadow: 
    0 0 40px #99002f,
    0 0 90px #66001f,
    0 0 120px #330010;
  transform: scale(1.08);
}

.portal-text {
  font-family: "Poppins", sans-serif;
  margin-top: 1rem;
  color: #ffdddd; 
  font-size: 1.1rem;
}

/* Portal Pulse Animation */
@keyframes portalPulseAries {
  from {
    transform: scale(1);
    box-shadow: 
      0 0 25px #7a0026,
      0 0 60px #4d0018;
  }
  to {
    transform: scale(1.06);
    box-shadow:
      0 0 40px #99002f,
      0 0 90px #66001f;
  }
}

/*MODAL (vinho + vermelho escuro)*/

.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 0, 0, 0.7); /* fundo vinho escuro */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.portal-modal-content-aries {
  background: #fff5f7; 
  border: 1px solid #7a0026; 
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
  color: #3d000d;
  line-height: 1.5;
}

/* Botão de fechar */
.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #7a0026;
  color: #7a0026;
  padding: .7rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s;
  font-weight: 600;
}

.close-portal:hover {
  background: #7a0026;
  color: #fff5f7;
}

/* Fade animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

</style>
