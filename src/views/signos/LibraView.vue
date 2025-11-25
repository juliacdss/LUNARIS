<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const randomMovie = ref(null)
const libraMovies = ref([])
const isLoading = ref(true)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// 🎬 Gêneros vibe Libra — romance, drama, fantasia suave
const libraGenres = ['10749', '18', '14']

// Buscar filme aleatório
const fetchRandomMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: libraGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: Math.floor(Math.random() * 5) + 1
    }
  })
  const movies = response.data.results
  randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
}

// Buscar lista de filmes
const fetchLibraMovies = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: libraGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: 1
    }
  })
  libraMovies.value = response.data.results.slice(0, 20)
}

// Acessar detalhes
const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchLibraMovies()])
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
        <h1>O universo escolheu um filme para você, Libra ♎︎</h1>
        <p class="description">Harmonia, beleza e emoção — exatamente como você gosta.</p>
        <button @click="showModal = true" class="explore-btn">Explorar</button>
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

    <div v-else class="loading">
      <p>Carregando energias equilibradas do universo...</p>
    </div>

    <div v-if="libraMovies.length" class="libra-library">
      <h2 class="library-title">Filmes com a energia leve e romântica de Libra</h2>

      <div class="movie-list">
        <div
          v-for="movie in libraMovies"
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

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <h3>Escolha outro signo</h3>

        <div class="sign-buttons">
          <button
            v-for="s in signos"
            :key="s"
            class="sign-btn"
            @click="
              router.push({
                path: `/${s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()}`
              })
            "
          >
            {{ s }}
          </button>
        </div>

        <button class="close-btn" @click="showModal = false">Fechar</button>
      </div>
    </div>

  </div>
</template>

<!-- 🔥 TUDO QUE ERA @keyframes FOI MOVIDO PRA CÁ -->
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

<!-- 🔥 SEU CSS ORIGINAL INTACTO -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

/* 💙 TEMA LIBRA — AZUL CLARO SUAVE */
.sign-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #d7ecff, #b5d8ff, #9bc9ff);
  color: #0b1d35;
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

h1 {
  font-size: 2.6rem;
  color: #0b1d35;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.explore-btn {
  background: rgba(15, 150, 240, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  color: #000;
  font-weight: 600;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.25);
  font-family: "Poppins", sans-serif;
}

.explore-btn:hover {
  background: rgba(13, 173, 236, 0.15);
  transform: scale(1.07);
  box-shadow: 0 0 40px rgba(52, 139, 238, 0.55);
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
  box-shadow: 0 0 20px rgba(100, 150, 255, 0.5);
}

.movie-title {
  margin-top: 1rem;
  font-weight: 600;
  color: #0b1d35;
}

.libra-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #0b1d35;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
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
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(100, 150, 255, 0.3);
  box-shadow: 0 0 15px rgba(100, 150, 255, 0.25);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(100, 150, 255, 0.4);
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
  color: #1a3357;
  font-size: 0.85rem;
}

/* MODAL */
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
</style>
