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
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td>{{ transaction.date }}</td>
          <td>{{ transaction.description }}</td>
          <td>{{ transaction.from }}</td>
          <td>{{ transaction.to }}</td>
          <td class="amount">{{ transaction.amount }}</td>
        </tr>
        <tr v-if="transactions.length === 0">
          <td colspan="5" class="no-results">
            No transactions found matching your filters
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    transactions: {
      type: Array,
      required: true,
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

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
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

tr:hover {
  background-color: #f0f0ff;
}

td {
  color: #333;
  font-size: 14px;
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
  padding: 30px;
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
