<template>
  <div class="container">
    <div v-if="isEmployeeOrAdmin">
      <nav aria-label="breadcrumb" class="breadcrumb-container">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <router-link to="/manage-users">Manage Users</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link :to="`/manage-user/${account?.ownerId}`">
              {{ account?.ownerFirstName }} {{ account?.ownerLastName }}
            </router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link :to="`/manage-user-accounts/${account?.ownerId}`"
              >Accounts</router-link
            >
          </li>
          <li class="breadcrumb-item active">
            <span>Transactions</span>
          </li>
        </ol>
      </nav>
    </div>
    <div v-else>
      <nav aria-label="breadcrumb" class="breadcrumb-container">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <router-link to="/view-account">View Account</router-link>
          </li>
          <li class="breadcrumb-item active">
            <span>Transactions</span>
          </li>
        </ol>
      </nav>
    </div>

    <div class="bg-light">
      <div class="transaction-overview">
        <h2 class="header-title">Transaction History</h2>

        <TransactionFilters
          @filter-changed="handleFilterChange"
          @reset-filters="resetFilters"
        />

        <div v-if="loading || accountLoading" class="loading-message">
          Loading transactions...
        </div>
        <div v-if="error || accountError" class="error-message">
          {{ error || accountError }}
        </div>

        <TransactionTable
          :current-account-id="currentAccountId"
          :transactions="transactions"
          :total-items="totalTransactions"
          :current-page="pagination.currentPage"
          :items-per-page="pagination.itemsPerPage"
          @page-changed="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TransactionFilters from "./TransactionFilters.vue";
import TransactionTable from "./TransactionTable.vue";
import { useTransactions } from "../../composables/useTransactions";
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import axios from "../../axios-auth";

export default {
  components: {
    TransactionFilters,
    TransactionTable,
  },
  setup() {
    const route = useRoute();
    const loggedInUserRole = ref(null);
    const account = ref(null);
    const accountLoading = ref(false);
    const accountError = ref(null);

    const currentAccountId = computed(() =>
      route.params.account_id ? Number(route.params.account_id) : null
    );

    const isEmployeeOrAdmin = computed(
      () =>
        loggedInUserRole.value === "ROLE_EMPLOYEE" ||
        loggedInUserRole.value === "ROLE_ADMINISTRATOR"
    );

    // Initialize the composable with the account-specific endpoint
    const apiEndpoint = computed(
      () => `/transactions/account/${currentAccountId.value}`
    );

    const {
      transactions,
      filters,
      pagination,
      loading,
      error,
      totalTransactions,
      resetFilters,
      handlePageChange,
      handleFilterChange,
      fetchTransactions,
    } = useTransactions(apiEndpoint.value);

    const fetchAccount = async () => {
      if (!currentAccountId.value) {
        accountError.value = "No account selected.";
        return;
      }

      accountLoading.value = true;
      accountError.value = null;

      try {
        const response = await axios.get(
          `/accounts/${currentAccountId.value}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        account.value = {
          id: response.data.id,
          iban: response.data.iban,
          balance: response.data.balance,
          type: response.data.type,
          status: response.data.status,
          ownerId: response.data.ownerId,
          ownerFirstName: response.data.ownerFirstName,
          ownerLastName: response.data.ownerLastName,
          ownerBsn: response.data.ownerBsn,
        };
      } catch (err) {
        console.error("Error fetching account:", err);
        accountError.value = "Failed to load account. Please try again later.";
      } finally {
        accountLoading.value = false;
      }
    };

    onMounted(async () => {
      loggedInUserRole.value = localStorage.getItem("auth_userRole");

      if (isEmployeeOrAdmin.value) {
        await fetchAccount();
      }

      if (currentAccountId.value) {
        fetchTransactions();
      } else {
        error.value = "No account selected.";
      }
    });

    return {
      transactions,
      filters,
      pagination,
      loading,
      error,
      totalTransactions,
      resetFilters,
      handlePageChange,
      handleFilterChange,
      loggedInUserRole,
      account,
      accountLoading,
      accountError,
      currentAccountId,
      isEmployeeOrAdmin,
    };
  },
};
</script>

<style scoped>
.transaction-overview {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

body {
  background-color: #333;
}
</style>
