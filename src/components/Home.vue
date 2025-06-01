<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isAuthenticated());

function logout() {
  authStore.logout();
}
</script>

<template>
  <section>
    <div class="container">
      <h2 class="mt-3 mt-lg-5">Welcome to the homepage</h2>

      <div v-if="isLoggedIn">
        <p class="text-success">You are logged in.</p>
        <button @click="logout" class="btn btn-danger mb-3">Logout</button>
      </div>

      <div v-else>
        <p class="text-muted">You are not logged in.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
pre {
  background-color: #f8f9fa;
  padding: 1em;
  border-radius: 4px;
}
</style>
