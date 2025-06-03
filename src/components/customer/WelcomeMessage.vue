<template>
  <div class="text-center text-white background">
    <h1 class="mb-4">Hello, {{ customer.firstName }}!</h1>
    <div class="card shadow-sm rounded-4 p-4 bg-white bg-opacity-10">
      <div class="fs-4 mb-3">Welcome to Centjesbank</div>
      <p class="mb-4">Your account is being reviewed and will be approved shortly.</p>
      <div class="d-flex justify-content-center align-items-center mb-3" style="min-height: 60px;">
        <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <p>Please check back later</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  customer: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>

.background {
  background: #6610f2;
}

</style>