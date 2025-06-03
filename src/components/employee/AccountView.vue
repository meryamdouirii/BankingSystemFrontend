<template>
  <div class="container">
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <router-link to="/">Home</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link to="/manage-users">Manage Users</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link :to="`/manage-user/${user?.id}`">{{ user?.firstName }} {{ user?.lastName }}</router-link>
        </li>
        <li  class="breadcrumb-item active">
          <span>Accounts</span>
        </li>
      </ol>
    </nav>

    <main class="main-content">
      <div class="card">
        <div class="card-body">
          <div v-if="loading">Loading...</div>
          <div v-else-if="user && user.accounts.length">
            <h2 class="title">Accounts for {{ user?.firstName }} {{ user?.lastName }}</h2>
            <div v-if="user.accounts?.length">
              <div
                v-for="(account, index) in user.accounts"
                :key="account.id"
                class="account-row mb-4"
              >
                <div class="row g-3 align-items">
                  <!-- Account Section -->
                  <div class="col-md-6 d-flex">
                    <div class="card flex-fill">
                      <div class="card-body">
                        <AccountSection
                          :title="account.type"
                          :account="account"
                          :customer="user"
                          :accountType="account.type"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Absolute Limit -->
                  <div class="col-md-3 d-flex">
                    <div class="card flex-fill">
                      <Message
                      v-if="accountLimitUpdated && account.id === updatedAccountId"
                      :type="accountLimitUpdateMessageType"
                      :message="accountLimitUpdateMessage"
                      class="mt-3"
                      ></Message>
                      <div class="card-body d-flex flex-column align-items-center justify-content-center">

                        <label>Absolute Limit</label>
                        <input type="number" step="0.01" class="form-control form-control-sm mt-3" v-model="account.accountLimit" />
                        <div class="d-flex justify-content-center mt-3">
                          <button class="btn-small" @click="updateLimit(account.id, account)">Update limit</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- (de)activate Account -->
                  <div class="col-md-3 d-flex">
                    <div class="card flex-fill">
                       <!-- Message -->
                          <Message
                          v-if="accountStatusUpdated && account.id === updatedAccountId"
                          :type="accountStatusUpdateMessageType"
                          :message="accountStatusUpdateMessage"
                          class="mt-3"
                          ></Message>
                      <div class="card-body d-flex flex-column align-items-center justify-content-center">
                        <label>{{account.status === "ACTIVE" ? "Close account" : "Open account" }}</label>
                        <div class="d-flex justify-content-center mt-4">
                          <button
                            class="btn-small"
                            :class="account.status === 'ACTIVE' ? 'btn-red' : 'btn-green'"
                            @click="toggleAccountStatus(account)"
                          >
                            {{ account.status === 'ACTIVE' ? 'Close' : 'Open' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div v-else-if="error">{{ error }}</div>
          <div v-else class="no-accounts">
            <p>This user doesn't have any accounts yet.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AccountSection from '../customer/AccountSection.vue';
import { ref, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import axios from '../../axios-auth';
import Message from '../Message.vue';

const loading = ref(true);
const route = useRoute();
const userId = route.params.id;


const user = ref(null);
const error = ref(null);
const accountLimitUpdated = ref(false);
const accountLimitUpdateMessageType = ref(null);
const accountLimitUpdateMessage = ref('');
const accountStatusUpdated = ref(false);
const accountStatusUpdateMessageType = ref(null);
const accountStatusUpdateMessage = ref('');
const updatedAccountId = ref(null);
const fetchUser = async () => {

  try {
    const response = await axios.get(`users/${userId}`);
    user.value = response.data;

  } catch (err) {
      if (err.response && err.response.status === 401) {
        error.value = "Unauthorized access. Please log in.";
      } else if (err.response && err.response.status === 403) {
        error.value = "Forbidden access. You do not have permission to view this page.";
      } else if (err.response && err.response.status === 404) {
        error.value = "User not found.";
      } else {
        error.value = "Failed to load user data.";
      }
    console.error(err);
  } finally {
    console.log('Setting loading to false');
    loading.value = false;
  }
};

const updateLimit = async (accountId, account) => {
  updatedAccountId.value = accountId;
  accountLimitUpdated.value = false;
  accountStatusUpdated.value = false;
  try {
    await axios.put(`accounts/${accountId}`, account);
    accountLimitUpdateMessageType.value = 'success';
    accountLimitUpdateMessage.value = 'Account limit updated successfully.';

  } catch (err) {
    console.error("Failed to update account limit:", err);
    accountLimitUpdateMessageType.value = 'error';
    accountLimitUpdateMessage.value = 'Failed to update account limit.';
  }
  accountLimitUpdated.value = true;
};

const toggleAccountStatus = async (account) => {
  updatedAccountId.value = account.id;
  accountStatusUpdated.value = false;
  accountLimitUpdated.value = false;
  try {
    const newStatus = account.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    await axios.put(`accounts/${account.id}`, { ...account, status: newStatus });
    // Optionally, you can refetch the user data to reflect the changes
    await fetchUser();
    accountStatusUpdateMessageType.value = 'success';
    accountStatusUpdateMessage.value = `Account ${newStatus === 'ACTIVE' ? 'opened' : 'closed'} successfully.`;

  } catch (err) {
    console.error("Failed to toggle account status:", err);
    accountStatusUpdateMessageType.value = 'error';
    accountStatusUpdateMessage.value = `Failed to ${account.status === 'ACTIVE' ? 'close' : 'open'} account.`;
  }
  accountStatusUpdated.value = true;
};


onMounted(() => {
  fetchUser();
});
</script>


