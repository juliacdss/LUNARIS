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

const sagittariusGenres = ['12', '14', '878']

const fetchRandomMovie = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: sagittariusGenres.join(','),
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

const fetchSagittariusMovies = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: sagittariusGenres.join(','),
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

const openMovie = (movieId) => {
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
</script>

<template>
  <div class="sign-container">
    <div v-if="!isLoading" class="sign-content">
      <div class="text-side">
        <h1>O universo escolheu um filme para você, Sagitário ♐︎</h1>
        <p class="description">Aventureiro e otimista, Sagitário! Sua energia combina com histórias épicas, fantásticas e cheias de emoção.</p>
        <button @click="showModal = true" class="explore-btn">Explorar outros signos</button>
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

    <div v-else class="loading"><p>Carregando a energia aventureira...</p></div>

    <div v-if="sagittariusMovies.length" class="sagittarius-library">
      <h2 class="library-title">Filmes com a energia de Sagitário</h2>
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

.sign-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #430d7c, #4b116d, #130420);
  color: #e7dfff;
  font-family: "Poppins", sans-serif;
  padding: 3rem;
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
  box-shadow: 0 0 25px rgba(150, 50, 220, 0.4);
  border: 1px solid rgba(170, 80, 240, 0.4);
}

h1 {
  font-size: 2.6rem;
  color: #d6b3ff;
  text-shadow: 0 0 12px rgba(150, 50, 220, 0.3);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #cbb3ff;
}

.movie-title {
  margin-top: 1rem;
  color: #b89fff;
  font-weight: 600;
}

.explore-btn {
  background: linear-gradient(135deg, #2e0d3a, #6b2e7d);
  color: #f0e7ff;
  border: 1px solid #9456c8;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.explore-btn:hover {
  background: #7d3faf;
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(150, 80, 240, 0.5);
}

.loading {
  text-align: center;
  color: #e7dfff;
  font-size: 1.2rem;
}

.sagittarius-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #d6b3ff;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgba(150, 50, 220, 0.3);
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
  border: 1px solid rgba(150, 50, 220, 0.25);
  box-shadow: 0 0 15px rgba(150, 50, 220, 0.2);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(170, 80, 240, 0.4);
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
  color: #cbb3ff;
  font-size: 0.85rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(20, 0, 30, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-box {
  background: #1a0b2a;
  border: 2px solid #9456c8;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  text-align: center;
  color: #e7dfff;
}

.sign-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.sign-btn {
  background: #3b1f4b;
  color: #e7dfff;
  border: 1px solid #9456c8;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.sign-btn:hover {
  background: #7d3faf;
  transform: scale(1.05);
}

.close-btn {
  margin-top: 2rem;
  background: none;
  border: 1px solid #9456c8;
  color: #d6b3ff;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
}
.close-btn:hover {
  background: #d6b3ff;
  color: #3b1f4b;
}
</style>
