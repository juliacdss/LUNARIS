<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const showModal = ref(false)
const randomMovie = ref(null)
const geminiMovies = ref([])
const isLoading = ref(true)

// PORTAL
const showPortalReveal = ref(false)
const geminiMessage = ref(null)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// gêneros de Gêmeos = comédia, mistério, crime, aventura leve
const geminiGenres = ['35', '9648', '80', '12']

// FILME ASTRAL ALEATÓRIO
const fetchRandomMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: geminiGenres.join(','),
      language: 'pt-BR',
      sort_by: 'vote_average.desc',
      page: Math.floor(Math.random() * 5) + 1
    }
  })
  const movies = response.data.results
  randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
}

// LISTA PADRÃO
const fetchGeminiMovies = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: geminiGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: 1
    }
  })
  geminiMovies.value = response.data.results.slice(0, 20)
}

// MENSAGENS GEMINIANAS (APENAS UMA LISTA — CORRIGIDO!)
const geminiMessagesList = [
  "Gêmeos, sua capacidade de adaptação faz de você alguém preparado para qualquer cenário.",
  "Sua curiosidade constante amplia sua compreensão sobre o mundo.",
  "Você se destaca pela inteligência ágil e pela habilidade de analisar diferentes perspectivas.",
  "Sua versatilidade permite transitar entre ideias com naturalidade e precisão.",
  "Seu interesse genuíno pelo conhecimento fortalece suas relações e escolhas.",
  "Sua comunicação clara e objetiva inspira troca, aprendizado e evolução."
]

const fetchGeminiVision = () => {
  geminiMessage.value =
    geminiMessagesList[Math.floor(Math.random() * geminiMessagesList.length)]
  showPortalReveal.value = true
}

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchGeminiMovies()])
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="sign-container gemini">
    <div v-if="!isLoading" class="sign-content">

      <div class="text-side">
        <h1>O universo escolheu um filme para você, Gêmeos ♊︎</h1>
        <p class="description">
          Curioso, versátil e impossível de prever — exatamente como você, Gêmeos.
          Aqui estão filmes inteligentes, leves, misteriosos e cheios de personalidade para acompanhar sua mente inquieta.
        </p>

        <!-- BOTÃO EXPLORAR FUNCIONANDO -->
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

    <div v-else class="loading"><p>Carregando sua confusão mental astral...</p></div>

    <!-- lista geminiana -->
    <div v-if="geminiMovies.length" class="gemini-library">
      <h2 class="library-title">Filmes para a mente inquieta de Gêmeos</h2>

      <div class="movie-list">
        <div
          v-for="movie in geminiMovies"
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

   <!-- PORTAL -->
   <div class="portal-wrapper">
      <div class="portal" @click="fetchGeminiVision"></div>
      <p class="portal-text">Clique no portal e receba uma visão geminiana</p>
    </div>

    <div v-if="showPortalReveal" class="portal-modal">
      <div class="portal-modal-content-gemini">

        <div v-if="geminiMessage" class="portal-message">
          <p>{{ geminiMessage }}</p>
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
  background: linear-gradient(180deg, #c0ba7b, #d4d67f, #f0e8ac);
  color: #5c5f2a;
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
  box-shadow: 0 0 25px rgba(240, 234, 150, 0.4);
  border: 1px solid rgba(99, 109, 59, 0.4);
}

h1 {
  font-size: 2.6rem;
  color: #616435;
  text-shadow: 0 0 12px rgba(225, 240, 150, 0.3);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ffffff;
}

.movie-title {
  margin-top: 1rem;
  color: #ffffff;
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
  color: #ffe8f6;
  text-align: center;
}

.taurus-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #8b8f50;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgb(227, 255, 210);
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
  background: rgba(236, 239, 100, 0.829);
  border: 1px solid rgba(233, 255, 70, 0.25);
  box-shadow: 0 0 15px rgba(229, 245, 91, 0.2);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(234, 247, 52, 0.4);
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
  color: #ffffff;
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

/*PORTAL ASTRAL GÊMEOS*/

.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle, #c8d8ff, #7aa8ff, #3b4bff); /* GEMEOS */
  box-shadow: 
    0 0 25px #7aa8ff,
    0 0 60px #3b6aff,
    0 0 90px #1f2aff;
  animation: portalPulseGemini 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
}

.portal:hover {
  box-shadow: 
    0 0 40px #a6c0ff,
    0 0 90px #5f84ff,
    0 0 120px #2f3aff;
  transform: scale(1.08);
}

.portal-text {
  font-family: "Poppins", sans-serif;
  margin-top: 1rem;
  color: #000000; /* texto azul clarinho astral */
  font-size: 1.1rem;
}

/* Portal Pulse Animation */
@keyframes portalPulseGemini {
  from {
    transform: scale(1);
    box-shadow: 
      0 0 25px #7aa8ff,
      0 0 60px #3b6aff;
  }
  to {
    transform: scale(1.06);
    box-shadow:
      0 0 40px #a6c0ff,
      0 0 90px #5f84ff;
  }
}

/*MODAL GEMEOS*/

.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 10, 40, 0.6); /* azul escuro astral */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.portal-modal-content-gemini {
  background: #eef4ff; /* fundo azul muito claro */
  border: 1px solid #6f9aff; /* borda azul */
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
  color: #1c2a66; /* azul profundo */
  line-height: 1.5;
}

/* Botão de fechar */
.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #6f9aff;
  color: #6f9aff;
  padding: .7rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s;
  font-weight: 600;
}

.close-portal:hover {
  background: #6f9aff;
  color: #eef4ff;
}

/* Fade animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

</style>