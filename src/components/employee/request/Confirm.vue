<template>
  <div>
    <h3>Confirm your action</h3>
    <p>
      Are you sure you want to
      <strong>{{ confirmationType === 'accept' ? 'accept' : 'deny' }}</strong>
      this request?
    </p>
    <div class="modal-actions">
      <button class="btn-green btn-small" @click="confirmAction">Confirm</button>
      <button class="btn-small" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import axios from '../../../axios-auth';

const props = defineProps({
  confirmationType: String,
  userId: [String, Number]
});

const emit = defineEmits(['confirmed', 'cancel']);
const confirmAction = async () => {
  try {
    if (props.confirmationType === 'accept') {
      await axios.post('/users/request', 
      { userId: props.userId,
        confirmed: true
       });
      console.log('Request accepted');
    } else if (props.confirmationType === 'deny') {
      await axios.post('/users/request', 
      { userId: props.userId,
        confirmed: false
       });
      console.log('Request denied');
    }
    emit('confirmed');
  } catch (error) {
    console.error('Error confirming action:', error);
  }
};
</script>

<style scoped>
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

.btn-small:not(.btn-green) {
  background-color: #6c757d;
}

.btn-small:not(.btn-green):hover {
  background-color: #5a6268;
}
</style>
