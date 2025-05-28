<template>
  <div class="mb-4" v-if="account">
    <h5 class="text-white">{{ title }}</h5>
  </div>

  <div v-else class="mb-4">
    <h5 class="text-white">{{ title }}</h5>
    <div class="card shadow-sm rounded-4 p-3 text-center bg-gray">
      <p>No {{ title.toLowerCase() }} account found</p>
    </div>
  </div>
</template>



<style scoped>
.overlay-container {
  position: relative;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(33, 37, 41, 0.2); /* Less dark */
  border-radius: 1rem;
  z-index: 1;
  pointer-events: none;
}

.closed-label {
  background-color: red; ;
  z-index: 2;
}

</style>
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

