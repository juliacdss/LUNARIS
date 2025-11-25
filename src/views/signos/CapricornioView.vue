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

.explore-btn {
  background: linear-gradient(135deg, #3a3a3d, #575759);
  color: #e8e8e8;
  border: 1px solid #6f6f73;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.explore-btn:hover {
  background: #6b6b6f;
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(180, 180, 180, 0.4);
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

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 10, 10, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-box {
  background: #1a1a1d;
  border: 2px solid #7c7c7c;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  text-align: center;
  color: #dcdcdc;
  animation: fadeIn 0.3s ease-in-out;
}

.sign-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.sign-btn {
  background: #444449;
  color: #e5e5e5;
  border: 1px solid #777;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.sign-btn:hover {
  background: #6b6b6f;
  transform: scale(1.05);
}

.close-btn {
  margin-top: 2rem;
  background: none;
  border: 1px solid #9b9b9b;
  color: #dcdcdc;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}
.close-btn:hover {
  background: #dcdcdc;
  color: #1a1a1d;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
