<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Vue3Lottie } from 'vue3-lottie'
import Particles from 'vue3-particles'
import api from '@/plugins/axios'

const router = useRouter()
const isLoading = ref(true)
const randomMovie = ref(null)
const touroMovies = ref([])
const showModal = ref(false)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// gêneros associados a Touro (romance, drama, fantasia, música)
const touroGenres = ['18', '10749', '10402', '14']

const fetchRandomMovie = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: touroGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: Math.floor(Math.random() * 5) + 1,
    },
  })
  const movies = response.data.results
  randomMovie.value = movies[Math.floor(Math.random() * movies.length)]
}

const fetchTouroMovies = async () => {
  const response = await api.get('discover/movie', {
    params: {
      with_genres: touroGenres.join(','),
      language: 'pt-BR',
      sort_by: 'popularity.desc',
      page: 1,
    },
  })
  touroMovies.value = response.data.results.slice(0, 12)
}

const openMovie = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchTouroMovies()])
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="sign-container">
    <!-- Fundo animado -->
    <Particles
      id="touro-particles"
      :options="{
        background: { color: '#0c1911' },
        fpsLimit: 60,
        particles: {
          color: { value: ['#a3ff80', '#88cc66', '#ffeeaa'] },
          move: { enable: true, speed: 1.4, direction: 'top', outModes: 'out' },
          number: { value: 90 },
          opacity: { value: 0.5 },
          size: { value: { min: 2, max: 5 } },
          shape: { type: 'star' },
          links: { enable: true, color: '#88cc66', opacity: 0.2 },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'repulse' } },
          modes: { repulse: { distance: 120 } },
        },
        detectRetina: true,
      }"
    />

    <!-- Lottie símbolo -->
    <div class="touro-lottie">
      <Vue3Lottie
        animationLink="https://lottie.host/9ff4d8f3-ff62-4220-b604-b8ce52dd21a8/6Tk8VDZyUu.json"
        :height="250"
        :width="250"
        :loop="true"
        :autoplay="true"
      />
    </div>

    <div v-if="!isLoading" class="sign-content">
      <div class="text-side">
        <h1>♉ Bem-vindo(a), <span>Touro</span>!</h1>
        <p class="description">
          Filme e prazer andam juntos para você. Este é o seu momento de relaxar,
          saborear a vida e se conectar com o belo. 💚
        </p>
        <button @click="showModal = true" class="explore-btn">
          Explorar outros signos
        </button>
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

    <section v-if="touroMovies.length" class="touro-library">
      <h2 class="library-title">🌿 Filmes com energia de Touro</h2>
      <div class="movie-list">
        <div
          v-for="movie in touroMovies"
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
    </section>

    <!-- Modal de outros signos -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <h3>✨ Escolha outro signo</h3>
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.sign-container {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at bottom, #163322 0%, #0c1911 70%);
  color: #e6ffd8;
  font-family: "Poppins", sans-serif;
  padding: 3rem;
  overflow: hidden;
}

/* Lottie animação */
.touro-lottie {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  opacity: 0.85;
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translate(-50%, 0px); }
  50% { transform: translate(-50%, 15px); }
}

.sign-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rem;
  z-index: 2;
  position: relative;
}

.text-side {
  flex: 1;
  max-width: 500px;
}

.text-side h1 {
  font-size: 2.6rem;
  color: #e8ffe5;
  text-shadow: 0 0 15px rgba(144, 255, 128, 0.6);
}

.text-side span {
  color: #baff9e;
  font-style: italic;
}

.description {
  font-size: 1.2rem;
  margin: 1.5rem 0 2rem;
  color: #ccf5cc;
}

.explore-btn {
  background: linear-gradient(90deg, #4fa869, #7dd87d);
  color: #f2ffec;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 0 20px rgba(111, 214, 128, 0.4);
}
.explore-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #7dd87d, #a3f0a3);
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
  width: 260px;
  border-radius: 20px;
  box-shadow: 0 0 35px rgba(160, 255, 153, 0.5);
}
.movie-title {
  margin-top: 1rem;
  font-weight: 600;
  color: #b4ffab;
}

/* Biblioteca de filmes */
.touro-library {
  margin-top: 4rem;
  z-index: 2;
  position: relative;
}
.library-title {
  text-align: center;
  font-size: 2rem;
  color: #e5ffd4;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(144, 255, 128, 0.3);
}
.movie-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}
.movie-card {
  width: 180px;
  border-radius: 15px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 15px rgba(111, 214, 128, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}
.movie-card:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 0 30px rgba(170, 255, 150, 0.5);
}
.movie-card img {
  width: 100%;
  height: 270px;
  object-fit: cover;
}
.movie-details {
  padding: 0.5rem;
  text-align: center;
  color: #e8ffe0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(10, 20, 14, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-box {
  background-color: rgba(15, 31, 23, 0.95);
  border: 2px solid #b4ffab;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  text-align: center;
  color: #d4f2c3;
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
  background: #4e9f61;
  border: none;
  border-radius: 20px;
  color: #f2ffec;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: 0.3s;
}
.sign-btn:hover {
  background: #6fd680;
  transform: scale(1.05);
}
.close-btn {
  margin-top: 2rem;
  background: none;
  border: 1px solid #b4ffab;
  color: #d4f2c3;
  border-radius: 20px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  transition: 0.3s;
}
.close-btn:hover {
  background-color: #b4ffab;
  color: #0f1f17;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
