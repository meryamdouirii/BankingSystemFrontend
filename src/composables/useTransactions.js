import { ref, reactive, watch } from 'vue';
import axios from "../axios-auth"

export function useTransactions(apiEndpoint, additionalParams = {}) {
  const loading = ref(false);
  const error = ref(null);
  const transactions = ref([]);
  const pagination = reactive({
    page: 0,
    size: 10,
    totalPages: 0,
  });

  const filters = reactive({
    sender_iban: '',
    receiver_iban: '',
    amount: '',
    type: '',
    date_from: '',
    date_to: '',
  });

  const resetFilters = () => {
    Object.assign(filters, {
      sender_iban: '',
      receiver_iban: '',
      amount: '',
      type: '',
      date_from: '',
      date_to: '',
    });
  };

  const handlePageChange = (page) => {
    pagination.page = page;
    fetchTransactions();
  };

  const mapTransactionData = (transactions) => {
    return transactions.map(tx => ({
      ...tx,
      date: new Date(tx.date).toLocaleString(),
    }));
  };

  const fetchTransactions = async () => {
    loading.value = true;
    error.value = null;

    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        ...filters,
        ...additionalParams,
      };

      if (filters.amount && isNaN(Number(filters.amount))) {
        throw new Error("Amount must be a valid number.");
      }

      const { data } = await axios.get(apiEndpoint, { params });
      transactions.value = mapTransactionData(data.content);
      pagination.totalPages = data.totalPages;
    } catch (err) {
      error.value = err.message || 'Failed to fetch transactions.';
    } finally {
      loading.value = false;
    }
  };

  // Auto-fetch on page change
  watch(() => pagination.page, fetchTransactions);

  return {
    transactions,
    filters,
    pagination,
    loading,
    error,
    resetFilters,
    handlePageChange,
    fetchTransactions,
  };
}
