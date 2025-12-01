<template>
  <footer class="lunaris-footer">
    <div class="footer-content">
      
      <h2 class="footer-logo">LUNARIS</h2>
      <p class="footer-phrase">Entre astros, filmes e destino — tudo começa aqui.</p>

      <div class="footer-links">
        <router-link to="/">Início</router-link>
        <router-link to="/filmes">Filmes</router-link>
      </div>

      <p class="footer-credits">
        <span>Anna Luiza</span> & <span>Julia Costa</span>
      </p>

      <p class="footer-copy">© 2025 LUNARIS — Todos os direitos reservados.</p>

    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
/* ============================
   FOOTER LUNARIS
============================ */
.lunaris-footer {
  background-color: #1a0328;
  border-top: 1px solid rgba(245, 215, 138, 0.25);
  padding: 2.8rem 1.5rem;
  text-align: center;
  color: #f5d78a;
  font-family: "Poppins", sans-serif;
}

.footer-content {
  max-width: 1100px;
  margin: 0 auto;
}

.footer-logo {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 0.3rem;
  text-shadow: 0 0 10px rgba(245, 215, 138, 0.3),
               0 0 20px rgba(245, 215, 138, 0.2);
}

.footer-phrase {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.8rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-bottom: 1.8rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: #f5d78a;
  text-decoration: none;
  font-weight: 500;
  transition: 0.3s ease;
  position: relative;
}

.footer-links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0%;
  height: 2px;
  background-color: #f5d78a;
  transition: width 0.3s;
}

.footer-links a:hover::after {
  width: 100%;
}

.footer-links a:hover {
  color: #ffeeb0;
}

.footer-credits {
  font-size: 0.95rem;
  margin-bottom: 0.8rem;
  opacity: 0.9;
}

.footer-credits span {
  color: #ffeeb0;
  font-weight: 600;
}

.footer-copy {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 0.3rem;
}
</style>
