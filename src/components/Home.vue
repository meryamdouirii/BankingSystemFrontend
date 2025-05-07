<script setup>
import { ref, onMounted } from "vue";
import axios from "../axios-auth";

const atms = ref([]);

async function fetchATMs() {
  try {
    const response = await axios.get("fact");
    atms.value = response.data;
  } catch (error) {
    console.error("Failed to fetch ATMs:", error);
    atms.value = [{ error: "Failed to fetch data" }];
  }
}

onMounted(fetchATMs);
</script>

<template>
  <section>
    <div class="container">
      <h2 class="mt-3 mt-lg-5">Welcome to the homepage</h2>
      <div>
        <h3>ATM Data:</h3>
        <pre>{{ atms }}</pre>
        <button @click="fetchATMs">Refresh Data</button>
      </div>
    </div>
  </section>
</template>

<style></style>
