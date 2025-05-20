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

export default {
  components: {
    TransactionFilters,
    TransactionTable,
  },
  data() {
    return {
      transactions: [
        {
          date: "20/05/2023",
          description: "Monthly rent payment",
          from: "NL91ABNA0417164390",
          to: "NL201NGB0801234567",
          amount: "€500.00",
        },
        {
          date: "15/05/2023",
          description: "Grocery shopping",
          from: "NL201NGB0801234567",
          to: "NL91ABNA0417164390",
          amount: "€35.50",
        },
        {
          date: "10/05/2023",
          description: "Salary payment",
          from: "NL91ABNA0417164390",
          to: "DE89378408440532813000",
          amount: "€1200.00",
        },
        {
          date: "05/05/2023",
          description: "Online purchase",
          from: "NL201NGB0801234567",
          to: "FR7638086808011234567890189",
          amount: "€75.20",
        },
        {
          date: "28/04/2023",
          description: "Insurance payment",
          from: "FR7638086808011234567890189",
          to: "NL91ABNA0417164390",
          amount: "€250.00",
        },
      ],
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
          const transactionDate = new Date(
            transaction.date.split("/").reverse().join("-")
          );
          const startDate = new Date(this.filters.dateRange.start);
          const endDate = new Date(this.filters.dateRange.end);

          if (transactionDate < startDate || transactionDate > endDate) {
            return false;
          }
        }

        // Amount filter
        if (this.filters.amountCondition && this.filters.amountValue) {
          const transactionAmount = parseFloat(
            transaction.amount.replace("€", "").replace(",", "")
          );
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
              ? transaction.from
              : transaction.to;

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
