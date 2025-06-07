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
                <h2 class="header-title mb-4">Deposit from your account</h2>
                <AccountSection class="no-hover" title="" :account="checkingAccount" :customer="customer"
                    accountType="Centjesbank Checking Account" />
                <div class="mb-3">
                    <label for="deposit-amount" class="form-label">Deposit amount</label>
                    <input id="deposit-amount" type="number" step="0.01" min="0" v-model.number="amount"
                        class="form-control" placeholder="Enter amount" />
                </div>

                <!-- Deposit knop -->
                <div class="button-row">
                    <button class="btn-small" @click="deposit">Deposit</button>
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

        // Selecteer het account met accountType = 'CHECKING' als default
        const checking = response.data.accounts.find(account => account.type === 'CHECKING');
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
const deposit = async () => {
    if (amount.value <= 0) {
        success.value = null;
        error.value = "Please enter an amount greater than zero.";
        return;
    }

    error.value = null;

    const transactionData = {
        reciever_account: { id: checkingAccount.value.id },
        amount: amount.value,
        description: 'Deposit via ATM',
        transaction_type: 'DEPOSIT',
        initiator: { id: customer.value.id }
    };

    try {
        const response = await axios.post('/transactions', transactionData);
        console.log('Deposit successful:', response.data);
        error.value = null;
        success.value = "Deposit successful!";

        // Update het lokale account balance als dat nodig is
        checkingAccount.value.balance += amount.value;

        // Reset het bedrag na succesvolle storting
        amount.value = 0;
    } catch (err) {
        success.value = null;
        error.value = "Deposit failed: " + (err.response?.data?.message || err.message);
        console.error('Deposit error:', err);
    }
};
onMounted(() => {
    fetchUserData();
});
</script>
