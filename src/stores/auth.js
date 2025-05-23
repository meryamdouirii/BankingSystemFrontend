// stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    userId: null,
    userRole: null,
    expiresAt: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      this.userId = payload.id  // <-- UserID opslaan
      this.expiresAt = payload.exp * 1000; // Convert to ms
      this.userRole = payload.auth; 

      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_userId", this.userId)
      localStorage.setItem("auth_userRole", this.userRole)
      localStorage.setItem("auth_expiresAt", this.expiresAt);
    },
    loadToken() {
      const token = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("auth_userId");
      const userRole = localStorage.getItem("auth_userRole");
      const expiresAt = +localStorage.getItem("auth_expiresAt");
      if (token && Date.now() < expiresAt) {
        this.token = token;
        this.userId = userId;
        this.userRole = userRole;
        this.expiresAt = expiresAt;
      } else {
        this.logout();
      }
    },
    logout() {
      this.token = null;
      this.expiresAt = null;
      this.userId = null;
      this.userRole = null;
      localStorage.removeItem("auth_userId");
      localStorage.removeItem("auth_userRole");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_expiresAt");
    },
    isAuthenticated() {
      return this.token && Date.now() < this.expiresAt;
    },
  },
});
