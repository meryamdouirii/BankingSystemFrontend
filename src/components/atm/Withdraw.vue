<template>
  <div class="atm-home-container">
    <main class="main-content text-center">
      <div class="atm-card">
        <p class="breadcrumb-item">
          <RouterLink to="/atm/home"><- Go Back</RouterLink>
        </p>

        <div v-if="error" class="alert alert-danger m-4">
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success m-4">
          {{ success }}
        </div>

        <h2 class="header-title mb-4">Withdraw from your account</h2>

        <AccountSection
          class="no-hover"
          title=""
          :account="checkingAccount"
          :customer="customer"
          accountType="Centjesbank Checking Account"
        />
        <div v-if="checkingAccount">
        <div class="mb-3">
          <label for="withdraw-amount" class="form-label"
            >Withdraw amount</label
          >
          <input
            id="withdraw-amount"
            type="number"
            step="0.01"
            min="0"
            v-model.number="amount"
            class="form-control"
            placeholder="Enter amount"
          />
        </div>
        <div class="button-row">
          <button class="btn-small" @click="withdraw">Withdraw</button>
        </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import axios from "../../axios-auth";
import AccountSection from "../customer/AccountSection.vue";

const authStore = useAuthStore();
const checkingAccount = ref(null);
const loading = ref(true);
const error = ref(null);
const success = ref(null);
const customer = ref(null);
const amount = ref(0);

const fetchUserData = async () => {
  try {
    loading.value = true;
    if (!authStore.userId) {
      success.value = null;
      error.value = "User not authenticated";
      return;
    }

    const response = await axios.get(`/users/${authStore.userId}`);
    customer.value = response.data;

    const checking = response.data.accounts.find(
      (account) => account.type === "CHECKING"
    );
    if (checking) {
      checkingAccount.value = checking;
    }
  } catch (err) {
    success.value = null;
    error.value = "Could not load account information";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const withdraw = async () => {
  if (amount.value <= 0) {
    success.value = null;
    error.value = "Please enter an amount greater than zero.";
    return;
  }

  error.value = null;

  const transactionData = {
    sender_account: { id: checkingAccount.value.id },
    amount: amount.value,
    description: "Withdrawal via ATM",
    transaction_type: "WITHDRAWAL",
    initiator: { id: customer.value.id },
  };

  try {
    const response = await axios.post("/transactions", transactionData);
    console.log("Withdrawal successful:", response.data);
    error.value = null;
    success.value = "Withdrawal successful!";

    // Update balance
    checkingAccount.value.balance -= amount.value;

    // Reset amount
    amount.value = 0;
  } catch (err) {
    success.value = null;

    let backendMessage = "An unexpected error occurred.";
    if (err.response) {
      if (err.response.data?.message) {
        backendMessage = err.response.data.message;
      } else if (typeof err.response.data === "string") {
        backendMessage = err.response.data;
      }
    } else {
      backendMessage = err.message;
    }

    // Strip technical prefixes if present
    backendMessage = backendMessage
      .replace(/^Internal Server Error:\s*/i, "")
      .replace(/^\d{3}\s+[A-Z_]+\s+/i, ""); // Remove HTTP status codes like "403 FORBIDDEN "

    // Remove surrounding quotes if present
    backendMessage = backendMessage.replace(/^["']|["']$/g, "");

    error.value = "Withdrawal failed: " + backendMessage;
    console.error("Withdrawal error:", err);
  }
};

onMounted(() => {
  fetchUserData();
});
</script>
