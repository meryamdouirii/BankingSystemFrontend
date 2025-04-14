<script setup>
import { ref, defineProps, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter();

const isLoading = ref(false)
const errorMessage = ref("")

const product = ref({
    id: 0,
    name: "",
    price: "",
    description: "",
    image: "",
    category_id: 0,
});
const categories = ref([]);

const props = defineProps({
    id: Number
})

// Load in the categories in the mounted hook function, preferably using Axios
// Then show the categories in the dropdown

async function fetchCategories() {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost/categories')
    categories.value = response.data
  } catch (error) {
    errorMessage.value = error
  }
  finally {
    isLoading.value = false
  }
}

async function fetchProduct() {
  try {
    const response = await axios.get(`http://localhost/products/${props.id}`)
    product.value = response.data
  } catch (error) {
    errorMessage.value = error
  }
}

onMounted(() =>  {
  fetchCategories()
  fetchProduct()
})

async function putProduct() {
    isLoading.value = true;
  try {
    const response = await axios.put(`http://localhost/products/${props.id}`, product.value)
  } catch (error) {
    errorMessage.value = error
  }
  finally {
    isLoading.value = false
    router.push('/products')
  }
}

// Write a function that does a PUT request to update the product in the backend
// Call the function from the button click

</script>

<template>
    <section>
      <div class="container">
        <form ref="form">
          <h2 class="mt-3 mt-lg-5">Edit a product</h2>
          <h5 class="mb-4"></h5>
  
          <div class="input-group mb-3">
            <span class="input-group-text">Name</span>
            <input type="text" class="form-control" v-model="product.name" />
          </div>
  
          <div class="input-group mb-3">
            <span class="input-group-text">Price</span>
            <input type="number" class="form-control" v-model="product.price" />
          </div>
  
          <div class="input-group mb-3">
            <span class="input-group-text">Description</span>
            <textarea
              class="form-control"
              v-model="product.description"
            ></textarea>
          </div>
  
          <div class="input-group mb-3">
            <span class="input-group-text">Image URL</span>
            <input type="text" class="form-control" v-model="product.image" />
          </div>
  
          <div class="input-group mb-3">
            <span class="input-group-text">Category</span>
            <select class="form-select" v-model="product.category_id">
                        <option value="0" disabled default>Select a category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                    </select>
          </div>
  
          <div class="input-group mt-4">
            <button @click="putProduct" type="button" class="btn btn-primary">
              Save changes
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="$router.push('/products')"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  </template>
    
  <style>
  </style>