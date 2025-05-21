<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <button class="btn-close" @click="closeModal" aria-label="Close">&times;</button>

      <h3>Accounts for {{ user?.firstName }} {{ user?.lastName }}</h3>

      <div v-if="user.accounts.length">
        <AccountSection
            v-for="(account, index) in user.accounts"
            :key="account.id"
            title="Account {{ index + 1 }}"
            :account="account"
            :customer="user"
            :accountType="account.type"
        />
        </div>

      <div v-else>
        <p>This user doesn't have any accounts yet.</p>
      </div>

      <div class="modal-actions">
        <button class="btn-small btn-red" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import AccountSection from '../customer/AccountSection.vue';

const props = defineProps({
  show: Boolean,
  user: Object
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
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
  position: relative;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.btn-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
}

.btn-close:hover {
  color: #333;
}

.account-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.account-table th,
.account-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.modal-actions {
  margin-top: 1.5rem;
  text-align: right;
}

.btn-small {
  padding: 6px 12px;
  width: 8rem;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  color: white;
  background-color: #dc3545;
  transition: background-color 0.2s ease;
}

.btn-small:hover {
  background-color: #c82333;
}
</style>
