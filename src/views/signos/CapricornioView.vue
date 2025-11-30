<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const randomMovie = ref(null)
const capricornMovies = ref([])
const isLoading = ref(true)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// 🎬 Gêneros sérios e ambiciosos para Capricórnio
const capricornGenres = ['18', '80', '53', '36']
// drama, crime, suspense, história/biografia

// 🎬 Buscar filme aleatório
const fetchRandomMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: capricornGenres.join(','),
      language: 'pt-BR',
      sort_by: 'vote_average.desc',
      page: Math.floor(Math.random() * 5) + 1
    }
  })
  const movies = response.data.results
  randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
}

// 🎞️ Buscar lista de filmes vibração Capricórnio
const fetchCapricornMovies = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: capricornGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: 1
    }
  })
  capricornMovies.value = response.data.results.slice(0, 20)
}

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchCapricornMovies()])
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
  "Capricórnio, hoje o universo te lembra: a montanha é alta, mas você nasceu sabendo escalar.",

"Seu foco é sua magia. Tudo que você decidir construir hoje, o tempo respeita.",

"Nem todo peso é fardo — às vezes é só responsabilidade moldando seu brilho.",

"A disciplina que você tem vale mais do que qualquer sorte que falte.",

"Hoje você não precisa correr, só continuar. Capricórnio vence na constância.",

"Seu silêncio é poderoso. Use ele pra ouvir o que sua ambição está te pedindo.",

"O universo vê o seu esforço, mesmo quando ninguém comenta. Segue firme.",

"Capricórnio, lembre-se: até o topo da montanha precisa de descanso no caminho.",

"Hoje é dia de alinhar metas, cortar excessos e agir com precisão cirúrgica.",

"Você é prova viva de que maturidade não envelhece — só fortalece."
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
        <h1>Um filme sóbrio para você, Capricórnio ♑︎</h1>
        <p class="description">Determinação, profundidade e histórias marcantes — perfeitas para sua energia.</p>
        <button @click="showModal = true" class="explore-btn">Explorar</button>
      </div>

      <div class="movie-side" v-if="randomMovie" @click="openMovie(randomMovie.id)">
        <h2>Filme do Dia</h2>
        <img
          :src="`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`"
          :alt="randomMovie.title"
          class="movie-poster"
        />
        <p class="movie-title">{{ randomMovie.title }}</p>
      </div>
    </div>

    <div v-else class="loading"><p>A constelação está escolhendo seu filme...</p></div>

    <!-- Lista Capricórnio -->
    <div v-if="capricornMovies.length" class="capricorn-library">
      <h2 class="library-title">Filmes recomendados para Capricórnio</h2>
      <div class="movie-list">
        <div v-for="movie in capricornMovies" :key="movie.id" class="movie-card" @click="openMovie(movie.id)">
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

    <!-- Modal de Signos -->
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
      <p class="portal-text">Clique no portal e receba uma visão capricorniana</p>
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

/* 🌑 Tema Capricórnio: Cinza grafite + preto + prata */
.sign-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0e0e0f, #1a1a1d, #2a2a2e);
  color: #dcdcdc;
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

h1 {
  font-size: 2.6rem;
  color: #e5e5e5;
  text-shadow: 0 0 12px rgba(150, 150, 150, 0.5);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #bfbfbf;
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
  box-shadow: 0 0 25px rgba(200, 200, 200, 0.25);
  border: 1px solid rgba(150, 150, 150, 0.3);
}

.movie-title {
  margin-top: 1rem;
  color: #e0e0e0;
  font-weight: 600;
}

.loading {
  color: #dcdcdc;
  font-size: 1.2rem;
  text-align: center;
}

/* 📚 Lista Capricórnio */
.capricorn-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #e0e0e0;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgba(160, 160, 160, 0.4);
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(180, 180, 180, 0.15);
  box-shadow: 0 0 15px rgba(140, 140, 140, 0.25);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(180, 180, 180, 0.35);
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
  color: #c4c4c4;
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

.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle, #5a4e3c, #3b352c, #1a1a1a); /* bege-terra → marrom escuro → preto */
  box-shadow: 
    0 0 25px #3b352c,
    0 0 60px #2a2a2a,
    0 0 90px #1a1a1a;
  animation: portalPulseEarth 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
}

.portal:hover {
  box-shadow: 
    0 0 40px #6b5f4a,     /* marrom quente */
    0 0 90px #3f3a33,
    0 0 120px #1a1a1a;
  transform: scale(1.08);
}

.portal-text {
  font-family: "Poppins", sans-serif;
  margin-top: 1rem;
  color: #d8d5c5; /* bege acinzentado */
  font-size: 1.1rem;
}

/* Portal Pulse Animation */
@keyframes portalPulseEarth {
  from {
    transform: scale(1);
    box-shadow: 
      0 0 25px #3b352c,
      0 0 60px #2a2a2a;
  }
  to {
    transform: scale(1.06);
    box-shadow:
      0 0 40px #6b5f4a,
      0 0 90px #3f3a33;
  }
}

.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 15, 15, 0.65); /* preto-fumê */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.portal-modal-content-aries {
  background: #2f2b26; /* marrom-terroso escuro */
  border: 1px solid #4a453f; /* marrom acinzentado */
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
  color: #e2dfd4; /* bege claro elegante */
  line-height: 1.5;
}

/* Botão de fechar */
.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #4a453f;
  color: #e2dfd4;
  padding: .7rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s;
  font-weight: 600;
}

.close-portal:hover {
  background: #4a453f; /* marrom acinzentado */
  color: #f0ede5;      /* bege quase off-white */
}

/* Fade animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

</style>
