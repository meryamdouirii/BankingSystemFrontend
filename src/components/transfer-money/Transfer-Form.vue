<template>
  <div class="container" style="background-color: white; min-height: 100vh">
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <router-link to="/">Home</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link to="/view-account">View Account</router-link>
        </li>
        <li class="breadcrumb-item active">
          <span>Transfer Money</span>
        </li>
      </ol>
    </nav>
    <div class="mx-auto p-4 border rounded shadow" style="max-width: 600px">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0 text-black">Transfer money</h4>
        <router-link to="/view-account" class="btn btn-link text-black p-0"
          >Close</router-link
        >
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold text-black">From account</label>
        <select
          v-if="isCustomer"
          v-model="selectedAccount"
          class="form-select border-black text-black mb-2"
        >
          <option
            v-for="account in userAccounts"
            :key="account.id"
            :value="account"
          >
            {{
              account.type === "CHECKING"
                ? "Checking Account"
                : "Savings Account"
            }}
            - €{{ account.balance.toFixed(2) }}
          </option>
        </select>
        <div v-if="selectedAccount" class="border rounded p-3">
          <div class="fw-bold text-black">
            Centjesbank
            {{
              selectedAccount.type === "CHECKING"
                ? "Checking Account"
                : "Savings Account"
            }}
          </div>
          <div class="d-flex justify-content-between text-black">
            <small
              >{{ customer.firstName }} {{ customer.lastName }} -
              {{ selectedAccount.iban }}</small
            >
            <strong>€{{ selectedAccount.balance.toFixed(2) }}</strong>
          </div>
        </div>
      </div>

      <!-- To Account section -->
      <div class="mb-3">
        <label class="form-label fw-bold text-black">To account</label>
        <select
          v-model="toAccount"
          class="form-select border-black text-black mb-2"
        >
          <option value="">Select an account</option>
          <optgroup label="My accounts">
            <option
              v-for="account in userAccounts.filter(
                (acc) => acc.id !== selectedAccount?.id
              )"
              :key="account.id"
              :value="account"
            >
              {{
                account.type === "CHECKING"
                  ? "Checking Account"
                  : "Savings Account"
              }}
              - €{{ account.balance.toFixed(2) }}
            </option>
          </optgroup>
          <optgroup label="Other accounts">
            <option value="external">Enter external account details</option>
          </optgroup>
        </select>
      </div>

      <!-- External account details - only show when "Enter external account details" is selected -->
      <div v-if="toAccount === 'external'" class="mb-3">
        <label class="form-label fw-bold text-black">Recipient IBAN</label>
        <div class="input-group">
          <input
            type="text"
            v-model="recipientAccount"
            class="form-control border-black text-black"
            placeholder="Recipient IBAN"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="openAddressBook"
          >
            Address Book
          </button>
        </div>
        <div v-if="recipientName" class="mt-2 text-black">
          <small><strong>Recipient:</strong> {{ recipientName }}</small>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col">
          <label class="form-label text-black fw-bold">Amount</label>
          <input
            type="number"
            v-model="amount"
            class="form-control border-black text-black"
            :class="{ 'border-danger': isAmountTooHigh }"
            placeholder="€ 0,00"
          />
          <div v-if="isAmountTooHigh" class="text-danger mt-1">
            <small
              >⚠️ Insufficient funds. Your current balance is €{{
                selectedAccount?.balance.toFixed(2)
              }}
              and your limit is {{ selectedAccount.accountLimit }}</small
            >
          </div>
        </div>
        <div class="col">
          <label class="form-label text-black fw-bold">Currency</label>
          <select class="form-select border-black text-black">
            <option selected>EUR Euro</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label text-black fw-bold">Description</label>
        <textarea
          v-model="description"
          class="form-control border-black text-black"
          rows="3"
          maxlength="140"
        ></textarea>
      </div>

      <button
        type="button"
        class="btn w-100 text-white"
        :class="{ 'opacity-50': !isFormValid }"
        :disabled="!isFormValid"
        style="background-color: #6c63ff"
        @click="handleTransfer"
      >
        Next
      </button>
    </div>
  </div>
  <CustomerSearchModal
    v-if="isAddressBookOpen"
    @close="closeAddressBook"
    @customer-selected="handleCustomerSelected"
  />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import axios from "../../axios-auth";
import CustomerSearchModal from "../customer/CustomerSearchModal.vue";
import router from "@/router";

const authStore = useAuthStore();
const customer = ref({});
const userAccounts = ref([]);
const selectedAccount = ref(null);
const toAccount = ref(null);
const amount = ref("");
const loading = ref(true);
const error = ref(null);
const recipientName = ref("");
const recipientAccount = ref("");
const description = ref("");
const isAddressBookOpen = ref(false);

const openAddressBook = () => {
  isAddressBookOpen.value = true;
};

const handleCustomerSelected = (account) => {
  recipientAccount.value = account.iban;
  recipientName.value = account.userName || ""; // only if you want to use the name later
  isAddressBookOpen.value = false; // close the modal after selection
};

const closeAddressBook = () => {
  isAddressBookOpen.value = false;
};

const isCustomer = computed(() => {
  return authStore.userRole === "ROLE_CUSTOMER";
});

const isAmountTooHigh = computed(() => {
  if (!amount.value || !selectedAccount.value) return false;
  const resultingBalance =
    selectedAccount.value.balance - parseFloat(amount.value);
  return resultingBalance < selectedAccount.value.accountLimit;
});

const isFormValid = computed(() => {
  if (!selectedAccount.value || !amount.value || isAmountTooHigh.value)
    return false;

  if (toAccount.value === "external") {
    return !!recipientName.value && !!recipientAccount.value;
  }

  return !!toAccount.value;
});

const handleTransfer = async () => {
  try {
    const transactionData = {
      sender_account: { id: selectedAccount.value.id },
      amount: parseFloat(amount.value),
      description: description.value,
      initiator: { id: authStore.userId }, // sending as object
    };

    transactionData.transaction_type =
      toAccount.value === "external" ? "PAYMENT" : "INTERNAL_TRANSFER";

    transactionData.reciever_account =
      toAccount.value === "external"
        ? { iban: recipientAccount.value }
        : { id: toAccount.value.id };

    const response = await axios.post("/transactions", transactionData);
    router.push("/view-account");
    // Handle successful transfer
    console.log("Transfer successful:", response.data);
    // You can add redirection or success message here
  } catch (err) {
    error.value =
      "Transfer failed: " + (err.response?.data?.message || err.message);
    console.error("Transfer error:", err);
  }
};

const fetchUserData = async () => {
  try {
    loading.value = true;
    if (!authStore.userId) {
      error.value = "User not authenticated";
      return;
    }

    const response = await axios.get(`/users/${authStore.userId}`);
    customer.value = response.data;
    userAccounts.value = response.data.accounts || [];

    // Selecteer het eerste account als default
    if (userAccounts.value.length > 0) {
      selectedAccount.value = userAccounts.value[0];
    }
  } catch (err) {
    error.value = "Could not load account information";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (isCustomer.value) {
    fetchUserData();
  }
});
</script>

<style scoped>
.border-black {
  border-color: black !important;
}

.text-black {
  color: black !important;
}

.border-danger {
  border-color: #dc3545 !important;
}

.text-danger {
  color: #dc3545 !important;
}
</style>
