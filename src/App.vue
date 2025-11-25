<script setup>
import HeaderComponent from './components/HeaderComponent.vue'
</script>

<template>
  <HeaderComponent />
  <main>
    <RouterView />
  </main>
</template>

<style>
main {
  background-color: #1c022c;
  min-height: 100vh;
  color: #f5d78a;
  font-family: 'Poppins', sans-serif;
  display: block;
}
</style>
