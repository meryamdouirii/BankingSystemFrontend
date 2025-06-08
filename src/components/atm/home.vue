<template>
  <div class="atm-home-container">
    <main class="main-content text-center">
      <div class="atm-card">
        <h2 class="header-title mb-4">ATM</h2>

        <div class="button-row">
          <button class="btn-large" @click="goToDeposit">Deposit</button>
          <button class="btn-large" @click="goToWithdraw">Withdraw</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goToDeposit = () => {
  router.push("/atm/deposit");
};

const goToWithdraw = () => {
  router.push("/atm/withdraw");
};
</script>
