<script setup>
import ProductListItem from "./ProductListItem.vue";
import { ref, onMounted } from 'vue'
import axios from '../../axios-auth'

const products = ref([])
const isLoading = ref(false)
const errorMessage = ref("")

// Load in the products in the mounted hook function, preferably using Axios
async function fetchProducts() {
  try {
    const response = await axios.get('/products')
    console.log(response);
    products.value = response.data
  } catch (error) {
    errorMessage.value = error
  }
}

async function loadProducts() {
  isLoading.value = true;
  try {
    await fetchProducts()
  }
  finally {
    isLoading.value = false
  }
}

async function updateProducts() {
  await fetchProducts()
}

onMounted(() => loadProducts())

</script>

<template>
  <section>
    <div class="container">
      <h2 class="mt-3 mt-lg-5">Products</h2>
      <button type="button" class="btn btn-primary mt-3" @click="$router.push('/createproduct');">
        Add product
      </button>
      <div v-if="errorMessage" class="alert alert-danger mt-5" role="alert">
        {{ errorMessage }}
      </div>
      <div v-if="isLoading" class="text-center mt-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="row mt-3">
        <ProductListItem @productDeleted="updateProducts" v-for="product in products" :key="product.id"
          :product="product" >

          TEST

          </ProductListItem>

      </div>
    </div>
  </section>
</template>

<style></style>