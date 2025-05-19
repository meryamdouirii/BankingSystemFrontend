<template>
  <div>
    <h3 v-if="confirmationType === 'accept'">Set Limits</h3>
    <h3 v-else>Are you sure you want to deny?</h3>

    <div v-if="confirmationType === 'accept'" >
      <div class="limits-section">
        <div class="account-group">
          <h5>Checkings Account</h5>
          <div class="limit-group">
            <label>Set Absolute Limit</label>
            <input
              type="number"
              step="0.01"
              v-model="limits.absoluteLimitCheckings"
            />
          </div>
        </div>
        <div class="account-group">
          <h5>Savings Account</h5>
          <div class="limit-group">
            <label>Set Absolute Limit</label>
            <input
              type="number"
              step="0.01"
              v-model="limits.absoluteLimitSavings"
            />
          </div>
        </div>
      </div>

      <div class="limits-section">
        <div class="account-group">
          <h5>User limits</h5>
          <div class="limit-group">
            <label>Set Daily Limit</label>
            <input
              type="number"
              step="0.01"
              v-model="limits.dailyLimit"
            />
          </div>
          <div class="limit-group">
            <label>Set Transfer Limit</label>
            <input
              type="number"
              step="0.01"
              v-model="limits.transferLimit"
            />
          </div>
        </div>
      </div>

      
      <p v-if="error" class="error">{{ error }}</p>
    </div>


    <div class="modal-actions">
      <button class="btn-green btn-small" @click="confirmAction">Confirm</button>
      <button class="btn-small" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>


<script setup>
import { defineProps, defineEmits, reactive, ref } from 'vue';
import axios from '../../../axios-auth';

const props = defineProps({
  confirmationType: String,
  userId: [Number]
});

const emit = defineEmits(['confirmed', 'cancel']);

const limits = reactive({
  transferLimit: 500.00,
  absoluteLimitSavings: 0.00,
  dailyLimit: 1000.00,
  absoluteLimitCheckings: 0.00
});

const error = ref('');

const isValidBigDecimal = (value) => {
  return /^-?\d+(\.\d{1,2})?$/.test(value.toString()) && !isNaN(parseFloat(value));
};

const confirmAction = async () => {
  error.value = '';

  if (props.confirmationType === 'accept') {
    const allLimits = Object.values(limits);

    const allValid = allLimits.every(isValidBigDecimal);
    if (!allValid) {
      error.value = 'All limits must be valid numbers (e.g. 100.00)';
      return;
    }
  }

  try {
    const accepted = props.confirmationType === 'accept';

    if (!accepted) {
      await axios.post(`/users/deny/${props.userId}`);
      console.log('Request denied');
      return;
    }
    const payload = {
      absoluteLimitCheckings: limits.absoluteLimitCheckings,
      absoluteLimitSavings: limits.absoluteLimitSavings,
      dailyLimit: limits.dailyLimit,
      transferLimit: limits.transferLimit
    };

    await axios.post(`/users/approve/${props.userId}`, payload);
 
    console.log(`Request accepted`);
    emit('confirmed');
  } catch (err) {
    console.error('Error confirming action:', err);
    error.value = 'Something went wrong while processing the request.';
  }
};
</script>

<style scoped>

.limits-section {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
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

.btn-small:not(.btn-green) {
  background-color: #6c757d;
}
.btn-small:not(.btn-green):hover {
  background-color: #5a6268;
}

.limits-section {
  margin: 1rem 0;
}
.limit-group {
  margin-bottom: 0.8rem;
}
.limit-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}
.limit-group input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error {
  color: red;
  font-size: 0.9rem;
}
</style>
