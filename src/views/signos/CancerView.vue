<script setup>
import { ref, onMounted } from "vue";
import api from "@/plugins/axios.js";

// estados
const movieOfTheDay = ref(null);
const movies = ref([]);
const loading = ref(true);

// carregar filmes
const fetchCancerMovies = async () => {
  try {
    const response = await api.get("discover/movie", {
      params: {
        with_genres: "18,10749", // drama + romance combina com Câncer
        sort_by: "popularity.desc",
        page: 1,
      },
    });

    movies.value = response.data.results;
    movieOfTheDay.value = response.data.results[0];
  } catch (error) {
    console.error("Erro ao carregar filmes de Câncer:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCancerMovies);
</script>

<template>
  <div class="sign-container">
    <div class="sign-content">
      <div class="text-side">
        <h1>Câncer – O Sentimental do Zodíaco</h1>
        <p class="description">
          Histórias emocionantes, sensíveis e profundas — perfeitas para o signo
          mais intuitivo e acolhedor do zodíaco.
        </p>

        <button class="explore-btn">Explorar mais</button>
      </div>

      <div class="movie-side" v-if="movieOfTheDay">
        <img
          class="movie-poster"
          :src="'https://image.tmdb.org/t/p/w500' + movieOfTheDay.poster_path"
          :alt="movieOfTheDay.title"
        />
        <h3 class="movie-title">{{ movieOfTheDay.title }}</h3>
      </div>

      <p v-else class="loading">Carregando filme do dia...</p>
    </div>

    <div class="cancer-library">
      <h2 class="library-title">Filmes recomendados para Câncer</h2>

      <div class="movie-list">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="movie-card"
        >
          <img
            :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
            :alt="movie.title"
          />
          <div class="movie-details">
            <h3>{{ movie.title }}</h3>
            <p class="movie-release-date">{{ movie.release_date }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@600&family=Poppins:wght@400;600&display=swap');

/* 🌙✨ Tema de Câncer: Branco + Azul gelo + prata suave */
.sign-container {
  min-height: 100vh;
  padding: 0 3rem;
  padding-top: 2rem;
  font-family: "Poppins", sans-serif;

  /* Fundo branco luminoso com brilho lunar */
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #f3f8ff 40%,
    #e6f2ff 100%
  );
  color: #314455;
}

.sign-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3.5rem;
  margin-bottom: 3.5rem;
}

.text-side {
  flex: 1;
  max-width: 520px;
}

h1 {
  font-size: 2.4rem;
  color: #3a4a55;
  text-shadow: 0 0 10px rgba(180, 200, 230, 0.5);
}

.description {
  font-size: 1.16rem;
  margin-bottom: 1.6rem;
  color: #506577;
}

/* Botão com toque lunar */
.explore-btn {
  background: linear-gradient(135deg, #ffffff, #e1f0ff);
  color: #3b4d5a;
  font-weight: 600;
  border: 1px solid #c9d9e8;
  border-radius: 28px;
  padding: 0.85rem 1.8rem;
  font-size: 1.01rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.explore-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(170, 195, 230, 0.35);
}

/* Poster destaque */
.movie-side {
  flex: 1;
  text-align: center;
  transition: transform 0.28s ease;
}

.movie-side:hover {
  transform: scale(1.04);
}

.movie-poster {
  width: 300px;
  border-radius: 20px;
  box-shadow:
    0 10px 30px rgba(150, 170, 200, 0.4),
    0 0 25px rgba(210, 230, 255, 0.45);
  border: 1px solid rgba(200, 220, 240, 0.55);
}

.movie-title {
  margin-top: 0.9rem;
  font-weight: 600;
  color: #3b5368;
}

.loading {
  color: #5c7285;
  font-size: 1.1rem;
  text-align: center;
}

/* ============================= */
/*        LISTA DE FILMES        */
/* ============================= */

.cancer-library {
  margin-top: 2.8rem;
}

.library-title {
  text-align: center;
  font-size: 1.9rem;
  color: #42576b;
  text-shadow: 0 0 5px rgba(180, 200, 230, 0.4);
  margin-bottom: 1.6rem;
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
}

.movie-card {
  width: 180px;
  border-radius: 14px;
  overflow: hidden;

  /* cartas claras e suaves */
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(6px);

  box-shadow: 0 6px 18px rgba(150, 170, 200, 0.35);
  border: 1px solid rgba(200, 220, 240, 0.55);

  cursor: pointer;
  transition: 0.25s ease;
}

.movie-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(150, 170, 200, 0.45);
}

.movie-card img {
  width: 100%;
  height: 260px;
  object-fit: cover;
}

.movie-details {
  padding: 0.7rem;
  text-align: center;
  color: #3b4d5a;
}

.movie-release-date {
  font-size: 0.85rem;
  color: #6a8197;
}

/* Responsivo */
@media (max-width: 900px) {
  .sign-content {
    flex-direction: column;
    gap: 1.6rem;
  }
  .movie-poster {
    width: 240px;
  }
}
</style>
