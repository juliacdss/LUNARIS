<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const signos = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"
]

const openSign = (s) => {
  const path = `/${s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`
  router.push({ path })
}
</script>

<template>
  <div class="signos-container">
    <div class="signos-box">
      <h2 class="title">Escolha um Signo</h2>

      <div class="sign-grid">
        <button
          v-for="s in signos"
          :key="s"
          class="sign-btn"
          @click="openSign(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signos-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  /* fundo lindo astral */
  background: radial-gradient(circle at top, #1f0030, #0c0014);
  color: #ffeeb0;
  padding: 2rem;
}

.signos-box {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(25px);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 22px;
  padding: 2.5rem;
  width: 90%;
  max-width: 550px;
  text-align: center;
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.sign-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .8rem;
}

.sign-btn {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #ffeeb0;
  border-radius: 12px;
  padding: .7rem .5rem;
  cursor: pointer;
  transition: .2s;
  font-size: 1rem;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
}

.sign-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: scale(1.05);
}
</style>
