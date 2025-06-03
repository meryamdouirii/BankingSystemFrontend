<template>
  <div class="container">
    <div v-if="isEmployeeOrAdmin">
      <nav aria-label="breadcrumb" class="breadcrumb-container">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <router-link to="/">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/manage-users">Manage Users</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link :to="`/manage-user/${this.account.ownerId}`">{{ this.account.ownerFirstName }} {{ this.account.ownerLastName }}</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link :to="`/manage-user-accounts/${this.account.ownerId}`">Accounts</router-link>
          </li>
          <li class="breadcrumb-item">
            <span>Transactions</span>
          </li>
        </ol>
      </nav>
    </div>
    <div v-else>
      <nav aria-label="breadcrumb" class="breadcrumb-container">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <router-link to="/">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/view-account">View Account</router-link>
          </li>
          <li class="breadcrumb-item">
            <span>Transactions</span>
          </li>
        </ol>
      </nav>
    </div>




    <div class="bg-light">
      <div class="transaction-overview">
        <h2>Transaction History</h2>

        <TransactionFilters @filter-changed="handleFilterChange" @reset-filters="resetFilters" />

        <div v-if="loading" class="loading-message">Loading transactions...</div>
        <div v-if="error" class="error-message">{{ error }}</div>

        <TransactionTable :current-account-id="Number($route.params.account_id)" :transactions="transactions"
          :total-items="totalTransactions" :current-page="currentPage" :items-per-page="itemsPerPage"
          @page-changed="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script>
import TransactionFilters from "./TransactionFilters.vue";
import TransactionTable from "./TransactionTable.vue";
import axios from "../../axios-auth";



export default {
  components: {
    TransactionFilters,
    TransactionTable,
  },
  data() {
    return {
      loggedInUserRole: null,
      account: null,
      currentAccountId: Number(this.$route.params.account_id) || null,
      transactions: [],
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalTransactions: 0,
      filters: {
        startDate: null,
        endDate: null,
        amount: null,
        amountFilterType: null,
        iban: null,
      },
    };
  },
  computed: {
    isEmployeeOrAdmin() {
      return this.loggedInUserRole === "ROLE_EMPLOYEE" || this.loggedInUserRole === "ROLE_ADMINISTRATOR";
    }
  },
  methods: {
    async handleFilterChange(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
      this.currentPage = 1; // Reset to first page when filters change
      await this.fetchTransactions();
    },

    resetFilters() {
      this.filters = {
        startDate: null,
        endDate: null,
        amount: null,
        amountFilterType: null,
        iban: null,
      };
      this.currentPage = 1;
      this.fetchTransactions();
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.fetchTransactions();
    },
    async fetchAccount() {
      this.loading = true;
      this.error = null;

      try {
        const accountId = this.$route.params.account_id ? Number(this.$route.params.account_id) : null;

        if (!accountId) {
          this.error = "No account selected.";
          this.loading = false;
          return;
        }

        const response = await axios.get(`/accounts/${accountId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        this.account = {
          id: response.data.id,
          iban: response.data.iban,
          balance: response.data.balance,
          type: response.data.type,
          status: response.data.status,
          ownerId: response.data.ownerId,
          ownerFirstName: response.data.ownerFirstName,
          ownerLastName: response.data.ownerLastName,
          ownerBsn: response.data.ownerBsn,
          iban: response.data.iban,
        };
      } catch (err) {
        console.error("Error fetching account:", err);
        this.error = "Failed to load account. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
    async fetchTransactions() {
      this.loading = true;
      this.error = null;

      try {
        // Convert amount to number if it exists
        const amount = this.filters.amount ? Number(this.filters.amount) : null;

        // Build query parameters
        const params = {
          page: this.currentPage - 1, // Spring pages are 0-indexed
          size: this.itemsPerPage,
          ...(this.filters.startDate && { startDate: this.filters.startDate }),
          ...(this.filters.endDate && { endDate: this.filters.endDate }),
          ...(amount && { amount: amount }),
          ...(this.filters.amountFilterType && {
            amountFilterType: this.filters.amountFilterType.toUpperCase(),
          }),
          ...(this.filters.iban && {
            iban: this.filters.iban,
          }),
        };

        const accountId = this.$route.params.account_id ? Number(this.$route.params.account_id) : null;

        if (!accountId) {
          this.error = "No account selected.";
          this.loading = false;
          return;
        }

        const endpoint = `/transactions/account/${accountId}`;

        const response = await axios.get(endpoint, {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Transform API data
        this.transactions = response.data.content.map((transaction) => ({
          id: transaction.id,
          senderId: transaction.sender_id,
          date: new Date(transaction.dateTime).toLocaleDateString("en-GB"),
          dateTime: transaction.dateTime,
          description: transaction.description,
          senderIban: transaction.sender_iban,
          receiverIban: transaction.receiver_iban,
          amount: transaction.amount,
          initiatorName: transaction.initiatorName,
        }));

        this.totalTransactions = response.data.totalElements;
      } catch (err) {
        console.error("Error fetching transactions:", err);
        this.error = "Failed to load transactions. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchTransactions();
    this.loggedInUserRole = localStorage.getItem("auth_userRole");
    if(this.isEmployeeOrAdmin){
          this.fetchAccount();
    }

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
