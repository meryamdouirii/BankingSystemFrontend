<template>
    <div class="container py-5" style="background-color: white; min-height: 100vh;">
      <div class="mx-auto p-4 border rounded shadow" style="max-width: 600px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="mb-0 text-black">Transfer money</h4>
          <router-link to="/view-account" class="btn btn-link text-black p-0">Close</router-link>
        </div>
  
        <div class="mb-3">
          <label class="form-label fw-bold text-black">From account</label>
          <select v-if="isCustomer" v-model="selectedAccount" class="form-select border-black text-black mb-2">
            <option v-for="account in userAccounts" :key="account.id" :value="account">
              {{ account.type === 'CHECKING' ? 'Checking Account' : 'Savings Account' }} - €{{ account.balance.toFixed(2) }}
            </option>
          </select>
          <div v-if="selectedAccount" class="border rounded p-3">
            <div class="fw-bold text-black">Centjesbank {{ selectedAccount.type === 'CHECKING' ? 'Checking Account' : 'Savings Account' }}</div>
            <div class="d-flex justify-content-between text-black">
              <small>{{ customer.firstName }} {{ customer.lastName }} - {{ selectedAccount.iban }}</small>
              <strong>€{{ selectedAccount.balance.toFixed(2) }}</strong>
            </div>
          </div>
        </div>

        <!-- To Account section -->
        <div class="mb-3">
          <label class="form-label fw-bold text-black">To account</label>
          <select v-model="toAccount" class="form-select border-black text-black mb-2">
            <option value="">Select an account</option>
            <optgroup label="My accounts">
              <option v-for="account in userAccounts.filter(acc => acc.id !== selectedAccount?.id)" 
                      :key="account.id" 
                      :value="account">
                {{ account.type === 'CHECKING' ? 'Checking Account' : 'Savings Account' }} - €{{ account.balance.toFixed(2) }}
              </option>
            </optgroup>
            <optgroup label="Other accounts">
              <option value="external">Enter external account details</option>
            </optgroup>
          </select>
        </div>

        <!-- External account details - only show when "Enter external account details" is selected -->
        <div v-if="toAccount === 'external'" class="mb-3">
          <input 
            type="text" 
            v-model="recipientName"
            class="form-control mb-2 border-black text-black" 
            placeholder="Recipient name"
          >
          <input 
            type="text" 
            v-model="recipientAccount"
            class="form-control border-black text-black" 
            placeholder="Recipient account number"
          >
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
            >
            <div v-if="isAmountTooHigh" class="text-danger mt-1">
              <small>⚠️ Insufficient funds. Your current balance is €{{ selectedAccount?.balance.toFixed(2) }}</small>
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
          style="background-color: #6c63ff;"
          @click="handleTransfer"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useAuthStore } from '../../stores/auth';
  import axios from '../../axios-auth';

  const authStore = useAuthStore();
  const customer = ref({});
  const userAccounts = ref([]);
  const selectedAccount = ref(null);
  const toAccount = ref(null);
  const amount = ref('');
  const loading = ref(true);
  const error = ref(null);
  const recipientName = ref('');
  const recipientAccount = ref('');
  const description = ref('');

  const isCustomer = computed(() => {
    return authStore.userRole === 'ROLE_CUSTOMER';
  });

  const isAmountTooHigh = computed(() => {
    if (!amount.value || !selectedAccount.value) return false;
    return parseFloat(amount.value) > selectedAccount.value.balance;
  });

  const isFormValid = computed(() => {
    if (!selectedAccount.value || !amount.value || isAmountTooHigh.value) return false;
    
    if (toAccount.value === 'external') {
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
      initiator: { id: authStore.userId } // <- stuur als object
};

      // Automatically determine transaction type based on the toAccount value
      if (toAccount.value === 'external') {
      transactionData.transaction_type = 'PAYMENT';
      transactionData.reciever_account = recipientAccount.value;
      } else {
      transactionData.transaction_type = 'INTERNAL_TRANSFER';
      transactionData.reciever_account = { id: toAccount.value.id };
      }

      const response = await axios.post('/transactions', transactionData);
      // Handle successful transfer
      console.log('Transfer successful:', response.data);
      // Redirect or show success message
    } catch (err) {
      error.value = "Transfer failed: " + (err.response?.data?.message || err.message);
      console.error('Transfer error:', err);
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
  