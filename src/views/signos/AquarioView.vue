<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const randomMovie = ref(null)
const aquariusMovies = ref([])
const isLoading = ref(true)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// 🎬 Gêneros futuristas e imaginativos de Aquário
const aquariusGenres = ['878', '12', '14', '28']
// sci-fi, aventura, fantasia, ação

// 🎬 Buscar filme aleatório
const fetchRandomMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: aquariusGenres.join(','),
      language: 'pt-BR',
      sort_by: 'vote_average.desc',
      page: Math.floor(Math.random() * 5) + 1
    }
  })
  const movies = response.data.results
  randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
}

// 🎞️ Lista Aquário
const fetchAquariusMovies = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: aquariusGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: 1
    }
  })
  aquariusMovies.value = response.data.results.slice(0, 20)
}

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchAquariusMovies()])
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
        <h1>Um filme visionário para você, Aquário ♒︎</h1>
        <p class="description">
          Repleto de futuro, imaginação e liberdade — tudo que combina com sua vibe única.
        </p>
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

    <div v-else class="loading"><p>As estrelas estão fazendo cálculos quânticos...</p></div>

    <!-- Lista Aquário -->
    <div v-if="aquariusMovies.length" class="aquarius-library">
      <h2 class="library-title">Filmes recomendados para Aquário</h2>
      <div class="movie-list">
        <div
          v-for="movie in aquariusMovies"
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

/* 🌌 Tema Aquário — Azul Escuro + Azul Elétrico + Roxo Futurista */
.sign-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #030b24, #0d1b42, #162c68, #203a8a);
  color: #d8e8ff;
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
  color: #e3eeff;
  text-shadow: 0 0 14px rgba(113, 182, 255, 0.8);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #b6ccff;
}

.explore-btn {
  background: linear-gradient(135deg, #193d8a, #2360d8);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.explore-btn:hover {
  background: #3f81ff;
  box-shadow: 0 0 25px rgba(100, 160, 255, 0.7);
  transform: scale(1.05);
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
  box-shadow: 0 0 30px rgba(118, 164, 255, 0.35);
  border: 1px solid rgba(170, 200, 255, 0.25);
}

.movie-title {
  margin-top: 1rem;
  color: #e9f1ff;
  font-weight: 600;
}

.loading {
  color: #d2e0ff;
  font-size: 1.2rem;
  text-align: center;
}

/* 🎞️ Lista Aquário */
.aquarius-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #e2ecff;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(110, 170, 255, 0.5);
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
  border: 1px solid rgba(170, 200, 255, 0.18);
  box-shadow: 0 0 20px rgba(110, 150, 255, 0.3);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.06);
  box-shadow: 0 0 35px rgba(110, 170, 255, 0.6);
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
  color: #bcd3ff;
  font-size: 0.85rem;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(5, 10, 40, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-box {
  background: #111c3e;
  border: 2px solid #4c7bff;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  text-align: center;
  color: #d9e8ff;
  animation: fadeIn 0.3s ease-in-out;
}

.sign-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.sign-btn {
  background: #1d2f66;
  color: #e5ecff;
  border: 1px solid #5b7cff;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.sign-btn:hover {
  background: #3e60ff;
  transform: scale(1.05);
}

.close-btn {
  margin-top: 2rem;
  background: none;
  border: 1px solid #90aaff;
  color: #e5ecff;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}
.close-btn:hover {
  background: #d9e8ff;
  color: #0d1b42;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
