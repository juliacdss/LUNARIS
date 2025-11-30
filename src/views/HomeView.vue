<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const birthdate = ref('')
const showBox = ref(false)

const calculateSign = () => {
  showBox.value = true
}

const getSign = (date) => {
  const d = new Date(date)
  const day = d.getDate()
  const month = d.getMonth() + 1 // meses começam em 0

  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'aries'
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'touro'
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'gemeos'
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'cancer'
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'leao'
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'virgem'
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'libra'
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'escorpiao'
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'sagitario'
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'capricornio'
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'aquario'
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'peixes'

  return null
}

const submitDate = () => {
  if (!birthdate.value) {
    alert('Por favor, insira sua data de nascimento.')
    return
  }

  const sign = getSign(birthdate.value)
  if (sign) {
    router.push(`/${sign}`)
  } else {
    alert('Data inválida! Tente novamente.')
  }
}
</script>

<template>
  <div class="home-container">
    <div class="content">
      <h2 class="title">O que o seu signo veria hoje?</h2>
      <p class="subtitle">Astrologia e cinema, em perfeita sintonia.</p>

      <button @click="calculateSign" class="discover-btn">
        Descobrir
      </button>
    </div>

    <!-- Quadrinho modal -->
    <div v-if="showBox" class="modal-overlay">
      <div class="modal-box">
        <p class="modal-text">
          Insira sua data de nascimento e descubra o que os astros escolheram pra você!
        </p>
        <input
          type="date"
          v-model="birthdate"
          class="date-input"
        />
        <button @click="submitDate" class="discover-btn">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=Poppins:wght@400;600&display=swap');

.home-container {
  min-height: 100vh;
  background-color: #1c022c;
  color: #f5d78a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family:  "Poppins", sans-serif;
  padding: 2rem;
  position: relative;
}

.title {
  font-size: 4.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 3rem;
}

.discover-btn {
  font-family: "Poppins", sans-serif;
  background-color: #f5d78a;
  color: #1a0328;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(245, 215, 138, 0.2);
}

.discover-btn:hover {
  background-color: #ffeeb0;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(245, 215, 138, 0.6), 0 0 40px rgba(245, 215, 138, 0.3);
}

/* === Modal === */
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
}

.modal-box {
  background-color: rgba(28, 2, 44, 0.95);
  border: 2px solid #f5d78a;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  text-align: center;
  color: #f5d78a;
  max-width: 400px;
  width: 80%;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-text {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.date-input {
  background: transparent;
  border: 1px solid #fada8a;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  color: #fada8a;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
