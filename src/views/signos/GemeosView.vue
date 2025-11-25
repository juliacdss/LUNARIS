<script setup>
import { ref, onMounted } from "vue";
import api from "@/plugins/axios.js";

const movieOfTheDay = ref(null);
const movies = ref([]);
const loading = ref(true);

const fetchGeminiMovies = async () => {
  try {
    const response = await api.get("discover/movie", {
      params: {
        with_genres: "35,12",
        sort_by: "popularity.desc",
        page: 1,
      },
    });

    movies.value = response.data.results;
    movieOfTheDay.value = response.data.results[0];
  } catch (error) {
    console.error("Erro ao carregar filmes de Gêmeos:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchGeminiMovies);
</script>

<template>
  <div class="sign-container">
    <div class="sign-content">
      <div class="text-side">
        <h1>Gêmeos – O Comunicador do Zodíaco</h1>
        <p class="description">
          Filmes rápidos, divertidos, inteligentes e cheios de movimento —
          perfeitos para o signo mais curioso e versátil do zodíaco.
        </p>

        <button class="explore-btn">Explorar mais</button>
      </div>

      <div class="movie-side" v-if="movieOfTheDay">
        <h2>Filme do dia</h2>
        <img
          class="movie-poster"
          :src="'https://image.tmdb.org/t/p/w500' + movieOfTheDay.poster_path"
          :alt="movieOfTheDay.title"
        />
        <h3 class="movie-title">{{ movieOfTheDay.title }}</h3>
      </div>

      <p v-else class="loading">Carregando filme do dia...</p>
    </div>

    <div class="gemini-library">
      <h2 class="library-title">Filmes recomendados para Gêmeos</h2>

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

.sign-container {
  min-height: 100vh;
  padding: 0 3rem;
  padding-top: 2rem;
  font-family: "Poppins", sans-serif;

  background: linear-gradient(
    180deg,
    #fff8d5 0%,
    #ffefb0 40%,
    #ffe58a 100%
  );
  color: #5a4a12;
}

.sign-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3.5rem;
  margin-bottom: 3.5rem;
    margin-left: 15rem;
}

.text-side {
  flex: 1;
  max-width: 520px;
}

h1 {
  font-size: 2.4rem;
  color: #5a4a12;
  text-shadow: 0 0 10px rgba(255, 240, 150, 0.5);
}

.description {
  font-size: 1.16rem;
  margin-bottom: 1.6rem;
  color: #6d5b16;
}

.explore-btn {
  background: linear-gradient(135deg, #fff4a8, #ffe27a);
  color: #5a4a12;
  font-weight: 600;
  border: 1px solid #e1c65c;
  border-radius: 28px;
  padding: 0.85rem 1.8rem;
  font-size: 1.01rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.explore-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 220, 120, 0.35);
}

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
    0 10px 30px rgba(255, 200, 80, 0.4),
    0 0 25px rgba(255, 220, 120, 0.45);
  border: 1px solid rgba(255, 230, 150, 0.55);
}

.movie-title {
  margin-top: 0.9rem;
  font-weight: 600;
  color: #5a4a12;
}

.loading {
  color: #6f5c18;
  font-size: 1.1rem;
  text-align: center;
}

.gemini-library {
  margin-top: 2.8rem;
}

.library-title {
  text-align: center;
  font-size: 1.9rem;
  color: #5d4d14;
  text-shadow: 0 0 5px rgba(255, 230, 150, 0.4);
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

  background: rgba(255, 245, 200, 0.55);
  backdrop-filter: blur(6px);

  box-shadow: 0 6px 18px rgba(255, 210, 120, 0.35);
  border: 1px solid rgba(255, 230, 150, 0.55);

  cursor: pointer;
  transition: 0.25s ease;
}

.movie-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(255, 210, 120, 0.45);
}

.movie-card img {
  width: 100%;
  height: 260px;
  object-fit: cover;
}

.movie-details {
  padding: 0.7rem;
  text-align: center;
  color: #59460f;
}

.movie-release-date {
  font-size: 0.85rem;
  color: #7a6514;
}

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
