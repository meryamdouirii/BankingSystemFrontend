<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="btn-close" @click="closeModal">×</button>

      <div class="modal-header">
        <h3 class="header-title">Search Customer IBAN</h3>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Enter customer name</label>
          <div class="search-container">
            <input
              type="text"
              class="form-control search-input"
              v-model="searchQuery"
              placeholder="Enter customer name..."
              @keyup.enter="searchCustomers"
            />
            <button
              class="btn-small"
              @click="searchCustomers"
              :disabled="searchQuery.trim().length < 3"
            >
              Search
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="loading-message">
          <div class="spinner"></div>
          Searching...
        </div>
        <div v-else-if="errorMessage" class="error-message error">
          {{ errorMessage }}
        </div>
        <div
          v-else-if="filteredAccounts.length === 0 && hasSearched"
          class="no-accounts"
        >
          No accounts found
        </div>

        <div v-else class="results-container">
          <div
            v-for="account in filteredAccounts"
            :key="account.iban"
            class="result-item clickable-row"
            @click="selectAccount(account)"
          >
            <div class="account-info">
              <strong>{{ account.userName }}</strong> –
              {{ formatIban(account.iban) }} ({{ account.accountType }})
            </div>
            <button class="btn-small" @click.stop="selectAccount(account)">
              Select
            </button>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-small" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../axios-auth";

export default {
  name: "CustomerSearchModal",
  props: {},
  data() {
    return {
      searchQuery: "",
      isLoading: false,
      errorMessage: "",
      filteredAccounts: [],
      hasSearched: false,
    };
  },
  methods: {
    async searchCustomers() {
      const trimmedQuery = this.searchQuery.trim();

      if (trimmedQuery.length < 3) {
        this.errorMessage = "Please enter at least 3 characters to search.";
        this.filteredAccounts = [];
        this.hasSearched = false;
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";
      this.hasSearched = true;

      try {
        const response = await axios.get("/users/find", {
          params: { name: trimmedQuery },
        });

        this.filteredAccounts = response.data.accounts;
      } catch (error) {
        console.error("Search failed:", error);
        this.errorMessage = "Failed to search. Please try again.";
        this.filteredAccounts = [];
      } finally {
        this.isLoading = false;
      }
    },

    formatIban(iban) {
      return iban.replace(/(.{4})/g, "$1 ").trim();
    },

    selectAccount(account) {
      this.$emit("customer-selected", account);
    },

    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.search-container {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.search-container .form-control {
  flex: 1;
  margin-bottom: 0;
}

.search-btn {
  white-space: nowrap;
  height: fit-content;
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: #666;
  font-style: italic;
}

.results-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-top: 1rem;
}

.result-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.result-item:last-child {
  border-bottom: none;
}

.account-info {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.modal-header {
  margin-bottom: 1.5rem;
}

.modal-body {
  min-height: 200px;
}

.modal-body label {
  color: #333;
}

.no-accounts {
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 500px) {
  .search-container {
    flex-direction: column;
    gap: 8px;
  }

  .search-btn {
    width: 100%;
  }

  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .result-item .btn-small {
    align-self: flex-end;
  }
}
</style>
