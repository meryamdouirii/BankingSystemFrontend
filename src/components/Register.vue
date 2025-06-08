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
        // Strip known prefixes
        error.value = err.response.data.replace(
          /^Internal Server Error:\s*/,
          ""
        );
      } else if (err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value = JSON.stringify(err.response.data);
      }
    } else {
      error.value = err.message || "Registration failed";
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

<style scoped></style>
