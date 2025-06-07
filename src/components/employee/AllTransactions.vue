<template>
  <div class="container">
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <router-link to="/">Home</router-link>
        </li>
        <li class="breadcrumb-item">
          <span>All Transactions</span>
        </li>
      </ol>
    </nav>

    <div class="bg-light">
      <div class="transaction-overview">
        <h2>All Transactions</h2>

        <TransactionFilters
          @filter-changed="handleFilterChange"
          @reset-filters="resetFilters"
        />

        <div v-if="loading" class="loading-message">
          Loading transactions...
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>

        <TransactionTable
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
import TransactionFilters from "../transactions/TransactionFilters.vue";
import TransactionTable from "../transactions/TransactionTable.vue";
import { useTransactions } from "../../composables/useTransactions";
import { onMounted } from "vue";

export default {
  components: {
    TransactionFilters,
    TransactionTable,
  },
  setup() {
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
    } = useTransactions("/transactions/all");

    onMounted(() => {
      fetchTransactions();
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
</style>
