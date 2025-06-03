<template>
  <div class="forbidden-container">
    <div class="forbidden-card">
      <h1 class="forbidden-title">403 - Forbidden</h1>
      <p class="forbidden-message">
        You do not have permission to access this page.
      </p>
      <p class="forbidden-message">
        Please contact your administrator if you believe this is an error.
      </p>
      <router-link to="/" class="btn-small">Go to Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #f9f9f9;
  padding: 1rem;
}

.forbidden-card {
  background-color: white;
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.forbidden-title {
  color: #d14545;
  margin-bottom: 1rem;
}

.forbidden-message {
  color: #666;
  margin-bottom: 1rem;
}
</style>
