<script setup>
import { ref } from "vue";
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
const authStore = useAuthStore();
const loginType = computed(() => authStore.loginType);
const userRole = computed(() => authStore.userRole);

const isLoggedIn = computed(() => !!authStore.token);
function logout() {
  authStore.logout();
}
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark nav">
    <div class="container-fluid">
      <ul class="navbar-nav me-auto mb-2 mb-md-0">
        <li
          v-if="
            userRole === 'ROLE_ADMINISTRATOR' || userRole === 'ROLE_EMPLOYEE'
          "
          class="nav-item"
        >
          <router-link
            to="/manage-users"
            class="nav-link"
            active-class="active"
          >
            Manage Users
          </router-link>

        </li>
             <li
          v-if="
            userRole === 'ROLE_ADMINISTRATOR' || userRole === 'ROLE_EMPLOYEE'
          "
          class="nav-item"
        >
          <router-link
            to="/all-transactions"
            class="nav-link"
            active-class="active"
          >
            All transactions
          </router-link>

        </li>
        <li v-if="userRole === 'ROLE_CUSTOMER' && loginType === 'account'" class="nav-item">
          <router-link to="/view-account" class="nav-link" active-class="active"
            >View Account</router-link
          >
        </li>
        <li v-if="userRole === 'ROLE_CUSTOMER' && loginType === 'atm'" class="nav-item">
          <router-link to="/atm/home" class="nav-link" active-class="active"
            >Start</router-link
          >
        </li>
        <li v-if="!isLoggedIn" class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active"
            >Login</router-link
          >
        </li>
        <li v-if="!isLoggedIn" class="nav-item">
          <router-link to="/register" class="nav-link" active-class="active"
            >Register</router-link
          >
        </li>
        <li v-if="isLoggedIn" class="nav-item">
          <router-link
            @click.prevent="logout"
            to="/login"
            class="nav-link"
            active-class="active"
          >
            Log Out
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
