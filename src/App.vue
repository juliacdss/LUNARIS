<script setup></script>

<template>
  <header>
    <nav>
      <router-link to="/">Início</router-link>
      <router-link to="/filmes">Filmes</router-link>
      <router-link to="/tv">Séries</router-link>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
header {
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #1a0328;
  color: #f5d78a;
  font-size: 1.2rem;
  padding-right: 3rem;
}

nav {
  display: flex;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  color: #f5d78a;
  font-weight: 600;
  transition: color 0.2s;
}

nav a.router-link-exact-active {
  border-bottom: 2px solid #f5d78a;
}

nav a:hover {
  color: #ffeeb0;
}
</style>