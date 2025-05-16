// stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    expiresAt: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      this.userId = payload.id  // <-- UserID opslaan
      this.expiresAt = payload.exp * 1000; // Convert to ms

      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_userId", this.userId)
      localStorage.setItem("auth_expiresAt", this.expiresAt);
    },
    loadToken() {
      const token = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("auth_userId")
      const expiresAt = +localStorage.getItem("auth_expiresAt");
      if (token && Date.now() < expiresAt) {
        this.token = token;
        this.expiresAt = expiresAt;
      } else {
        this.logout();
      }
    },
    logout() {
      this.token = null;
      this.expiresAt = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_expiresAt");
    },
    isAuthenticated() {
      return this.token && Date.now() < this.expiresAt;
    },
  },
});
