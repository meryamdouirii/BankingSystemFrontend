<template>
  <div class="login-container">
    <!-- Main content -->
    <main class="main-content">
      <div class="login-card">
        <!-- Login form -->
        <h2 class="header-title text-center mt-3">
          {{ isAtm ? 'Log in to the Atm' : 'Log in to CentjesBank' }}
        </h2>

        <div class="switch-container">
          <span :class="{ 'text-purple': !isAtm }" class="switch-label">Account</span>

          <label class="switch">
            <input type="checkbox" id="toggleSwitch" v-model="isAtm" />
            <span class="slider round"></span>
          </label>

          <span :class="{ 'text-purple': isAtm }" class="switch-label">Atm</span>

        </div>
        <!-- Success message -->
        <div v-if="showSuccessMessage" class="success-message m-4">
          Registration successful! Please log in with your credentials.
        </div>
        <!-- Error message -->
        <div v-if="error" class="alert alert-danger m-4">
          {{ error }}
        </div>
        <div class="d-flex justify-content-center align-items-center">
          <div class="w-100" style="max-width: 400px;">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" id="email" v-model="email" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" v-model="password" class="form-control" required />
              </div>

              <div class="mb-3">
                <a href="/BankingSystemFrontend/register" class="link">Don't have an account yet? Register now!</a>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn-small">Log in</button>
              </div>
            </form>
          </div>
        </div>

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
const isAtm = ref(false);

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

    authStore.setToken(token, isAtm.value ? "atm" : "account");
    localStorage.setItem("token", token);

    if (isAtm.value && localStorage.getItem("auth_userRole") === "ROLE_CUSTOMER"){
      router.push("/atm/home");
    }else{
      router.push("/");
    }
  } catch (err) {
    // Always show generic error message on any failure
    error.value = "User not found or invalid credentials";
    console.error("Login error:", err);
  }
};
</script>
<style scoped></style>