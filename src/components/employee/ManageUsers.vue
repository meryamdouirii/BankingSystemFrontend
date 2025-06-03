<template>

  <div class="container">
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb-list">
        <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
          <template v-if="crumb.link">
            <router-link :to="crumb.link">{{ crumb.name }}</router-link>
          </template>
          <template v-else>
            <span>{{ crumb.name }}</span>
          </template>
        </li>
      </ol>
      </nav>
    <main class="main-content">
      <div class="card">
        <div class="card-body">
          <h2 class="title">User Management</h2>

          <div v-if="error" class="error-message">{{ error }}</div>

          <!--<p>{{ users }}</p>-->

          <div v-if="!error" class="card-body" style="min-height: auto;">
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
                    <tr v-for="user in filteredUsers" class="clickable-row" :key="user.id" @click="navigateToEditUser(user.id)">
                      <td>{{ user.email }}</td>
                      <td>{{ user.lastName }}, {{ user.firstName }}</td>
                      <td>{{ user.bsn }}</td>
                      <td>{{ user.phoneNumber }}</td>
                      <td>
                        <router-link
                        @click.stop="openRequestModal(user)"
                          :to="`/manage-user-accounts/${user.id}`"
                          class="btn-small"
                          :class="{ 'disabled-btn': !user.accounts || user.accounts.length === 0 }"
                          @click.prevent="!user.accounts || user.accounts.length === 0 ? null : null"
                        >
                          View Accounts
                        </router-link>

                      </td>
                      <td> {{ user.approval_status }} </td>
                      <td>
                        <span :class="['status', user._active ? 'active' : 'inactive']">
                          {{ user._active ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="text-center">
                        <button
                        @click.stop="openRequestModal(user)"
                          :class="[
                            'btn-small',
                            user.approval_status === 'PENDING'
                              ? 'handle'
                              : 'disabled-btn'
                          ]"
                          :disabled="user.approval_status !== 'PENDING'"
                          @click="openRequestModal(user)"
                        >
                          {{ user.approval_status === 'ACCEPTED'
                            ? 'Accepted'
                            : user.approval_status === 'PENDING'
                              ? 'Handle'
                              : 'Rejected' }}
                        </button>
                        <router-link
                          @click.stop="openRequestModal(user)"
                          :to="`/manage-user/${user.id}`"
                          class="btn-small"
                        >
                        Edit User
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            <div v-else class="no-users">No users found.</div>
            <HandleRequest
                v-if="showRequestModal"
                :show="showRequestModal"
                :user="selectedUser"
                @close="closeRequestModal"
                @done="handleDone"/>

          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "../../axios-auth";
import AccountView from "./AccountView.vue";
import HandleRequest from "./request/HandleRequest.vue";

const breadcrumbs = ref([
  { name: 'Home', link: '/' },
  { name: 'Manage Users', link: null }
])

const users = ref([]);
const error = ref(null);
const searchTerm = ref("");

const fetchUsers = async () => {
  try {
    const response = await axios.get("users");
    users.value = response.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = "Unauthorized access. Please log in.";
    } else if (err.response && err.response.status === 403) {
      error.value = "Forbidden access. You do not have permission to view this page.";
    } else if (err.response && err.response.status === 404) {
      error.value = "Users not found.";
    } else {
      error.value = "Failed to load users.";
    }
    console.error(err);
  }
};

const showRequestModal = ref(false);
const selectedUser = ref(null);
const router = useRouter();

const navigateToEditUser = (userId) => {
  router.push(`/manage-user/${userId}`);
};
const openRequestModal = (user) => {
  selectedUser.value = user;
  showRequestModal.value = true;
};

const closeRequestModal = () => {
  showRequestModal.value = false;
  selectedUser.value = null;
};

const handleDone = async () => {
  await fetchUsers();
  closeRequestModal();
};
const filteredUsers = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return users.value
    .filter((user) => user.role?.includes("ROLE_CUSTOMER"))
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


