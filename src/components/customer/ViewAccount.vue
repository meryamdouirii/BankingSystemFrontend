<template>
  <div class="container-fluid account-bg pb-5">
    <div class="container py-4">
      <h1 class="text-white fw-semibold mb-4">Overview</h1>
      <div class="card shadow-sm rounded-4 p-3 mb-4 bg-white">
      <div class="text-muted small">Total balance</div>
      <div class="fs-3 fw-bold">€ {{ combinedBalance.toFixed(2) }}</div>
  </div>

      <!-- Action buttons -->
      <div class=" justify-content-between gap-2 mb-4">
        <button class="btn btn-primary flex-fill">Transfer money</button>
      </div>

      <!-- Payment account -->
      <div class="mb-4" v-if="checkingAccount">
        <h5 class="text-white">Payment</h5>
        <div class="card shadow-sm rounded-4 p-3">
          <h6 class="text-primary">Centjesbank Checking Account</h6>
          <div class="text-muted small">Name: {{ customer.firstName }} {{ customer.lastName }}</div>
          <div class="text-muted small">IBAN: <span class="text-monospace">{{ checkingAccount.iban }}</span></div>
          <div class="fs-4 fw-bold mt-2">€ {{ checkingAccount.balance.toFixed(2) }}</div>
        </div>
      </div>
      <div v-else class="mb-4">
        <h5 class="text-white">Payment</h5>
        <div class="card shadow-sm rounded-4 p-3 text-center">
          <p>No payment account found</p>
          <!-- <button class="btn btn-primary">Open account</button> -->
        </div>
      </div>

      <!-- Savings -->
      <div class="mb-5" v-if="savingsAccount">
        <h5 class="text-white">Savings</h5>
        <div class="card shadow-sm rounded-4 p-3">
          <h6 class="text-primary">Centjesbank Savings</h6>
          <div class="text-muted small">Name: {{ customer.firstName }} {{ customer.lastName }}</div>
          <div class="text-muted small">IBAN: <span class="text-monospace">{{ savingsAccount.iban }}</span></div>
          <div class="fs-4 fw-bold mt-2">€ {{ savingsAccount.balance.toFixed(2) }}</div>
        </div>
      </div>
      <div v-else class="mb-5">
        <h5 class="text-white">Savings</h5>
        <div class="card shadow-sm rounded-4 p-3 text-center">
          <p>No savings account found</p>
          <!-- <button class="btn btn-primary">Open account</button> -->
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '../../axios-auth';
import { useRoute } from 'vue-router';

const route = useRoute();
const customer = ref({});
const checkingAccount = ref(null);
const savingsAccount = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchUserData = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`users/${route.params.id || 1}`);
    customer.value = response.data;
    
    // Filter accounts by type
    checkingAccount.value = response.data.accounts.find(acc => acc.type === 'CHECKING');
    savingsAccount.value = response.data.accounts.find(acc => acc.type === 'SAVINGS');
    
  } catch (err) {
    error.value = "Could not load account information";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const combinedBalance = computed(() => {
  if (!customer.value.accounts) return 0;
  return customer.value.accounts.reduce((total, account) => total + account.balance, 0);
});

onMounted(fetchUserData);
</script>

<style scoped>
.account-bg {
  background: linear-gradient(135deg, #c494e1 0%, #a259c6 100%);
  min-height: 100vh;
}

.navbar .nav-item {
  flex: 1;
  color: #777;
}

.navbar .nav-item.active {
  color: #6c1e9c;
  font-weight: 600;
}
</style>