import axios from "axios";
import router from "./router";

// Create Axios instance
const instance = axios.create({
  //baseURL: "https://centjesbank.onrender.com/api/",
  baseURL: "http://localhost:8080/api",
});

// Helper: Check if JWT is expired
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp < now;
  } catch (e) {
    console.warn("Invalid token", e);
    return true;
  }
}

function showSessionExpiredMessage() {
  const message =
    "Your session has expired for security reasons. Please log in again to continue.";
  alert(message);
}

let hasShownExpiryMessage = false;

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      const expired = isTokenExpired(token);

      if (expired) {
        // Clean up local storage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_userId");
        localStorage.removeItem("auth_userRole");
        localStorage.removeItem("auth_expiresAt");
        localStorage.removeItem("auth_loginType");

        // Show message only once
        if (!hasShownExpiryMessage) {
          hasShownExpiryMessage = true;
          showSessionExpiredMessage();

          // Reset the flag after a delay
          setTimeout(() => {
            hasShownExpiryMessage = false;
          }, 5000);
        }

        console.log("Token expired - redirecting to login");
        router.push("/login");
        throw new axios.Cancel("Session expired");
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors from server
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired or invalid according to server
      if (!hasShownExpiryMessage) {
        hasShownExpiryMessage = true;
        showSessionExpiredMessage();

        setTimeout(() => {
          hasShownExpiryMessage = false;
        }, 5000);
      }

      // Clean up and redirect
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_userId");
      localStorage.removeItem("auth_userRole");
      localStorage.removeItem("auth_expiresAt");
      localStorage.removeItem("auth_loginType");

      router.push("/login");
    }

    return Promise.reject(error);
  }
);

export default instance;
