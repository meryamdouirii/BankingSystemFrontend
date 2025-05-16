<template>
  <div class="container">
    <main class="main-content">
      <div class="card mt-5">
        <div class="card-body">
          <h2 class="title">User Management</h2>

          <div v-if="error" class="error-message">{{ error }}</div>

          <!--<p>{{ users }}</p>-->

          <div class="card-body" style="min-height: auto;">
            <input v-model="searchTerm" type="text" placeholder="Search users..." class="search-input" />
              <div class="table-scroll" v-if="filteredUsers.length">
                <table class="user-table" v-if="filteredUsers.length">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>BSN</th>
                      <th>Phone</th>
                      <th>Accounts</th>
                      <th>Request</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in filteredUsers" :key="user.id">
                      <td>{{ user.email }}</td>
                      <td>{{ user.lastName }}, {{ user.firstName }}</td>
                      <td>{{ user.bsn }}</td>
                      <td>{{ user.phoneNumber }}</td>
                      <td>{{ user.accounts.length }}</td>
                      <td> {{ user.approval_status }} </td>
                      <td>
                        <span :class="['status', user._active ? 'active' : 'inactive']">
                          {{ user._active ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="text-center">
                        <button
                          :class="[
                            'btn-small',
                            user.approval_status === 'ACCEPTED'
                              ? 'accepted'
                              : user.approval_status === 'PENDING'
                                ? 'handle'
                                : 'rejected'
                          ]"
                          :disabled="user.approval_status !== 'PENDING'"
                          @click="openModal(user)"
                        >
                          {{ user.approval_status === 'ACCEPTED'
                            ? 'Accepted'
                            : user.approval_status === 'PENDING'
                              ? 'Handle Request'
                              : 'Rejected' }}
                        </button>
                        <button :class="['btn-small', user._active ? 'deactivate' : 'activate']">
                          {{ user._active ? 'Deactivate' : 'Activate' }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            <div v-else class="no-users">No users found.</div>
            <HandleRequest
                v-if="showModal"
                :show="showModal"
                :user="selectedUser"
                @close="closeModal"
                @done="handleDone"/>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "../../axios-auth";
import { useRouter } from "vue-router";
import HandleRequest from "./request/HandleRequest.vue";

const users = ref([]);
const error = ref(null);
const searchTerm = ref("");

const fetchUsers = async () => {
  try {
    const response = await axios.get("users");
    users.value = response.data;
  } catch (err) {
    error.value = "Failed to load users.";
    console.error(err);
  }
};

const showModal = ref(false);
const selectedUser = ref(null);

const openModal = (user) => {
  selectedUser.value = user;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
};

const handleDone = async () => {
  await fetchUsers();  
  closeModal();        
};
const filteredUsers = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return users.value
    .slice()
    .sort((a, b) => {
      const lastNameCompare = a.lastName.localeCompare(b.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstName.localeCompare(b.firstName);
    })
    .filter((user) => {
      return (
        user.email.toLowerCase().includes(term) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
        (user.bsn?.toLowerCase().includes(term) ?? false) ||
        (user.phoneNumber?.toLowerCase().includes(term) ?? false) ||
        String(user.accounts.length).includes(term) ||
        (user._active ? "active" : "inactive").includes(term) ||
        (user.approval_status?.toLowerCase().includes(term) ?? false)
      );
    });
});



onMounted(fetchUsers);
</script>


<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-actions {
  margin-top: 1.5rem;
  text-align: right;
}


.table-scroll {
  max-height: 30rem; 
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.user-table th,
.user-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
}

.status.active {
  background-color: #d4f8e8;
  color: #2d995b;
}

.status.inactive {
  background-color: #fde2e1;
  color: #d14545;
}

.btn-small {
  padding: 6px 12px;
  margin-right: 8px;
  width: 8rem;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  color: white;
  background-color: #6c63ff;
}

.btn-small.deactivate {
  background-color: #d14545;
}

.btn-small.activate {
  background-color: #2d995b;
}

.btn-small:hover {
  opacity: 0.9;
}

.btn-small.accepted,
.btn-small.rejected {
  background-color: #696a6a;
}

.btn-small.handle {
  background-color: #f0ad4e;
  color: #fff;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.no-users {
  text-align: center;
  padding: 20px;
  color: #666;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
</style>
