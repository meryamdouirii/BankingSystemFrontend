<template>
  <div class="container-fluid account-bg pb-5">
    <div class="container py-4">
      <template v-if="hasAccounts">
        <ActionButtons />
        <OverviewHeader />
        <TotalBalanceCard :balance="combinedBalance" />
        <AccountSection
          title="Payment"
          :account="checkingAccount"
          :customer="customer"
          accountType="Centjesbank Checking Account"
        />
        <AccountSection
          title="Savings"
          :account="savingsAccount"
          :customer="customer"
          accountType="Centjesbank Savings"
        />
      </template>
      <template v-else>
        <WelcomeMessage :customer="customer" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '../../axios-auth';
import { useRoute } from 'vue-router';
import OverviewHeader from './OverviewHeader.vue';
import TotalBalanceCard from './TotalBalanceCard.vue';
import ActionButtons from './ActionButtons.vue';
import AccountSection from './AccountSection.vue';
import WelcomeMessage from './WelcomeMessage.vue';

const route = useRoute();
const customer = ref({});
const checkingAccount = ref(null);
const savingsAccount = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchUserData = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`users/${route.params.id || 10}`);
    customer.value = response.data;

    checkingAccount.value = response.data.accounts?.find(acc => acc.type === 'CHECKING');
    savingsAccount.value = response.data.accounts?.find(acc => acc.type === 'SAVINGS');

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

const hasAccounts = computed(() => {
  return customer.value.accounts && customer.value.accounts.length > 0;
});

onMounted(fetchUserData);
</script>

<style scoped>
.account-bg {
  background: linear-gradient(135deg, #c494e1 0%, #a259c6 100%);
  min-height: 100vh;
}
</style>