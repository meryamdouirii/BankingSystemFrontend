<template>
  <div class="container">
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <router-link to="/">Home</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link to="/manage-users">Manage Users</router-link>
        </li>
        <li class="breadcrumb-item">
          <span>Accounts</span>
        </li>
      </ol>
    </nav>

    <main class="main-content">
      <div class="card">
        <div class="card-body">
          <div v-if="loading">Loading...</div>
          <div v-else-if="user && user.accounts.length">
            <h2 class="title">Accounts for {{ user?.firstName }} {{ user?.lastName }}</h2>
            <div v-if="user.accounts?.length">
              <div
                v-for="(account, index) in user.accounts"
                :key="account.id"
                class="account-row mb-4"
              >
                <div class="row g-3 align-items">
                  <!-- Account Section -->
                  <div class="col-md-6 d-flex">
                    <div class="card flex-fill">
                      <div class="card-body">
                        <AccountSection
                          :title="`Account ${index + 1}`"
                          :account="account"
                          :customer="user"
                          :accountType="account.type"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Absolute Limit -->
                  <div class="col-md-3 d-flex">
                    <div class="card flex-fill">
                      <div class="card-body d-flex flex-column align-items-center justify-content-center">
                        <label>Absolute Limit</label>
                        <input type="number" step="0.01" class="form-control form-control-sm" v-model="account.accountLimit" />
                        <div class="d-flex justify-content-center mt-3">
                          <button class="btn-small" @click="confirmAction">Update limit</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Deactivate Account -->
                  <div class="col-md-3 d-flex">
                    <div class="card flex-fill">
                      <div class="card-body d-flex flex-column align-items-center justify-content-center">
                        <label>DEACTIVATE ACCOUNT</label>
                        <div class="d-flex justify-content-center mt-3">
                          <button class="btn-small btn-red" @click="confirmAction">DEACTIVATE</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div v-else-if="error">{{ error }}</div>
          <div v-else class="no-accounts">
            <p>This user doesn't have any accounts yet.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AccountSection from '../customer/AccountSection.vue';
import { ref, onMounted, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import axios from '../../axios-auth';

const loading = ref(true);
const route = useRoute();
const userId = route.params.id;
const props = defineProps({
  user: Object
});

const user = ref(null);
const error = ref(null);

const fetchUser = async () => {
  try {
    const response = await axios.get(`users/${userId}`);
    user.value = response.data;
  } catch (err) {
      if (err.response && err.response.status === 401) {
        error.value = "Unauthorized access. Please log in.";
      } else if (err.response && err.response.status === 403) {
        error.value = "Forbidden access. You do not have permission to view this page.";
      } else if (err.response && err.response.status === 404) {
        error.value = "User not found.";
      } else {
        error.value = "Failed to load user data.";
      }
    console.error(err);
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  fetchUser();
});
</script>


