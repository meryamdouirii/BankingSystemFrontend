<template>
  <div>
    <h3>Set Limits</h3>

    <div v-if="confirmationType === 'accept'" class="limits-section">
      <div class="account-group">
        <h5>Checkings Account</h5>
        <div class="limit-group">
          <label>Daily Limit</label>
          <input
            type="number"
            min="0"
            step="0.01"
            v-model="limits.dailyLimitCheckings"
          />
        </div>
        <div class="limit-group">
          <label>Absolute Limit</label>
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
          <label>Daily Limit</label>
          <input
            type="number"
            min="0"
            step="0.01"
            v-model="limits.dailyLimitSavings"
          />
        </div>
        <div class="limit-group">
          <label>Absolute Limit</label>
          <input
            type="number"
            step="0.01"
            v-model="limits.absoluteLimitSavings"
          />
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
  dailyLimitSavings: '',
  absoluteLimitSavings: '',
  dailyLimitCheckings: '',
  absoluteLimitCheckings: ''
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
    const payload = {
      userId: props.userId,
      confirmed: props.confirmationType === 'accept'
    };

    if (props.confirmationType === 'accept') {
      payload.dailyLimitSavings = limits.dailyLimitSavings;
      payload.absoluteLimitSavings = limits.absoluteLimitSavings;
      payload.dailyLimitCheckings = limits.dailyLimitCheckings;
      payload.absoluteLimitCheckings = limits.absoluteLimitCheckings;
    }

    await axios.post('/users/request', payload);
    console.log(`Request ${props.confirmationType === 'accept' ? 'accepted' : 'denied'}`);
    emit('confirmed');
  } catch (err) {
    console.error('Error confirming action:', err);
    error.value = 'Something went wrong while processing the request.';
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
