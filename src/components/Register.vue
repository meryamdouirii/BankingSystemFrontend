<template>
  <div class="login-container">
    <main class="main-content">
      <div class="login-card">
        <h2 class="login-title">Register for Centjesbank</h2>
        <div class="progress-indicator">
          <div
            v-for="(step, index) in steps"
            :key="index"
            :class="[
              'step',
              { active: currentStep === index, completed: currentStep > index },
            ]"
          >
            <span class="step-number">{{ index + 1 }}</span>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </div>
        <div v-if="error" class="error-message fs-6 m-2">{{ error }}</div>
        <!-- Step 1: Personal Information -->

        <div class="form-container">
          <form v-if="currentStep === 0" @submit.prevent="nextStep">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                v-model="formData.firstName"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                v-model="formData.lastName"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                v-model="formData.phoneNumber"
                @input="formatPhoneNumber"
                class="form-control"
                maxlength="10"
                required
              />
              <small
                v-if="formData.phoneNumber && !isValidPhone"
                class="error-message"
              >
                Please enter exactly 10 digits
              </small>
            </div>
            <div class="form-group">
              <label for="bsn">BSN Number</label>
              <input
                type="text"
                id="bsn"
                v-model="formData.bsn"
                class="form-control"
                :class="{ error: formData.bsn && !isValidBSN }"
                required
                minlength="9"
                maxlength="9"
                @input="validateBSN"
              />
              <small v-if="formData.bsn && !isValidBSN" class="error-message">
                Please enter a valid 9-digit BSN
              </small>
            </div>
            <div class="form-actions">
              <button
                type="submit"
                class="btn-primary"
                :disabled="!canProceedToStep2"
              >
                Next
              </button>
            </div>
          </form>

          <!-- Step 2: Account Information -->
          <form v-if="currentStep === 1" @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="form-control"
                :class="{ error: formData.email && !isValidEmail }"
                required
                @blur="validateEmail"
              />
              <small
                v-if="formData.email && !isValidEmail"
                class="error-message"
              >
                Please enter a valid email address
              </small>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                v-model="formData.password"
                class="form-control"
                :class="{ error: formData.password && !isStrongPassword }"
                required
                minlength="8"
              />
              <small
                v-if="formData.password && !isStrongPassword"
                class="error-message"
              >
                Password must be at least 8 characters
              </small>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="formData.confirmPassword"
                class="form-control"
                required
                :class="{
                  error:
                    formData.password &&
                    formData.password !== formData.confirmPassword,
                }"
              />
              <small
                v-if="
                  formData.password &&
                  formData.password !== formData.confirmPassword
                "
                class="error-message"
              >
                Passwords don't match
              </small>
            </div>
            <div class="form-group">
              <div class="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  v-model="formData.acceptedTerms"
                  required
                />
                <label for="terms"
                  >I accept the
                  <a href="#" @click.prevent="showTerms">Terms of Service</a>
                  and
                  <a href="#" @click.prevent="showPrivacy"
                    >Privacy Policy</a
                  ></label
                >
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-back" @click="prevStep">
                Back
              </button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="!canRegister || loading"
              >
                <span v-if="loading" class="spinner"></span>
                <span v-else>Create Account</span>
              </button>
            </div>
          </form>
        </div>

        <div class="login-link">
          Already have an account? <router-link to="/login">Log in</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "../axios-auth";
import { useRouter } from "vue-router";

const router = useRouter();

const steps = [{ label: "Personal" }, { label: "Account" }];

const currentStep = ref(0);
const error = ref(null);

const formData = ref({
  // Personal info
  firstName: "",
  lastName: "",
  phoneNumber: "", // Changed from 'phone'
  bsn: "",
  // Account info
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
});

const formatPhoneNumber = () => {
  // Remove all non-digit characters
  let phoneNumber = formData.value.phoneNumber.replace(/\D/g, "");

  // Limit to 10 digits
  phoneNumber = phoneNumber.substring(0, 10);

  // Update the model value
  formData.value.phoneNumber = phoneNumber;
};

const validateBSN = () => {
  // Simple validation - just check length for now
  formData.value.bsn = formData.value.bsn.replace(/\D/g, "");
};

const validateEmail = () => {
  // Email validation is handled by the computed property
};

const canProceedToStep2 = computed(() => {
  return (
    formData.value.firstName &&
    formData.value.lastName &&
    isValidPhone.value &&
    isValidBSN.value
  );
});

const canRegister = computed(() => {
  return (
    isValidEmail.value &&
    isStrongPassword.value &&
    formData.value.password === formData.value.confirmPassword &&
    formData.value.acceptedTerms
  );
});

const isValidPhone = computed(() => {
  return /^\d{10}$/.test(formData.value.phoneNumber);
});

const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email);
});

const isStrongPassword = computed(() => {
  return formData.value.password.length >= 8;
});

const isValidBSN = computed(() => {
  if (formData.value.bsn.length !== 9) return false;
  return true;
});

// Navigation methods
const nextStep = () => {
  if (currentStep.value === 0 && !canProceedToStep2.value) {
    return;
  }
  currentStep.value++;
};

const prevStep = () => {
  currentStep.value--;
};

const loading = ref(false);

const handleRegister = async () => {
  if (!canRegister.value || loading.value) return;

  error.value = null;
  loading.value = true;

  try {
    const payload = {
      email: formData.value.email,
      password: formData.value.password,
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      phoneNumber: formData.value.phoneNumber,
      bsn: formData.value.bsn,
    };

    const response = await axios.post("/users", payload);
    console.log("Registration successful:", response.data);

    // Redirect to login page with success message
    router.push({
      path: "/login",
      query: { registered: "true" },
    });
  } catch (err) {
    if (err.response?.data) {
      if (typeof err.response.data === "string") {
        error.value = err.response.data;
      } else if (err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value = JSON.stringify(err.response.data);
      }
    } else {
      error.value = err.message || "Registration failed";
    }

    if (
      error.value &&
      error.value.includes("java.lang.IllegalArgumentException")
    ) {
      error.value = error.value.split(":").slice(-1)[0].trim();
    }

    console.error("Registration error:", err);
  } finally {
    loading.value = false;
  }
};

const showTerms = () => {
  // Implement terms modal/show functionality
  console.log("Show terms");
};

const showPrivacy = () => {
  // Implement privacy policy modal/show functionality
  console.log("Show privacy policy");
};
</script>

<style scoped>
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f5fa;
  font-family: Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  flex: 1;
  z-index: 1;
  position: relative;
}

.login-card {
  background: #ffffffbb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  padding: 24px;
}

.login-title {
  color: #6c63ff;
  font-size: 28px;
  margin: 0 0 20px;
  font-weight: bold;
  text-align: center;
}

.progress-indicator {
  display: flex;
  justify-content: space-between;
  margin: 0 0 24px;
  position: relative;
}

.progress-indicator::before {
  content: "";
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #f4f5fa;
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f4f5fa;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  border: 2px solid #f4f5fa;
}

.step-label {
  font-size: 12px;
  color: #999;
  text-align: center;
}

.step.active .step-number {
  background-color: #6c63ff;
  color: white;
  border-color: #6c63ff;
}

.step.active .step-label {
  color: #6c63ff;
  font-weight: bold;
}

.step.completed .step-number {
  background-color: #6c63ff;
  color: white;
  border-color: #6c63ff;
}

.step.completed .step-label {
  color: #333;
}

/* Form container with fixed height */
.form-container {
  min-height: 380px;
  display: flex;
  flex-direction: column;
}

form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin: 0 0 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #f4f5fa;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  border-color: #6c63ff;
  outline: none;
}

.form-control.error {
  border-color: #ff6c63;
}

.error-message {
  color: #ff6c63;
  font-size: 12px;
  margin-top: 4px;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

.checkbox-group label {
  margin-bottom: 0;
  font-weight: normal;
  line-height: 1.4;
}

.checkbox-group input[type="checkbox"] {
  margin-top: 3px;
}

.form-actions {
  margin-top: auto;
  padding: 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-primary {
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #5a4fe0;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-back {
  background: none;
  border: none;
  color: #6c63ff;
  padding: 12px 0;
  cursor: pointer;
  font-size: 16px;
  text-decoration: underline;
  transition: color 0.2s;
}

.btn-back:hover {
  color: #5a4fe0;
  text-decoration: none;
}

.error-message {
  color: #ff6c63;
  margin: 16px 0 0;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #6c63ff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
