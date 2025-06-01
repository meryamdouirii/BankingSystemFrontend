<template>
  <div class="transaction-table">
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>From</th>
          <th>To</th>
          <th>Amount</th>
          <th>Initiated by</th>
        </tr>
      </thead>
      <tbody>
        <!-- No results message -->
        <tr v-if="transactions.length === 0">
          <td colspan="6" class="no-results">
            No transactions found matching your filters
          </td>
        </tr>
        <!-- Display actual transactions -->
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td>{{ transaction.date }}</td>
          <td>{{ transaction.description }}</td>
          <td>{{ transaction.senderIban }}</td>
          <td>{{ transaction.receiverIban }}</td>
          <td
            :class="[
              'amount',
              currentAccountId == transaction.senderId ? 'negative' : 'positive',
            ]"
          >
            <span>
              {{ currentAccountId == transaction.senderId ? '-' : '+' }}€{{ Math.abs(transaction.amount).toFixed(2) }}
            </span>
          </td>
          <td>{{ transaction.initiatorName }}</td>
        </tr>

        <!-- Display empty rows if needed -->
        <tr
          v-for="index in emptyRowCount"
          :key="'empty-' + index"
          class="empty-row"
        >
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination controls -->
    <div v-if="totalItems > 0" class="pagination-controls">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentAccountId:{
      type: Number,
      required: true,
    },
    transactions: {
      type: Array,
      required: true,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    emptyRowCount() {
      // Calculate how many empty rows we need to add
      return Math.max(0, this.itemsPerPage - this.transactions.length);
    },
  },
  methods: {
    getType(transaction) {
      if (transaction.amount >= 0) return "Deposit";
      return "Withdrawal";
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.$emit("page-changed", newPage);
      }
    },
  },
};
</script>

<style scoped>
.transaction-table {
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.pagination-controls {
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination-controls button {
  padding: 5px 15px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-height: 500px; /* Adjust this value based on your row height */
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  height: 48px; /* Fixed height for each row */
}

th {
  background-color: #6c63ff;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover:not(.empty-row) {
  background-color: #f0f0ff;
}

td {
  color: #333;
  font-size: 14px;
}

.empty-row td {
  border-bottom: 1px solid #f0f0f0;
}

.amount {
  font-weight: bold;
  color: #2c3e50;
}

.amount.negative {
  color: #e74c3c;
}

.amount.positive {
  color: #2ecc71;
}

.no-results {
  text-align: center;

  color: #666;
  font-style: italic;
  font-size: 15px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  th,
  td {
    padding: 10px 12px;
  }
}
</style>
