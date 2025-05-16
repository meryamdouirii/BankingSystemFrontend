<template>
  <nav class="navbar fixed-bottom bg-white border-top shadow-sm">
    <div class="container d-flex justify-content-around text-center">
      <div class="nav-item active">
        <div>🏠</div>
        <small>Overview</small>
      </div>
      <div class="nav-item">
        <div>⚙️</div>
        <small>Settings</small>
      </div>
    </div>
  </nav>
</template>

<script setup>
// No script needed for this simple component
</script>

<style scoped>
.navbar .nav-item {
  flex: 1;
  color: #777;
}

.navbar .nav-item.active {
  color: #6c1e9c;
  font-weight: 600;
}
</style>