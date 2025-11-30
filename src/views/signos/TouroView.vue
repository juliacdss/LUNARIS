<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const randomMovie = ref(null)
const taurusMovies = ref([])
const isLoading = ref(true)

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
</script>

<template>
  <div class="sign-container">
    <div v-if="!isLoading" class="sign-content">
      <div class="text-side">
        <h1>O universo escolheu um filme para você, Touro ♉︎</h1>
        <p class="description">Paciente e sensível, Touro! Sua energia combina com histórias românticas, emocionantes e cheias de sentimento.</p>
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

.explore-btn {
  background: linear-gradient(135deg, #c3b0ff, #7e60ff);
  color: #261a3b;
  border: 1px solid #947aff;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.explore-btn:hover {
  background: #9a7eff;
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(140, 100, 255, 0.5);
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(50, 20, 70, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-box {
  background: #58488f;
  border: 2px solid #947aff;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  text-align: center;
  color: #3b2a5f;
}

.sign-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.sign-btn {
  background: #2e284b;
  color: #8d7eaf;
  border: 1px solid #947aff;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.sign-btn:hover {
  background: #9a7eff;
  transform: scale(1.05);
}

.close-btn {
  margin-top: 2rem;
  background: none;
  border: 1px solid #947aff;
  color: #120d27;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
}
.close-btn:hover {
  background: #8c70ff;
  color: #f2ebff;
}
</style>