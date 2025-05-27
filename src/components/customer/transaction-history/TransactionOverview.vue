<template>
  <div class="bg-light">
    <div class="transaction-overview">
      <h2>Transaction History</h2>

      <TransactionFilters @filter-changed="handleFilterChange" />

      <TransactionTable :transactions="filteredTransactions" />
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
      filters: {
        dateRange: { start: null, end: null },
        amountCondition: null,
        amountValue: null,
        ibanDirection: null,
        ibanNumber: null,
      },
    };
  },
  computed: {
    filteredTransactions() {
      return this.transactions.filter((transaction) => {
        // Date range filter
        if (this.filters.dateRange.start && this.filters.dateRange.end) {
          const transactionDate = new Date(transaction.dateTime);
          const startDate = new Date(this.filters.dateRange.start);
          const endDate = new Date(this.filters.dateRange.end);

          if (transactionDate < startDate || transactionDate > endDate) {
            return false;
          }
        }

        // Amount filter
        if (this.filters.amountCondition && this.filters.amountValue) {
          const transactionAmount = transaction.amount;
          const filterAmount = parseFloat(this.filters.amountValue);

          switch (this.filters.amountCondition) {
            case "greater":
              if (transactionAmount <= filterAmount) return false;
              break;
            case "less":
              if (transactionAmount >= filterAmount) return false;
              break;
            case "equal":
              if (transactionAmount !== filterAmount) return false;
              break;
          }
        }

        // IBAN filter
        if (this.filters.ibanDirection && this.filters.ibanNumber) {
          const ibanToCheck =
            this.filters.ibanDirection === "from"
              ? transaction.sender_iban
              : transaction.receiver_iban;

          if (!ibanToCheck.includes(this.filters.ibanNumber)) {
            return false;
          }
        }

        return true;
      });
    },
  },
  methods: {
    handleFilterChange(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
    },
    async fetchTransactions() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get("/transactions/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token if needed
          },
        });

        // Transform API data to match your component's expected format
        this.transactions = response.data.map((transaction) => ({
          id: transaction.id,
          date: new Date(transaction.dateTime).toLocaleDateString("en-GB"), // Format as DD/MM/YYYY
          dateTime: transaction.dateTime, // Keep original for filtering
          description: transaction.description,
          from: transaction.sender_iban,
          to: transaction.receiver_iban,
          amount: transaction.amount,
          initiatorName: transaction.initiatorName,
        }));
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
