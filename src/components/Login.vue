<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h3 class="card-title mb-4 text-center">Login</h3>
                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" id="username" v-model="username" class="form-control" required />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" id="password" v-model="password" class="form-control" required />
                            </div>
                            <button type="submit" class="btn btn-primary w-100">
                                Login
                            </button>
                        </form>
                        <div v-if="error" class="alert alert-danger mt-3">
                            {{ error }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../axios-auth'

const username = ref('')
const password = ref('')
const error = ref(null)

const handleLogin = async () => {
    error.value = null
    try {
        const response = await axios.post('users/login', {
            username: username.value,
            password: password.value
        })
        // Handle successful login
        console.log('Login successful:', response.data)
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + response.data;

    } catch (err) {
        error.value =
            err.response?.data?.message || 'Login failed. Please try again.'
        console.error('Login error:', err)
    }
}
</script>