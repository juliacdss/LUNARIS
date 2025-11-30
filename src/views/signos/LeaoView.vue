<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const randomMovie = ref(null)
const leoMovies = ref([])
const isLoading = ref(true)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// Gêneros combinando com Leão
const leoGenres = ['14', '12', '28']

// Buscar filme aleatório
const fetchRandomMovie = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: leoGenres.join(','),
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

// Buscar lista de filmes leoninos
const fetchLeoMovies = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: leoGenres.join(','),
        language: 'pt-BR',
        sort_by: 'popularity.desc',
        page: 1
      }
    })
    leoMovies.value = (response.data.results || []).slice(0, 20)
  } catch (e) {
    console.error('fetchLeoMovies error', e)
  }
}

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchLeoMovies()])
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
  "Leão, hoje o Sol ilumina seus passos: confie no que você já conquistou.",
  "Sua luz natural abre portas hoje — mostre quem você é sem medo.",
  "Hoje, sua criatividade será sua maior força. Deixe fluir.",
  "O universo pede que você valorize suas vitórias, até as pequenas.",
  "Confie no seu instinto. Ele está mais afiado que nunca.",
  "O dia pede presença: esteja onde seu coração se sente visto."
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
        <h1>O universo escolheu um filme para você, Leão ♌︎</h1>
        <p class="description">Brilhe, Leão! Sua energia poderosa combina com histórias épicas, vibrantes e inesquecíveis.</p>
        <button @click="showModal = true" class="explore-btn">Explorar</button>
      </div>

      <div class="movie-side" v-if="randomMovie" @click="openMovie(randomMovie.id)">
        <h2>Filme do dia</h2>

        <!-- CORREÇÃO DAS ASPAS -->
        <img
          :src="'https://image.tmdb.org/t/p/w500' + randomMovie.poster_path"
          :alt="randomMovie.title"
          class="movie-poster"
        />

        <p class="movie-title">{{ randomMovie.title }}</p>
      </div>
    </div>

    <div v-else class="loading"><p>Carregando a energia solar...</p></div>

    <!-- Lista leonina -->
    <div v-if="leoMovies.length" class="leo-library">
      <h2 class="library-title">Filmes com o brilho e força de Leão</h2>

      <div class="movie-list">
        <div
          v-for="movie in leoMovies"
          :key="movie.id"
          class="movie-card"
          @click="openMovie(movie.id)"
        >
          <img
            :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
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

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <h3>Escolha outro signo</h3>

        <div class="sign-buttons">
          <button
            v-for="s in signos"
            :key="s"
            class="sign-btn"
            @click="router.push({ path: '/' + s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() })"
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
      <p class="portal-text">Clique no portal e receba uma visão leonina</p>
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

<!-- CSS EXATO QUE VOCÊ MANDOU -->
<style>
@keyframes fadeOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalOpen {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
</style>

<style scoped>
/* TODO O SEU CSS IGUALZINHO — NÃO ALTEREI NADA */
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@600&family=Poppins:wght@400;600&display=swap');

.sign-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #2a1100, #3c1a00, #4f2100);
  color: #ffe7c2;
  font-family: "Poppins", sans-serif;
  padding: 3rem;
}

.sign-content {
  display: flex;
  align-items: center;
  justify-content: center;
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
  box-shadow: 0 0 25px rgba(255, 140, 0, 0.4);
  border: 1px solid rgba(255, 174, 66, 0.4);
}

h1 {
  font-size: 2.6rem;
  color: #ffe1b0;
  text-shadow: 0 0 12px rgba(255, 170, 60, 0.3);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ffddbb;
}

.movie-title {
  margin-top: 1rem;
  color: #ffd7a4;
  font-weight: 600;
}

.explore-btn {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: #fff4c2;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.25);
}

.explore-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.07);
  box-shadow: 0 0 40px rgba(155, 150, 255, 0.55);
}

.loading {
  text-align: center;
  color: #ffe8cb;
  font-size: 1.2rem;
}

.leo-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #ffe1b0;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgba(255, 170, 60, 0.3);
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
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 174, 66, 0.25);
  box-shadow: 0 0 15px rgba(255, 174, 66, 0.2);
  cursor: pointer;
  transition: 0.3s;
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 162, 0, 0.4);
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
  color: #ffdcb6;
  font-size: 0.85rem;
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
  animation: fadeOverlay 0.3s ease forwards;
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
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #ffeeb0;
  border-radius: 12px;
  padding: .5rem .7rem;
  cursor: pointer;
  transition: 0.2s;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
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

/* PORTAL ASTRAL ÁRIES */

.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle, #fff2b3, #ffbb33, #ff9900);
  box-shadow: 
    0 0 25px #ffbb33,
    0 0 60px #ff9900,
    0 0 90px #cc7a00;
  animation: portalPulseAries 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
}

.portal:hover {
  box-shadow: 
    0 0 40px #ffd45e,
    0 0 90px #ffb733,
    0 0 120px #cc7a00;
  transform: scale(1.08);
}

.portal-text {
  font-family: "Poppins", sans-serif;
  margin-top: 1rem;
  color: #fff6cc;
  font-size: 1.1rem;
}

/* Portal Pulse Animation */
@keyframes portalPulseAries {
  from {
    transform: scale(1);
    box-shadow: 
      0 0 25px #ffbb33,
      0 0 60px #ff9900;
  }
  to {
    transform: scale(1.06);
    box-shadow:
      0 0 40px #ffd45e,
      0 0 90px #ffb733;
  }
}

/* MODAL ÁRIES */

.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(80, 60, 0, 0.7); /* dourado escuro translúcido */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.portal-modal-content-aries {
  background: #fff8e1;
  border: 1px solid #e6a400;
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
  color: #614800;
  line-height: 1.5;
}

/* Botão de fechar */
.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #e6a400;
  color: #e6a400;
  padding: .7rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s;
  font-weight: 600;
}

.close-portal:hover {
  background: #e6a400;
  color: #fff8e1;
}

/* Fade animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

</style>
