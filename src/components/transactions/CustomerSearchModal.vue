<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Search Customer IBAN</h3>
        <button @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <label>Enter customer name</label>
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Enter customer name..."
            @keyup.enter="searchCustomers"
          />
          <button
            class="search-btn"
            @click="searchCustomers"
            :disabled="searchQuery.trim().length < 3"
          >
            Search
          </button>
        </div>

        <div v-if="isLoading" class="loading-message">Searching...</div>
        <div v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div
          v-else-if="filteredAccounts.length === 0 && hasSearched"
          class="no-results"
        >
          No accounts found
        </div>

        <div v-else>
          <div
            v-for="account in filteredAccounts"
            :key="account.iban"
            class="result-item"
          >
            <div class="account-info">
              <strong>{{ account.userName }}</strong> –
              {{ formatIban(account.iban) }} ({{ account.accountType }})
            </div>
            <button class="select-btn" @click="selectAccount(account)">
              Select
            </button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="closeModal">Close</button>
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
      hasSearched: false, // Add this flag
    };
  },
  methods: {
    async searchCustomers() {
      const trimmedQuery = this.searchQuery.trim();

      if (trimmedQuery.length < 3) {
        this.errorMessage = "Please enter at least 3 characters to search.";
        this.filteredAccounts = [];
        this.hasSearched = false; // Reset if invalid search
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";
      this.hasSearched = true; // Set true when search is triggered

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
.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.result-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.select-btn {
  padding: 6px 12px;
  background-color: #ffffff;
  color: #6c63ff;
  border: 1px solid #6c63ff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s, color 0.2s;
}

.select-btn:hover {
  background-color: #6c63ff;
  color: #fff;
  border-color: #6c63ff;
}
.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.search-container input {
  flex: 1;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box; /* Ensure consistent sizing */
  height: 40px; /* Set an explicit height */
}

.search-btn {
  height: 40px; /* Match input height */
  padding: 0 16px; /* Remove vertical padding to use height */
  background-color: #ffffff;
  color: #6c63ff;
  border: 1px solid #6c63ff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s, color 0.2s;
  box-sizing: border-box;
}
.search-btn:hover {
  background-color: #ff6b6b;
  color: #fff;
  border-color: #ff6b6b;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background-color: #6c63ff;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: #888;
}

.modal-body label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #ffffff;
}

.modal-body input {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 12px;
}

.modal-body input:focus {
  border-color: #ff6b6b;
  outline: none;
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
}

.result-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: #ff6b6b;
}

.modal-body div {
  font-size: 14px;
}

.modal-footer {
  margin-top: 15px;
  text-align: right;
}

.modal-footer button {
  padding: 8px 16px;
  background-color: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.modal-footer button:hover {
  background-color: #ff6b6b;
}

/* Loading and no-results messages */
.modal-body .loading-message,
.modal-body .no-results {
  padding: 12px;
  color: #ffffff;
  font-style: italic;
  text-align: center;
}

/* Responsive */
@media (max-width: 500px) {
  .modal-content {
    padding: 16px;
  }

  .modal-body input {
    padding: 9px 12px;
  }

  .result-item {
    padding: 10px 12px;
  }
}
</style>
