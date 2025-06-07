import { ref, reactive, watch } from "vue";
import axios from "../axios-auth";

export function useTransactions(apiEndpoint, additionalParams = {}) {
  const loading = ref(false);
  const error = ref(null);
  const transactions = ref([]);
  const totalTransactions = ref(0);

  const pagination = reactive({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
  });

  const filters = reactive({
    startDate: null,
    endDate: null,
    amount: null,
    amountFilterType: null,
    iban: null,
  });

  const resetFilters = () => {
    Object.assign(filters, {
      startDate: null,
      endDate: null,
      amount: null,
      amountFilterType: null,
      iban: null,
    });
    pagination.currentPage = 1;
    fetchTransactions();
  };

  const handlePageChange = (page) => {
    pagination.currentPage = page;
    fetchTransactions();
  };

  const handleFilterChange = (newFilters) => {
    Object.assign(filters, newFilters);
    pagination.currentPage = 1;
    fetchTransactions();
  };

  const mapTransactionData = (transactionData) => {
    return transactionData.map((transaction) => ({
      id: transaction.id,
      senderId: transaction.sender_id,
      date: new Date(transaction.dateTime).toLocaleDateString("en-GB"),
      dateTime: transaction.dateTime,
      description: transaction.description,
      senderIban: transaction.sender_iban,
      receiverIban: transaction.receiver_iban,
      amount: transaction.amount,
      initiatorName: transaction.initiatorName,
      type: transaction.transactionType,
    }));
  };

  const fetchTransactions = async () => {
    loading.value = true;
    error.value = null;

    try {
      const amount = filters.amount ? Number(filters.amount) : null;

      const params = {
        page: pagination.currentPage - 1, // Spring pages are 0-indexed
        size: pagination.itemsPerPage,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(amount && { amount }),
        ...(filters.amountFilterType && {
          amountFilterType: filters.amountFilterType.toUpperCase(),
        }),
        ...(filters.iban && { iban: filters.iban }),
        ...additionalParams,
      };

      const response = await axios.get(apiEndpoint, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      transactions.value = mapTransactionData(response.data.content);
      totalTransactions.value = response.data.totalElements;
      pagination.totalPages = response.data.totalPages;
    } catch (err) {
      console.error("Error fetching transactions:", err);
      error.value = "Failed to load transactions. Please try again later.";
    } finally {
      loading.value = false;
    }
  };

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
    fetchTransactions,
  };
}
