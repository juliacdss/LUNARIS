<script setup>
import { defineProps, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/movie';

const movieStore = useMovieStore();
const router = useRouter();

const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
});

onMounted(async () => {
  await movieStore.getMovieDetail(props.movieId);
});

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="movie-details-container">
    <button class="back-btn" @click="goBack">← Voltar</button>

    <div class="movie-content" v-if="movieStore.currentMovie.title">
      <img
        class="movie-poster"
        :src="`https://image.tmdb.org/t/p/w342${movieStore.currentMovie.poster_path}`"
        :alt="movieStore.currentMovie.title"
      />

      <div class="movie-info">
        <h1 class="movie-title">{{ movieStore.currentMovie.title }}</h1>
        <p class="tagline">{{ movieStore.currentMovie.tagline }}</p>
        <p class="overview">{{ movieStore.currentMovie.overview }}</p>

        <div class="extra-info">
          <p><strong>Orçamento:</strong> ${{ movieStore.currentMovie.budget.toLocaleString() }}</p>
          <p><strong>Avaliação:</strong> ⭐ {{ movieStore.currentMovie.vote_average }}</p>
        </div>

        <div class="companies">
          <h3>Produtoras</h3>
          <div class="logos">
            <template
              v-for="company in movieStore.currentMovie.production_companies"
              :key="company.id"
            >
              <img
                v-if="company.logo_path"
                :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
                :alt="company.name"
              />
              <p v-else>{{ company.name }}</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=Poppins:wght@400;600&display=swap');

.movie-details-container {
  min-height: 100vh;
  background-color: #1c022c;
  color: #f5d78a;
  font-family: "Poppins", sans-serif;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back-btn {
  align-self: flex-start;
  background: transparent;
  border: 2px solid #f5d78a;
  color: #f5d78a;
  font-family: "Poppins", sans-serif;
  border-radius: 25px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: #f5d78a;
  color: #1a0328;
  transform: scale(1.05);
}

.movie-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 3rem;
  max-width: 1000px;
}

.movie-poster {
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(245, 215, 138, 0.2);
}

.movie-info {
  flex: 1;
}

.movie-title {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  font-family: "Cormorant", serif;
}

.tagline {
  font-style: italic;
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.overview {
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.extra-info p {
  margin: 0.4rem 0;
}

.companies {
  margin-top: 2rem;
}

.companies h3 {
  font-family: "Cormorant", serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.logos {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
}

.logos img {
  max-height: 40px;
  filter: brightness(0) invert(1);
}
</style>
