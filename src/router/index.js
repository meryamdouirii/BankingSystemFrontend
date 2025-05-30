import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { computed } from "vue";

import Home from "../components/Home.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import ManageUsers from "../components/employee/ManageUsers.vue";
import ViewAccount from "@/components/customer/ViewAccount.vue";
import TransactionHistory from "@/components/transactions/TransactionOverview.vue";
import ManageUserAccounts from "../components/employee/AccountView.vue";
import ManageUser from "../components/employee/UserView.vue";
import Forbidden from "../components/Forbidden.vue";
const routes = [
  { path: "/", component: Home, meta: {authRequired:false} },
  {path: "/403-forbidden", component: Forbidden , meta: {authRequired:false}},
  { path: "/manage-users", component: ManageUsers, meta: {authRequired:true, roles:["ROLE_ADMINISTRATOR","ROLE_EMPLOYEE"]} },
  { path: "/login", component: Login , meta: {authRequired:false}},
  { path: "/register", component: Register , meta: {authRequired:false}},
  { path: "/view-account", component: ViewAccount ,meta:{
    authRequired: true, roles: ["ROLE_CUSTOMER"]
  }},
  { path: "/transactionhistory", component: TransactionHistory, meta: {authRequired:true, roles:["ROLE_CUSTOMER"]} },
  { path: "/manage-user-accounts/:id", component: ManageUserAccounts, meta: {authRequired:true, roles:["ROLE_ADMINISTRATOR","ROLE_EMPLOYEE"]} },
  { path: "/manage-user/:id", component: ManageUser, meta: {authRequired:true, roles:["ROLE_ADMINISTRATOR","ROLE_EMPLOYEE"]} },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});
// Navigation guard to check authentication
// This guard checks if the user is authenticated before accessing certain routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const userRole = computed(() => authStore.userRole);
  const loggedIn = computed(() => !!authStore.token);

  if (to.meta?.authRequired) {
    if (!loggedIn.value) {
      return next("/login");
    }

    if (to.meta?.roles && !to.meta.roles.includes(userRole.value)) {
      return next("/403-forbidden");
    }
  }

  return next();
});


export default router;
