<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const showModal = ref(false)
const randomMovie = ref(null)
const sagittariusMovies = ref([])
const isLoading = ref(true)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// 🔥 Gêneros de Sagitário — aventura, fantasia, ação
const sagGenres = ['12', '14', '28']

// 🎬 Filme do dia
const fetchRandomMovie = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: sagGenres.join(','),
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

// 🎞️ Lista Sagitário
const fetchSagittariusMovies = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: sagGenres.join(','),
        language: 'pt-BR',
        sort_by: 'popularity.desc',
        page: 1
      }
    })
    sagittariusMovies.value = (response.data.results || []).slice(0, 20)
  } catch (e) {
    console.error('fetchSagittariusMovies error', e)
  }
}

const openMovie = movieId => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchSagittariusMovies()])
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

// 🔮 Portal Sagitário — lógica
const showPortalReveal = ref(false)
const sagMessage = ref(null)

const sagMessages = [
  "O universo está te chamando para ir além do limite.",
  "Coragem é sua bússola. O resto, você improvisa.",
  "Permita-se sonhar tão alto quanto sua seta alcança.",
  "Você nasceu para viver histórias épicas, não para se prender.",
  "Sua liberdade é sagrada — proteja ela com paixão.",
  "A aventura te escolhe quando você escolhe acreditar."
]

const fetchSagVision = () => {
  sagMessage.value = sagMessages[Math.floor(Math.random() * sagMessages.length)]
  showPortalReveal.value = true
}
</script>

<template>
  <div class="sign-container">
    
    <div v-if="!isLoading" class="sign-content">
      
      <div class="text-side">
        <h1>O universo escolheu um filme para você, Sagitário ♐︎</h1>
        <p class="description">
          Livre, intensa e cheia de fogo — assim é Sagitário.  
          Aqui estão filmes que combinam com sua aventura, coragem e a paixão de viver sem limites.
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

    <!-- Lista Sagitário -->
    <div v-if="sagittariusMovies.length" class="virgo-library">
      <h2 class="library-title">Filmes para a alma aventureira de Sagitário</h2>

      <div class="movie-list">
        <div
          v-for="movie in sagittariusMovies"
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

    <!-- Modal Signos -->
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

    <!-- PORTAL SAGITÁRIO -->
    <div class="portal-wrapper">
      <div class="portal" @click="fetchSagVision"></div>
      <p class="portal-text">Clique no portal e receba uma visão sagitariana</p>
    </div>

    <!-- MODAL PORTAL SAGITÁRIO -->
    <div v-if="showPortalReveal" class="portal-modal">
      <div class="portal-modal-content-sag">

        <div v-if="sagMessage" class="portal-message">
          <p>{{ sagMessage }}</p>
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
  background: linear-gradient(180deg, #2e1b10 0%, #462a1a 50%, #5c1f1f 100%);
  color: #ffe9e2;
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
  box-shadow: 0 0 25px rgba(255, 120, 80, 0.6);
  border: 1px solid rgba(255, 200, 180, 0.4);
}

h1 {
  font-size: 2.6rem;
  color: #ffd4c4;
  text-shadow: 0 0 10px rgba(255, 147, 104, 0.5);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ffe6d9;
}

.movie-title {
  margin-top: 1rem;
  color: #ffd9d0;
  font-weight: 600;
}

.explore-btn {
  background: linear-gradient(135deg, #ff6b3b, #d93a49);
  color: #fff3f0;
  font-weight: 600;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 20px rgba(255, 100, 80, 0.3);
  font-family: "Poppins", sans-serif;
}
.explore-btn:hover {
  background:#ff8e7e;
  transform: scale(1.07);
  box-shadow: 0 0 25px rgba(255, 90, 110, 0.7);
}

.loading {
  text-align: center;
  color: #ffece8;
  font-size: 1.2rem;
}

/* LISTA */
.virgo-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #ffded5;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgba(255, 120, 110, 0.4);
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
  background: rgba(255, 220, 210, 0.08);
  border: 1px solid rgba(255, 160, 120, 0.3);
  box-shadow: 0 0 15px rgba(255, 100, 80, 0.3);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 120, 100, 0.6);
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
  color: #ffe7e3;
  font-size: 0.85rem;
}

/* MODAL — IGUAL AO SEU */
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
  background: rgba(255, 200, 180, 0.1);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255, 200, 180, 0.4);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  color: #ffe9e0;
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
  background: rgba(255, 240, 235, 0.12);
  border: 1px solid rgba(255, 200, 180, 0.4);
  color: #fff2ee;
  border-radius: 12px;
  padding: .5rem .7rem;
  cursor: pointer;
  transition: 0.2s;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
}

.sign-btn:hover {
  background: rgba(255, 240, 235, 0.22);
  transform: scale(1.05);
}

.close-btn {
  margin-top: 1.2rem;
  background: none;
  border: 1px solid #ffe4db;
  color: #ffe4db;
  padding: .6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}
.close-btn:hover {
  background: #ffe4db;
  color: #1a1a1a;
}

/* 🔥 PORTAL SAGITÁRIO */
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
    #ffb3a6,
    #ff6e57,
    #d63a46,
    #ff2aa3
  );
  
  box-shadow:
    0 0 25px #ffad91,
    0 0 60px #ff5f4d,
    0 0 90px rgba(255, 42, 163, 0.6);

  animation: portalPulse 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid #ffd0c6;
}

.portal:hover {
  transform: scale(1.07);
  box-shadow:
    0 0 40px #ffc6bd,
    0 0 90px #ff7863,
    0 0 120px rgba(255, 42, 163, 0.9);
}

.portal-text {
  margin-top: 1rem;
  color: #ffeae7;
  font-size: 1.1rem;
}

/* MODAL SAGITÁRIO */
.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(60, 20, 10, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.portal-modal-content-sag {
  background: #fff4f2;
  border: 1px solid #ff8a7a;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  animation: fadeIn 0.4s ease;
}

.portal-message p {
  font-size: 1.2rem;
  margin: 1.5rem 0;
  color: #7a2c22;
}

.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #ff8a7a;
  color: #ff8a7a;
  padding: .7rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.close-portal:hover {
  background: #ff8a7a;
  color: #fff4f2;
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
