<template>
  <div class="login-container">
    <!-- Main content -->
    <main class="main-content">
      <div class="login-card">
        <!-- Login form -->
        <h2 class="login-title">Log in to Centjesbank</h2>
        <!-- Success message -->
        <div v-if="showSuccessMessage" class="success-message m-4">
          Registration successful! Please log in with your credentials.
        </div>
        <!-- Error message -->
        <div v-if="error" class="alert alert-danger m-4">
          {{ error }}
        </div>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="text"
              id="email"
              v-model="email"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              required
            />
            <div class="mt-4">
              <a href="/BankingSystemFrontend/register" class="link"
                >Don't have an account yet? Register now!</a
              >
            </div>
          </div>

          <div class="login-actions">
            <button type="submit" class="btn-primary">Log in</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "../axios-auth";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const error = ref(null);
const showSuccessMessage = ref(false);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (route.query.registered === "true") {
    showSuccessMessage.value = true;
    window.history.replaceState({}, document.title, "/login");
  }
});

const handleLogin = async () => {
  error.value = null;
  try {
    const { token } = (
      await axios.post("/users/login", {
        email: email.value,
        password: password.value,
      })
    ).data;

    authStore.setToken(token);
    localStorage.setItem("token", token);
    router.push("/");
  } catch (err) {
    // Always show generic error message on any failure
    error.value = "User not found or invalid credentials";
    console.error("Login error:", err);
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f5fa;
  font-family: Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

.success-message {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #d6e9c6;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  flex: 1;
  z-index: 1;
  position: relative;
}

.login-card {
  background: #ffffffbb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  padding-bottom: 24px;
}

.login-title {
  color: #6c63ff;
  font-size: 28px;
  margin: 24px 24px 20px;
  font-weight: bold;
  text-align: center;
}

.form-group {
  margin: 0 24px 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #f4f5fa;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  border-color: #6c63ff;
  outline: none;
}

.remember-me {
  margin: 0 24px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-actions {
  margin: 0 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #5a4fe0;
}

.link {
  color: #6c63ff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.link:hover {
  color: #5a4fe0;
  text-decoration: underline;
}
</style>
