<template>
  <div class="bg-light">
    <div class="transaction-overview">
      <h2>Transaction History</h2>

      <TransactionFilters
        @filter-changed="handleFilterChange"
        @reset-filters="resetFilters"
      />

      <div v-if="loading" class="loading-message">Loading transactions...</div>
      <div v-if="error" class="error-message">{{ error }}</div>

      <TransactionTable
        :transactions="transactions"
        :total-items="totalTransactions"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @page-changed="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import TransactionFilters from "./TransactionFilters.vue";
import TransactionTable from "./TransactionTable.vue";
import axios from "../../../axios-auth";

export default {
  components: {
    TransactionFilters,
    TransactionTable,
  },
  data() {
    return {
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

        const response = await axios.get("/transactions/my", {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Transform API data
        this.transactions = response.data.content.map((transaction) => ({
          id: transaction.id,
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
  },
};
</script>

<style scoped>
.transaction-overview {
  font-family: Arial, sans-serif;
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
