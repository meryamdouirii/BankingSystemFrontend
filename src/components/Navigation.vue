<script setup></script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark nav">
    <div class="container-fluid">
      <ul class="navbar-nav me-auto mb-2 mb-md-0">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active"
            >Home</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active"
            >Login</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/register" class="nav-link" active-class="active"
            >Register</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            to="/manage-users"
            class="nav-link"
            active-class="active"
          >
            Manage Users
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/view-account" class="nav-link" active-class="active"
            >View Account</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<style>
.nav {
  background-color: #6c63ff;
}
</style>
