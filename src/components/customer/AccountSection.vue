<template>
  <div class="mb-4" v-if="account">
    <h5 class="header-title">{{ title }}</h5>
    <div class="account-card-wrapper position-relative">
      <div
        class="account-card card shadow-sm rounded-4 p-3 bg-gray"
        :class="{
          'has-overlay': account.status === 'CLOSED',
          'no-hover': account.status === 'CLOSED'
        }"
        @click="goToTransactionHistory(account)"
      >
        <!-- Overlay inside account-card -->
        <div v-if="account.status === 'CLOSED'" class="overlay"></div>

        <div class="d-flex justify-content-between align-items-center position-relative">
          <h6 class="text-primary mb-0">{{ accountType }}</h6>
          <span
            v-if="account.status === 'CLOSED'"
            class="closed-label badge position-absolute top-0 end-0 m-2"
          >
            Account is closed
          </span>
        </div>
        <div class="text-muted small">Name: {{ customer.firstName }} {{ customer.lastName }}</div>
        <div class="text-muted small">IBAN: <span class="text-monospace">{{ account.iban }}</span></div>
        <div class="fs-4 fw-bold mt-2">€ {{ account.balance.toFixed(2) }}</div>
      </div>
    </div>
  </div>

  <div v-else class="mb-4">
    <h5 class="header-title">{{ title }}</h5>
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
import { useRouter } from 'vue-router';

const router = useRouter();

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

const goToTransactionHistory = (account) => {
  if (account?.status !== 'CLOSED') {
    router.push(`/transactionhistory/${account.id}`);
  }
};
</script>

<style scoped>
.header-title {
  color: #6c63ff;
  font-weight: 600;
}
</style>

