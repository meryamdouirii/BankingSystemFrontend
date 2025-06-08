<template>
  <div class="container" style="background-color: white; min-height: 100vh">
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <router-link
            :to="
              isEmployeeInitiatedTransfer
                ? `/manage-user-accounts/${customer?.id}`
                : '/view-account'
            "
            >{{
              isEmployeeInitiatedTransfer ? "Manage Accounts" : "View Account"
            }}</router-link
          >
        </li>
        <li class="breadcrumb-item active">
          <span>Transfer Money</span>
        </li>
      </ol>
    </nav>
    <div class="mx-auto p-4 border rounded shadow" style="max-width: 600px">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0 text-black">Transfer money</h4>
        <router-link
          :to="
            isEmployeeInitiatedTransfer
              ? `/manage-user-accounts/${customer?.id}`
              : '/view-account'
          "
          class="btn btn-link text-black p-0"
          >Close</router-link
        >
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold text-black">From account</label>
        <select
          v-model="selectedAccount"
          class="form-select border-black text-black mb-2"
          :disabled="isEmployeeInitiatedTransfer"
        >
          <option
            v-if="isEmployeeInitiatedTransfer && selectedAccount"
            :value="selectedAccount"
          >
            {{
              selectedAccount.type === "CHECKING"
                ? "Checking Account"
                : "Savings Account"
            }}
            - €{{ selectedAccount.balance.toFixed(2) }} ({{
              customer.firstName
            }}
            {{ customer.lastName }})
          </option>
          <option
            v-else
            v-for="account in userAccounts"
            :key="account.id"
            :value="account"
          >
            {{
              account.type === "CHECKING"
                ? "Checking Account"
                : "Savings Account"
            }}
            - €{{ account.balance.toFixed(2) }}
          </option>
        </select>
        <div v-if="selectedAccount" class="border rounded p-3">
          <div class="fw-bold text-black">
            Centjesbank
            {{
              selectedAccount.type === "CHECKING"
                ? "Checking Account"
                : "Savings Account"
            }}
          </div>
          <div class="d-flex justify-content-between text-black">
            <small
              >{{ customer.firstName }} {{ customer.lastName }} -
              {{ selectedAccount.iban }}</small
            >
            <strong>€{{ selectedAccount.balance.toFixed(2) }}</strong>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold text-black">To account</label>
        <select
          v-model="toAccount"
          class="form-select border-black text-black mb-2"
        >
          <option value="">Select an account</option>
          <optgroup label="My accounts">
            <option
              v-for="account in userAccounts.filter(
                (acc) => acc.id !== selectedAccount?.id
              )"
              :key="account.id"
              :value="account"
            >
              {{
                account.type === "CHECKING"
                  ? "Checking Account"
                  : "Savings Account"
              }}
              - €{{ account.balance.toFixed(2) }}
            </option>
          </optgroup>
          <optgroup label="Other accounts">
            <option value="external">Enter external account details</option>
          </optgroup>
        </select>
      </div>

      <div v-if="toAccount === 'external'" class="mb-3">
        <label class="form-label fw-bold text-black">Recipient IBAN</label>
        <div class="input-group">
          <input
            type="text"
            v-model="recipientAccount"
            class="form-control border-black text-black"
            placeholder="Recipient IBAN"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="openAddressBook"
          >
            Address Book
          </button>
        </div>
        <div v-if="recipientName" class="mt-2 text-black">
          <small><strong>Recipient:</strong> {{ recipientName }}</small>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col">
          <label class="form-label text-black fw-bold">Amount</label>
          <input
            type="number"
            v-model="amount"
            class="form-control border-black text-black"
            :class="{ 'border-danger': isAmountTooHigh }"
            placeholder="€ 0,00"
          />
          <div v-if="isAmountTooHigh" class="text-danger mt-1">
            <small
              >⚠️ Insufficient funds. Your current balance is €{{
                selectedAccount?.balance.toFixed(2)
              }}
              and your limit is {{ selectedAccount.accountLimit }}</small
            >
          </div>
        </div>
        <div class="col">
          <label class="form-label text-black fw-bold">Currency</label>
          <select class="form-select border-black text-black">
            <option selected>EUR Euro</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label text-black fw-bold">Description</label>
        <textarea
          v-model="description"
          class="form-control border-black text-black"
          rows="3"
          maxlength="140"
        ></textarea>
      </div>

      <div v-if="error" class="alert alert-danger text-danger mb-3">
        {{ error }}
      </div>

      <button
        type="button"
        class="btn w-100 text-white"
        :class="{ 'opacity-50': !isFormValid }"
        :disabled="!isFormValid"
        style="background-color: #6c63ff"
        @click="handleTransfer"
      >
        Next
      </button>
    </div>
  </div>
  <CustomerSearchModal
    v-if="isAddressBookOpen"
    @close="closeAddressBook"
    @customer-selected="handleCustomerSelected"
  />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRoute, useRouter } from "vue-router"; // Import useRoute and useRouter
import axios from "../../axios-auth";
import CustomerSearchModal from "../customer/CustomerSearchModal.vue";

const authStore = useAuthStore();
const route = useRoute(); // Initialize useRoute
const router = useRouter(); // Initialize useRouter

const customer = ref({}); // This will hold the details of the customer whose account is being used
const userAccounts = ref([]); // These are the accounts of the *logged-in* user (for customer flow)
const selectedAccount = ref(null); // The 'from' account
const toAccount = ref(null); // The 'to' account
const amount = ref("");
const loading = ref(true);
const error = ref(null);
const recipientName = ref("");
const recipientAccount = ref("");
const description = ref("");
const isAddressBookOpen = ref(false);

// State for employee-initiated transfer
const employeeTargetUserId = ref(null);
const employeeTargetAccountId = ref(null);

const openAddressBook = () => {
  isAddressBookOpen.value = true;
};

const handleCustomerSelected = (account) => {
  recipientAccount.value = account.iban;
  // You might want to update recipientName with the customer's name for clarity if you have it
  recipientName.value = account.accountHolderName || ""; // Adjust based on what your API returns for customer name
  isAddressBookOpen.value = false;
};

const closeAddressBook = () => {
  isAddressBookOpen.value = false;
};

// Determines if the current logged-in user is a customer
const isCustomer = computed(() => {
  return authStore.userRole === "ROLE_CUSTOMER";
});

// Determines if the transfer form is being used by an employee to transfer funds from another customer's account
const isEmployeeInitiatedTransfer = computed(() => {
  return (
    (authStore.userRole === "ROLE_EMPLOYEE" ||
      authStore.userRole === "ROLE_ADMINISTRATOR") &&
    employeeTargetUserId.value &&
    employeeTargetAccountId.value
  );
});

const isAmountTooHigh = computed(() => {
  if (!amount.value || !selectedAccount.value) return false;
  const parsedAmount = parseFloat(amount.value);
  if (isNaN(parsedAmount) || parsedAmount <= 0) return false; // Ensure amount is a valid positive number

  const resultingBalance = selectedAccount.value.balance - parsedAmount;
  return resultingBalance < selectedAccount.value.accountLimit;
});

const isFormValid = computed(() => {
  if (!selectedAccount.value || !amount.value || isAmountTooHigh.value)
    return false;

  // Amount must be positive
  if (parseFloat(amount.value) <= 0) return false;

  if (toAccount.value === "external") {
    return !!recipientAccount.value
  }

  // Ensure an internal 'to' account is selected and is not the same as 'from'
  return (
    !!toAccount.value &&
    toAccount.value.id !== selectedAccount.value.id
  );
});

const handleTransfer = async () => {
  try {
    const transactionData = {
      sender_account: { id: selectedAccount.value.id },
      amount: parseFloat(amount.value),
      description: description.value,
      // Initiator depends on who is making the transfer
      // If an employee is doing it on behalf of a customer, the initiator is the employee.
      // Otherwise, it's the logged-in customer.
      initiator: { id: authStore.userId },
    };

    transactionData.transaction_type =
      toAccount.value === "external" ? "PAYMENT" : "INTERNAL_TRANSFER";

    transactionData.reciever_account =
      toAccount.value === "external"
        ? { iban: recipientAccount.value }
        : { id: toAccount.value.id };

    const response = await axios.post("/transactions", transactionData);
    console.log("Transfer successful:", response.data);

    // Redirect based on who initiated the transfer
    if (isEmployeeInitiatedTransfer.value) {
      router.push(`/manage-user-accounts/${employeeTargetUserId.value}`);
    } else {
      router.push("/view-account");
    }
    // You can add a success message or clear the form here as well
  } catch (err) {
    const backendMessage =
      err.response?.data?.message || err.response?.data || "An unexpected error occurred";

    error.value = "Transfer failed: " + backendMessage;
    console.error("Transfer error:", err);
  }
};

const fetchAccountsForLoggedInUser = async () => {
  try {
    const response = await axios.get(`/users/${authStore.userId}`);
    customer.value = response.data; // This 'customer' is the logged-in user
    userAccounts.value = response.data.accounts || [];

    // Select the first checking account if customer flow and no account selected
    if (userAccounts.value.length > 0 && !selectedAccount.value) {
      selectedAccount.value =
        userAccounts.value.find((acc) => acc.type === "CHECKING") ||
        userAccounts.value[0];
    }
  } catch (err) {
    error.value = "Could not load your account information.";
    console.error(err);
  }
};

// New function to fetch accounts for the target customer (when employee initiates)
const fetchAccountsForEmployeeTargetUser = async () => {
  try {
    const response = await axios.get(`/users/${employeeTargetUserId.value}`);
    customer.value = response.data; // This 'customer' is the target customer whose account is being used
    // Filter to only show checking accounts for transfer from this screen
    userAccounts.value = response.data.accounts || []; // Still keep all accounts for `toAccount` dropdown
    // Pre-select the specific account passed via query parameter
    selectedAccount.value = userAccounts.value.find(
      (acc) => acc.id.toString() === employeeTargetAccountId.value
    );

    if (!selectedAccount.value) {
      error.value = "Selected 'from' account not found for this user.";
    }
  } catch (err) {
    error.value = "Could not load target user's account information.";
    console.error(err);
  }
};

onMounted(async () => {
  loading.value = true;
  error.value = null; // Clear previous errors

  // Check for query parameters for employee-initiated transfer
  employeeTargetUserId.value = route.query.userId;
  employeeTargetAccountId.value = route.query.accountId;

  if (isEmployeeInitiatedTransfer.value) {
    if (!authStore.userId) { // Ensure employee is logged in
      error.value = "Employee not authenticated.";
      loading.value = false;
      return;
    }
    await fetchAccountsForEmployeeTargetUser();
  } else if (isCustomer.value) {
    // Regular customer flow
    if (!authStore.userId) {
      error.value = "User not authenticated";
      loading.value = false;
      return;
    }
    await fetchAccountsForLoggedInUser();
  } else {
    // Handle cases where an unauthenticated user or user with no role lands here (should be caught by router guard)
    error.value = "Access denied or invalid context.";
  }
  loading.value = false;
});
</script>

<style scoped>
/* Keep your existing styles */
.border-black {
  border-color: black !important;
}

.text-black {
  color: black !important;
}

.border-danger {
  border-color: #dc3545 !important;
}

.text-danger {
  color: #dc3545 !important;
}
</style>