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
              min="0"
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

    // Check daily limit is not negative
    if (limits.dailyLimit < 0) {
      error.value = 'Daily limit cannot be negative.';
      return;
    }
  }

  try {
    const accepted = props.confirmationType === 'accept';

    if (!accepted) {
      await axios.post(`/users/deny/${props.userId}`);
      console.log('Request denied');
      emit('confirmed');
      return;
    }
    const payload = {
      absoluteLimitCheckings: limits.absoluteLimitCheckings,
      absoluteLimitSavings: limits.absoluteLimitSavings,
      dailyLimit: limits.dailyLimit,
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
<style
scoped>
.btn-small:not(.btn-green):not(.btn-red) {
  background-color: #6c757d;
}

.btn-small:not(.btn-green):not(.btn-red):hover {
  background-color: #5a6268;
}
</style>
