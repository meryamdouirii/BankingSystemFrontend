<template>
  <div class="container">
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <router-link to="/manage-users">Manage Users</router-link>
        </li>
        <li class="breadcrumb-item active">
          <span>{{ user?.firstName }} {{ user?.lastName }}</span>
        </li>
      </ol>
    </nav>

    <main>
      <div class="card">
        <div class="card-body">
          <!-- Error Message -->
          <Message v-if="limitsUpdated" :type="limitUpdateMessageType" :message="limitUpdateMessage" class="mt-3">
          </Message>
          <div v-if="loading">Loading...</div>
          <div v-else-if="user">
            <h2 class="title">Manage {{ user?.firstName }} {{ user?.lastName }}</h2>
            <div class="card flex-fill">
              <div class="row me-3 ms-3">
                <div class="card-body col-md-6">
                  <!-- User Details -->
                  <h5>User Details</h5>
                  <div class="mt-3 mb-3 user-info">
                    <p><strong>BSN:</strong> {{ user.bsn }}</p>
                    <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
                    <p><strong>Email:</strong> {{ user.email }}</p>
                    <p><strong>Phone Number:</strong> {{ user.phoneNumber }}</p>
                    <p>
                        <strong>Status: </strong>
                        <span :class="user._active ? 'text-success' : 'text-danger'">
                          {{ user._active ? 'Active' : 'Inactive' }}
                        </span>
                      </p>
                      <p><strong>Daily Limit:</strong> {{ user.daily_limit }}</p>
                      <p>
                        <strong>Approval Status: </strong>
                        <span :class="{
                          'text-success': user.approval_status === 'ACCEPTED',
                          'text-warning': user.approval_status === 'PENDING',
                          'text-danger': user.approval_status !== 'ACCEPTED' && user.approval_status !== 'PENDING'
                        }">
                          {{ user.approval_status }}
                        </span>
                      </p>
                      <div v-if="user.accounts && user.accounts.length > 0">
                        <router-link :to="`/manage-user-accounts/${user.id}`" class="btn-small">
                          View Accounts
                        </router-link>
                      </div>
                      <div v-else>
                        <p>This user doesn’t have any accounts.</p>
                      </div>
                  </div>
                </div>
                <div class="card-body col-md-6">
                  <!-- User Account settings -->
                  <h5>Limit Settings</h5>
                  <div class="mt-3 mb-3 user-info">
                    <div class="mt-0 row">
                      <div class="col-md-6">
                        <p><strong>Daily Limit:</strong></p>
                        <input type="number" step="0.01" class="form-control form-control-sm mt-3"
                          v-model="editedLimits.daily_limit" />
                      </div>
                      <div class="d-flex justify-content-center mt-3">
                        <button class="btn-small" @click="updateLimits()">Update limits</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="error">{{ error }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../axios-auth';
import Message from '../Message.vue';

const loading = ref(true);
const route = useRoute();
const router = useRouter();
const userId = route.params.id;
const editedLimits = reactive({
  daily_limit: 0
});


const user = ref(null);
const error = ref(null);

const fetchUser = async () => {
  try {
    const response = await axios.get(`users/${userId}`);
    user.value = response.data;
    editedLimits.daily_limit = user.value.daily_limit;

    if (user.value.role !== 'ROLE_CUSTOMER') {
      router.push('/manage-users');
    }
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
    loading.value = false;
  }
};

const limitsUpdated = ref(false);
const limitUpdateMessageType = ref('');
const limitUpdateMessage = ref('');

const updateLimits = async () => {
  limitsUpdated.value = false;

  if (editedLimits.daily_limit < 0) {
    limitUpdateMessageType.value = 'error';
    limitUpdateMessage.value = 'Daily limit cannot be negative.';
    limitsUpdated.value = true;
    return;
  }
  try {
    await axios.put(`/users/${userId}`, {
      ...user.value,
      daily_limit: editedLimits.daily_limit
    });
    
    await fetchUser();

    limitUpdateMessageType.value = 'success';
    limitUpdateMessage.value = 'Limits updated successfully.';
  } catch (err) {
    console.error('Failed to update limits:', err);
    limitUpdateMessageType.value = 'error';
    limitUpdateMessage.value = 'Failed to update limits.';
  }
  limitsUpdated.value = true;
};
onMounted(() => {
  fetchUser();
});
</script>

<style scoped>
.user-info {
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.user-info>div {
  margin-top: 1rem;
  text-align: right;
}

.user-info>div>p,
.user-info>div>div>p {
  text-align: left;
  margin-bottom: 0;
}

.user-info>p {
  margin-bottom: 4px;
  text-align: left;
}
</style>
