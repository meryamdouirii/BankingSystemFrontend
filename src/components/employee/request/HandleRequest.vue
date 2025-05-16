<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <button class="btn-close" @click="closeModal" aria-label="Close">&times;</button>

      <template v-if="!confirmationVisible">
        <h3>User Request Details</h3>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
        <p><strong>BSN:</strong> {{ user.bsn }}</p>
        <p><strong>Phone:</strong> {{ user.phoneNumber }}</p>
        <p><strong>Status:</strong> {{ user.approval_status }}</p>
        <p><strong>Active:</strong> {{ user._active ? 'Yes' : 'No' }}</p>

        <div class="modal-actions">
          <button class="btn-green btn-small" @click="showConfirmation('accept')">Accept Request</button>
          <button class="btn-red btn-small" @click="showConfirmation('deny')">Deny Request</button>
        </div>
      </template>

      <template v-else>
        <Confirm
          :confirmationType="confirmationType"
          :userId="user.id"
          @confirmed="onConfirmed"
          @cancel="cancelConfirmation"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import Confirm from './Confirm.vue';

const props = defineProps({
  show: Boolean,
  user: Object
});

const emit = defineEmits(['close', 'done']);

const confirmationVisible = ref(false);
const confirmationType = ref(null);

const closeModal = () => {
  confirmationVisible.value = false;
  confirmationType.value = null;
  emit('close');
};

const showConfirmation = (type) => {
  confirmationType.value = type;
  confirmationVisible.value = true;
};

const cancelConfirmation = () => {
  confirmationVisible.value = false;
  confirmationType.value = null;
};

const onConfirmed = () => {
  closeModal();
  emit('done'); 
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

.modal-actions {
  margin-top: 1.5rem;
  text-align: right;
}

.btn-small {
  padding: 6px 12px;
  margin-left: 8px;
  width: 8rem;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease;
}

.btn-green {
  background-color: #28a745;
}

.btn-green:hover {
  background-color: #218838;
}

.btn-red {
  background-color: #dc3545;
}

.btn-red:hover {
  background-color: #c82333;
}

.btn-small:not(.btn-green):not(.btn-red) {
  background-color: #6c757d;
}

.btn-small:not(.btn-green):not(.btn-red):hover {
  background-color: #5a6268;
}
</style>
