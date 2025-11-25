<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const showModal = ref(false)
const randomMovie = ref(null)
const virgoMovies = ref([])
const isLoading = ref(true)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// 🎀 Gêneros combinando com Virgem (drama, mistério, biografia)
const virgoGenres = ['18', '9648', '36']

// 🎬 Filme do dia
const fetchRandomMovie = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: virgoGenres.join(','),
        language: 'pt-BR',
        sort_by: 'vote_average.desc',
        page: Math.floor(Math.random() * 5) + 1
      }
    })
    const movies = response.data.results || []
    if (movies.length) {
      randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
    }
  } catch (e) {
    console.error('fetchRandomMovie error', e)
  }
}

// 🎞️ Lista Virgem
const fetchVirgoMovies = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: virgoGenres.join(','),
        language: 'pt-BR',
        sort_by: 'popularity.desc',
        page: 1
      }
    })
    virgoMovies.value = (response.data.results || []).slice(0, 20)
  } catch (e) {
    console.error('fetchVirgoMovies error', e)
  }
}

const openMovie = movieId => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchVirgoMovies()])
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

// PORTAL VIRGEM — lógica
const showPortalReveal = ref(false)
const virginMessage = ref(null)

const virginMessages = [
  "Organize seus pensamentos — a resposta está no detalhe.",
  "A perfeição não está no controle, mas no cuidado.",
  "Respire fundo. A clareza vem quando você desacelera.",
  "Seu coração é inteligente. Confie nele também.",
  "Você não precisa salvar o mundo hoje. Só arrumar sua mente.",
  "Você merece descanso tanto quanto merece sucesso."
]

const fetchVirginVision = () => {
  // escolhe uma mensagem aleatória
  virginMessage.value = virginMessages[Math.floor(Math.random() * virginMessages.length)]
  showPortalReveal.value = true
}
</script>

<template>
  <div class="sign-container">
    <div v-if="!isLoading" class="sign-content">
      
      <div class="text-side">
        <h1>O universo escolheu um filme para você, Virgem ♍︎</h1>
        <p class="description">
          Organizado, analítico e impecável — assim como você, Virgem.  
          Aqui estão filmes selecionados com precisão, profundidade e muito bom gosto.
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

    <div v-else class="loading"><p>Carregando o filme do universo...</p></div>

    <!-- Lista Virgem -->
    <div v-if="virgoMovies.length" class="virgo-library">
      <h2 class="library-title">Filmes para o olhar analítico de Virgem</h2>

      <div class="movie-list">
        <div
          v-for="movie in virgoMovies"
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
    <!-- portal virgem -->
<div class="portal-wrapper">
  <div class="portal" @click="fetchVirginVision"></div>
  <p class="portal-text">Clique no portal e receba uma visão virginiana</p>
</div>

<!-- modal portal virgem -->
<div v-if="showPortalReveal" class="portal-modal">
  <div class="portal-modal-content-virgo">
    <h2>Visão de Virgem ♍︎</h2>

    <div v-if="virginMessage" class="portal-message">
      <p>{{ virginMessage }}</p>
    </div>

    <button class="close-portal" @click="showPortalReveal = false">Fechar</button>
  </div>
</div>
  </div>
</template>

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
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@600&family=Poppins:wght@400;600&display=swap');

.sign-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #1e2e1f 0%, #2f3f2f 50%, #3b2f24 100%);
  color: #e7f2dd;
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
  box-shadow: 0 0 25px rgba(110, 160, 110, 0.5);
  border: 1px solid rgba(200, 220, 200, 0.4);
}

h1 {
  font-size: 2.6rem;
  color: #d9ffe0;
  text-shadow: 0 0 10px rgba(170, 255, 180, 0.4);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #e4f7d8;
}

.movie-title {
  margin-top: 1rem;
  color: #d8ffd7;
  font-weight: 600;
}

.explore-btn {
  background: linear-gradient(135deg, #335c3b, #4f7a4f);
  color: #f4ffe7;
  font-weight: 600;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 20px rgba(160, 200, 160, 0.25);
  font-family: "Poppins", sans-serif;
}
.explore-btn:hover {
  background:#6ecf7a;
  transform: scale(1.07);
  box-shadow: 0 0 25px rgba(150, 255, 160, 0.5);
}

.loading {
  text-align: center;
  color: #e8f7e0;
  font-size: 1.2rem;
}

/* Lista */
.virgo-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #daffd9;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgba(160, 200, 160, 0.4);
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(160, 200, 160, 0.3);
  box-shadow: 0 0 15px rgba(160, 200, 160, 0.3);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(110, 180, 110, 0.5);
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
  color: #e7f6df;
  font-size: 0.85rem;
}

/* MODAL — MANTIVE IGUAL AO SEU PADRÃO */
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
  color: #f3ffe0;
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
  color: #f3ffe0;
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
  border: 1px solid #f3ffe0;
  color: #f3ffe0;
  padding: .6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}
.close-btn:hover {
  background: #f3ffe0;
  color: #1a1a1a;
}
/* PORTAL ASTRAL VIRGINIANO */
.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    #f1f7e5,  /* luz suave */
    #b7c9a3,  /* verde oliva claro */
    #5e704a   /* verde musgo profundo */
  );
  
  box-shadow:
    0 0 25px #d9e8c8,
    0 0 60px #b7c9a3,
    0 0 90px rgba(140, 170, 120, 0.6);

  animation: portalPulse 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid #dfe7d2;
}

.portal:hover {
  transform: scale(1.07);
  box-shadow:
    0 0 40px #f1f7e5,
    0 0 90px #cfe1b8,
    0 0 120px rgba(175, 200, 150, 0.8);
}

.portal-text {
  margin-top: 1rem;
  color: #f5faec;
  font-size: 1.1rem;
}

/* MODAL VIRGEM */
.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 25, 15, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.portal-modal-content-virgo {
  background: #f3efe4;
  border: 1px solid #8c7c55;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  animation: fadeIn 0.4s ease;
}

.portal-message p {
  font-size: 1.2rem;
  margin: 1.5rem 0;
  color: #4f4c3b;
}

.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #8c7c55;
  color: #8c7c55;
  padding: .7rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.close-portal:hover {
  background: #8c7c55;
  color: #f3efe4;
}

@keyframes portalPulse {
  from { transform: scale(0.95); }
  to { transform: scale(1.07); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
