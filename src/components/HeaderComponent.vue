<script setup>
import logo from '@/assets/images/logo.png'
</script>

<template>
  <header>
    <div class="header-content">
      <div class="logo-area">
        <img :src="logo" alt="Lunaris Logo" class="logo" />
        <h1 class="logo-text">LUNARIS</h1>
      </div>

      <nav>
        <router-link to="/">Início</router-link>
        <router-link to="/filmes">Filmes</router-link>
        <router-link to="/tv">Séries</router-link>
      </nav>
    </div>
  </header>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

header {
  background-color: #1a0328;
  color: #f5d78a;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  border-bottom: 1px solid rgba(245, 215, 138, 0.3);
}

.header-content {
  width: 90%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.logo {
  width: 45px;
  height: 45px;
}

.logo-text {
  font-size: 1.3rem;
  letter-spacing: 2px;
  font-weight: 600;
}

nav {
  display: flex;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  color: #f5d78a;
  transition: 0.2s;
  position: relative;
}

nav a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 0%;
  height: 2px;
  background-color: #f5d78a;
  transition: width 0.3s ease;
}

nav a:hover::after,
nav a.router-link-exact-active::after {
  width: 100%;
}

nav a:hover {
  color: #ffeeb0;
}
</style>
