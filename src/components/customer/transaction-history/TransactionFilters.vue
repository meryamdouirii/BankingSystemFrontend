<template>
  <div class="transaction-filters">
    <h2>Filters</h2>

    <!-- Always visible date range filter -->
    <div class="filter-section">
      <h3>Date Range</h3>
      <div class="date-range-filters">
        <div class="form-group">
          <label>Start date</label>
          <input type="date" v-model="localFilters.startDate" />
        </div>
        <div class="form-group">
          <label>End date</label>
          <input type="date" v-model="localFilters.endDate" />
        </div>
      </div>
    </div>

    <!-- Toggle for additional filters as clickable text -->
    <div
      class="toggle-filters-text"
      @click="showMoreFilters = !showMoreFilters"
    >
      <span>{{
        showMoreFilters ? "Show fewer filters" : "Show more filters"
      }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="{ 'rotate-180': showMoreFilters }"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>

    <!-- Additional filters (foldable) -->
    <transition name="slide">
      <div v-if="showMoreFilters" class="additional-filters">
        <div class="filter-section">
          <h3>Transaction Amount</h3>
          <div class="amount-filters">
            <div class="form-group">
              <label>Condition</label>
              <select
                v-model="localFilters.amountFilterType"
                class="select-dark-text"
              >
                <option value="">Select condition</option>
                <option value="greater">Greater than</option>
                <option value="less">Less than</option>
                <option value="equal">Equal to</option>
              </select>
            </div>
            <div class="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                v-model="localFilters.amount"
                :disabled="!localFilters.amountFilterType"
                class="input-dark-text"
                :class="{ 'disabled-input': !localFilters.amountFilterType }"
              />
            </div>
          </div>
        </div>

        <div class="filter-section">
          <h3>IBAN Filter</h3>
          <div class="iban-filters">
            <div class="form-group">
              <label>IBAN contains</label>
              <input
                type="text"
                v-model="localFilters.ibanContains"
                placeholder="Enter partial IBAN"
                class="input-dark-text"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Action buttons -->
    <div class="filter-actions">
      <button class="apply-filters" @click="applyFilters">Apply filters</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMoreFilters: false,
      localFilters: {
        startDate: null,
        endDate: null,
        amount: null,
        amountFilterType: null,
        ibanContains: null,
      },
    };
  },
  methods: {
    formatDate(field) {
      if (this.localFilters[field]) {
        // Format date to ISO string with time component
        const date = new Date(this.localFilters[field]);
        // Add time component (midnight)
        this.localFilters[field] = date.toISOString();
      }
    },

    applyFilters() {
      const toISO = (dateStr) =>
        dateStr ? new Date(dateStr).toISOString() : null;

      const apiFilters = {
        startDate: toISO(this.localFilters.startDate),
        endDate: toISO(this.localFilters.endDate),
        amount: this.localFilters.amount
          ? parseFloat(this.localFilters.amount)
          : null,
        amountFilterType: this.localFilters.amountFilterType || null,
        ibanContains: this.localFilters.ibanContains || null,
      };

      this.$emit("filter-changed", apiFilters);
    },
  },
  watch: {
    "localFilters.amountFilterType"(newVal) {
      if (!newVal) {
        this.localFilters.amount = null;
      }
    },
  },
};
</script>

<style scoped>
.transaction-filters {
  background-color: #6c63ff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  color: white;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.date-range-filters,
.amount-filters,
.iban-filters {
  display: flex;
  gap: 15px;
}

.form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

/* Input and select styling with dark text */
input[type="date"],
input[type="number"],
input[type="text"],
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
}

/* Specific classes for dark text inputs */
.input-dark-text,
.select-dark-text {
  background-color: white;
  color: #333;
}

/* Disabled input styling */
.disabled-input {
  background-color: #242424;
  color: #616161;
  cursor: not-allowed;
}

.select-dark-text option {
  color: #333;
}

input::placeholder {
  color: rgba(51, 51, 51, 0.5);
}

select {
  height: 38px;
}

/* Clickable text for filters toggle */
.toggle-filters-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  margin: 10px 0;
  padding: 4px 0;
  transition: all 0.2s ease;
}

.toggle-filters-text:hover {
  color: #f0f0f0;
  text-decoration: underline;
}

.toggle-filters-text svg {
  transition: transform 0.2s ease;
}

.toggle-filters-text .rotate-180 {
  transform: rotate(180deg);
}

.apply-filters {
  display: block;
  width: auto;
  padding: 8px 20px;
  margin-top: 15px;
  margin-left: auto;
  background-color: white;
  color: #6c63ff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-filters:hover {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

.additional-filters {
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.slide-enter-active,
.slide-leave-active {
  max-height: 500px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  border: none;
}
</style>
