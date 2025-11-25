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

const scorpioGenres = ['27', '53', '80', '9648']

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
</script>

<template>
  <div class="sign-container">
    <div v-if="!isLoading" class="sign-content">
      <div class="text-side">
        <h1>O universo escolheu um filme para você, Escorpião ♏︎</h1>
        <p class="description">Prepare-se para mergulhar em mistérios profundos, intensos e cheios de emoção.</p>
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

    <div v-else class="loading"><p>Carregando as energias do universo...</p></div>

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
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@600&family=Poppins:wght@400;600&display=swap');

.sign-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #000000, #050505, #0a0a0a);
  color: #e2e2e2;
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

/* BOTÃO */
.explore-btn {
  background: linear-gradient(135deg, #1a0000, #330000);
  color: #fff4f4;
  border: 1px solid #550000;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.explore-btn:hover {
  background: #550000;
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(255, 0, 0, 0.4);
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

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-box {
  background: #0c0c0c;
  border: 2px solid #550000;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  text-align: center;
  color: #e0e0e0;
  animation: fadeIn 0.3s ease-in-out;
}

.sign-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.sign-btn {
  background: #150000;
  color: #fff4f4;
  border: 1px solid #3a0000;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.sign-btn:hover {
  background: #550000;
  transform: scale(1.05);
}

.close-btn {
  margin-top: 2rem;
  background: none;
  border: 1px solid #550000;
  color: #ffdddd;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}
.close-btn:hover {
  background: #ffdddd;
  color: #300000;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
