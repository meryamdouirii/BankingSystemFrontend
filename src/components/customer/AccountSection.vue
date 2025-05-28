<template>
  <div class="mb-4" v-if="account">
    <h5 class="header-title">{{ title }}</h5>
    <div class="account-card card shadow-sm rounded-4 p-3 bg-gray">
      <h6 class="text-primary">{{ accountType }}</h6>
      <div class="text-muted small">Name: {{ customer.firstName }} {{ customer.lastName }}</div>
      <div class="text-muted small">IBAN: <span class="text-monospace">{{ account.iban }}</span></div>
      <div class="fs-4 fw-bold mt-2">€ {{ account.balance.toFixed(2) }}</div>
    </div>
  </div>
  <div v-else class="mb-4">
    <h5 class="header-title">{{ title }}</h5>
    <div class="card shadow-sm rounded-4 p-3 text-center bg-gray">
      <p>No {{ title.toLowerCase() }} account found</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  account: {
    type: Object,
    default: null
  },
  customer: {
    type: Object,
    required: true
  },
  accountType: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.header-title {
  color: #6c63ff;
  font-weight: 600;
}
</style>

