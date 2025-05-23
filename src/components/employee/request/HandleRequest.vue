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
          <button class="btn-green btn-small" @click="showConfirmation('accept')">Accept</button>
          <button class="btn-red btn-small" @click="showConfirmation('deny')">Deny</button>
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

