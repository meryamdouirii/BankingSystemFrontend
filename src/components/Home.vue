<script setup>
import { ref, onMounted } from "vue";
import axios from "../axios-auth";

const accounts = ref([]);

async function fetchAccounts() {
  try {
    const response = await axios.get("accounts");
    accounts.value = response.data;
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    accounts.value = [{ error: "Failed to fetch data" }];
  }
}

onMounted(fetchAccounts);
</script>

<template>
  <section>
    <div class="container">
      <h2 class="mt-3 mt-lg-5">Welcome to the homepage</h2>
      <div>
        <h3>Account Data:</h3>
        <pre>{{ accounts }}</pre>
        <button @click="fetchAccounts">Refresh Data</button>
      </div>
    </div>
  </section>
</template>

<style></style>
