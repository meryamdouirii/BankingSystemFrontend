<template>
  <div class="card shadow-sm rounded-4 p-3 mb-4 bg-white">
    <div class="text-muted small">Total balance</div>
    <div class="fs-3 fw-bold">€ {{ balance.toFixed(2) }}</div>
  </div>
</template>

<script setup>
defineProps({
  balance: {
    type: Number,
    required: true
  }
});
</script>