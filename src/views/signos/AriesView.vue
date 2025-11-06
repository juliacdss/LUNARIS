<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const randomMovie = ref(null)
const isLoading = ref(true)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// 🎬 Função pra buscar um filme aleatório do gênero Ação/Aventura
const fetchRandomMovie = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: '28,12', // Ação e Aventura
        language: 'pt-BR',
        sort_by: 'popularity.desc',
        page: Math.floor(Math.random() * 5) + 1
      }
    })
    const movies = response.data.results
    randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
  } catch (error) {
    console.error('Erro ao buscar filme:', error)
  } finally {
    isLoading.value = false
  }
}

// 🔗 Redirecionar para detalhes do filme
const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(fetchRandomMovie)
</script>

<template>
  <div class="sign-container">
    <div class="sign-content" v-if="!isLoading">
      <div class="text-side">
        <h1>O universo escolheu um filme pra você, Áries ♈︎</h1>
        <p class="description">
          Descubra o que os astros prepararam com base no seu signo.
        </p>
        <button @click="showModal = true" class="explore-btn">Explorar</button>
      </div>

      <div class="movie-side" v-if="randomMovie" @click="openMovie(randomMovie.id)">
        <h2>🎬 Filme do dia</h2>
        <img
          :src="`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`"
          :alt="randomMovie.title"
          class="movie-poster"
        />
        <p class="movie-title">{{ randomMovie.title }}</p>
      </div>
    </div>

    <div v-else class="loading">
      <p>✨ Carregando o filme do universo...</p>
    </div>

    <!-- Modal de signos -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <h3>Escolha outro signo ✨</h3>
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
  background: radial-gradient(circle at bottom, #2a032f 0%, #1c022c 70%);
  color: #f5d78a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  position: relative;
  overflow: hidden;
  padding: 3rem;
}

.sign-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  z-index: 1;
}

.text-side {
  flex: 1;
  max-width: 500px;
}

.movie-side {
  flex: 1;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-side:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 300px;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(255, 80, 80, 0.4);
}

h1 {
  font-size: 2.6rem;
  color: #ffeeb0;
  text-shadow: 0 0 10px rgba(255, 80, 80, 0.5);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #fada8a;
}

.movie-title {
  margin-top: 1rem;
  font-weight: 600;
  color: #ffb284;
}

.explore-btn {
  background-color: #ff4e4e;
  color: #fff4c2;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.explore-btn:hover {
  background-color: #ff7a7a;
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 100, 100, 0.7);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(28, 2, 44, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-box {
  background-color: rgba(28, 2, 44, 0.95);
  border: 2px solid #f5d78a;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  text-align: center;
  color: #f5d78a;
  max-width: 500px;
  animation: fadeIn 0.3s ease-in-out;
}

.sign-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.sign-btn {
  background: #ff4e4e;
  border: none;
  border-radius: 20px;
  color: #fff4c2;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: 0.3s;
}

.sign-btn:hover {
  background: #ff7a7a;
  transform: scale(1.05);
}

.close-btn {
  margin-top: 2rem;
  background: none;
  border: 1px solid #f5d78a;
  color: #f5d78a;
  border-radius: 20px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  transition: 0.3s;
}

.close-btn:hover {
  background-color: #f5d78a;
  color: #1a0328;
}

.loading {
  color: #ffeeb0;
  font-size: 1.2rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
