<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue";
import { useAuthStore } from "./stores/auth";
const authStore = useAuthStore();

onMounted(() => {
  authStore.loadToken();
});
</script>

<template>
  <Navigation />
  <RouterView />
</template>

<style scoped></style>
