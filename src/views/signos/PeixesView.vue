<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const randomMovie = ref(null)
const piscesMovies = ref([])
const isLoading = ref(true)

const signos = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

// 🎀 Gêneros para Peixes (fantasia, romance, drama)
const piscesGenres = ['14', '10749', '18']

// 🎬 Filme do dia
const fetchRandomMovie = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: piscesGenres.join(','),
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

// 🎞️ Lista Peixes
const fetchPiscesMovies = async () => {
  try {
    const response = await api.get('discover/movie', {
      params: {
        with_genres: piscesGenres.join(','),
        language: 'pt-BR',
        sort_by: 'popularity.desc',
        page: 1
      }
    })
    piscesMovies.value = (response.data.results || []).slice(0, 20)
  } catch (e) {
    console.error('fetchPiscesMovies error', e)
  }
}

const openMovie = movieId => {
  router.push({ name: 'MovieDetails', params: { movieId } })
}

onMounted(async () => {
  try {
    await Promise.all([fetchRandomMovie(), fetchPiscesMovies()])
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

// PORTAL
const showPortalReveal = ref(false)
const ariesMessage = ref(null)
const ariesMessages = [
  "Hoje sua sensibilidade vira superpoder — perceba o que ninguém diz, só sente.",

"O universo te fala em sussurros; confie na intuição que arrepia.",

"Peixes, o dia pede suavidade: sinta antes de decidir, respire antes de reagir.",

"Seu coração é bússola — ele aponta caminhos que a razão não enxerga.",

"Hoje, a maré da imaginação está alta: mergulhe nas ideias que te acalmam.",

"A energia do dia te envolve em cura — permita que emoções antigas finalmente se dissolvam.",

"Seu brilho está no que você sente, não no que você prova. Seja fluxo.",

"Peixes, algo bonito te encontra quando você se entrega ao que parece sonho.",

"O universo abre portas quando você escolhe empatia, não defesa.",

"Hoje um detalhe sensível — um olhar, uma palavra — pode transformar sua vibe."
]

const fetchAriesVision = () => {
  ariesMessage.value =
    ariesMessages[Math.floor(Math.random() * ariesMessages.length)]
  showPortalReveal.value = true
}
</script>

<template>
  <div class="sign-container">
    <div v-if="!isLoading" class="sign-content">
      <div class="text-side">
        <h1>O universo escolheu um filme para você, Peixes ♓︎</h1>
        <p class="description">
          Sonhe, Peixes! Sua alma sensível combina com histórias emocionantes, mágicas e cheias de imaginação.
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

    <div v-else class="loading"><p>Carregando a magia pisciana...</p></div>

    <!-- Lista Peixes -->
    <div v-if="piscesMovies.length" class="pisces-library">
      <h2 class="library-title">Filmes com a sensibilidade e magia de Peixes</h2>
      <div class="movie-list">
        <div
          v-for="movie in piscesMovies"
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
    <!-- PORTAL ÁRIANO -->
   <div class="portal-wrapper">
      <div class="portal" @click="fetchAriesVision"></div>
      <p class="portal-text">Clique no portal e receba uma visão pisciana</p>
    </div>

    <div v-if="showPortalReveal" class="portal-modal">
      <div class="portal-modal-content-aries">

        <div v-if="ariesMessage" class="portal-message">
          <p>{{ ariesMessage }}</p>
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
  background: linear-gradient(180deg, #331433 0%, #4d003d 50%, #66004d 100%);
  color: #ffe6f7;
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
  text-align: left;
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
  box-shadow: 0 0 25px rgba(224, 85, 213, 0.5);
  border: 1px solid rgba(255, 180, 220, 0.4);
}

h1 {
  font-size: 2.6rem;
  color: #ffd2ef;
  text-shadow: 0 0 12px rgba(255, 190, 230, 0.5);
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ffd9f2;
}

.movie-title {
  margin-top: 1rem;
  color: #ffd2ef;
  font-weight: 600;
}

.explore-btn {
  background: linear-gradient(135deg, #8a0066, #c6008f);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  
  color: #fff4c2;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  border: 1.5px solid rgba(255, 255, 255, 0.45); /* borda mais forte de vidro */
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.25); /* glow de vidro */
}

.explore-btn:hover {
  background:#ff47c3;
  transform: scale(1.07);
  box-shadow:  0 0 25px rgba(255, 100, 200, 0.6);
}

.loading {
  text-align: center;
  color: #ffd7f4;
  font-size: 1.2rem;
}

/* Lista */
.pisces-library {
  margin-top: 4rem;
}

.library-title {
  text-align: center;
  font-size: 2rem;
  color: #ffd2ef;
  margin-bottom: 2rem;
  text-shadow: 0 0 8px rgba(255, 140, 210, 0.4);
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
  border: 1px solid rgba(255, 150, 220, 0.3);
  box-shadow: 0 0 15px rgba(255, 150, 220, 0.3);
  cursor: pointer;
  transition: 0.3s;
}
.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 69, 184, 0.5);
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
  color: #ffd7f4;
  font-size: 0.85rem;
}


/* MODAL SIGNOS */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-overlay {
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

  /* EFEITO SUAVE */
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
  font-family: "Poppins", sans-serif;
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

.portal-wrapper {
  text-align: center;
  margin: 4rem 0;
}

.portal {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle, #c9f8ff, #a6e0ff, #7a8cff); 
  /* azul bebê → azul água → lilás suave */
  box-shadow: 
    0 0 25px #b5f3ff,
    0 0 60px #9bdcff,
    0 0 90px #7a8cff;
  animation: portalPulsePeixes 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: 0.3s;
}

.portal:hover {
  box-shadow: 
    0 0 40px #d6fbff,
    0 0 90px #b6e7ff,
    0 0 120px #7a8cff;
  transform: scale(1.08);
}

.portal-text {
  font-family: "Poppins", sans-serif;
  margin-top: 1rem;
  color: #e8f7ff; /* azul-gelo clarinho */
  font-size: 1.1rem;
}

/* Portal Pulse Animation */
@keyframes portalPulsePeixes {
  from {
    transform: scale(1);
    box-shadow: 
      0 0 25px #b5f3ff,
      0 0 60px #9bdcff;
  }
  to {
    transform: scale(1.06);
    box-shadow:
      0 0 40px #d6fbff,
      0 0 90px #b6e7ff;
  }
}

/* MODAL PEIXES */
.portal-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 30, 50, 0.5); /* azul-marinho transparente bem etéreo */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.portal-modal-content-aries {
  background: #f2fbff; /* azul bem clarinho */
  border: 1px solid #9ecbff; /* azul água suave */
  border-radius: 22px;
  padding: 2rem;
  width: 85%;
  max-width: 420px;
  text-align: center;
  animation: fadeIn 0.4s ease;
}

.portal-message p {
  font-size: 1.25rem;
  margin: 1.5rem 0;
  color: #3d4f8c; /* azul/lilás profundo */
  line-height: 1.5;
}

/* Botão de fechar */
.close-portal {
  margin-top: 1.5rem;
  background: none;
  border: 1px solid #9ecbff;
  color: #9ecbff;
  padding: .7rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s;
  font-weight: 600;
}

.close-portal:hover {
  background: #9ecbff;
  color: #f2fbff;
}

/* Fade animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

</style>
