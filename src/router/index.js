import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import ManageUsers from "../components/employee/ManageUsers.vue";
import ViewAccount from "@/components/customer/ViewAccount.vue";
import TransactionHistory from "@/components/customer/transaction-history/TransactionOverview.vue";
import ManageUserAccounts from "../components/employee/AccountView.vue"
const routes = [
  { path: "/", component: Home },
  { path: "/manage-users", component: ManageUsers },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/view-account", component: ViewAccount },
  { path: "/transactionhistory", component: TransactionHistory },
  { path: "/manage-user-accounts/:id", component: ManageUserAccounts },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});
// Navigation guard to check authentication
// This guard checks if the user is authenticated before accessing certain routes
router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register", "/"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("auth_token");

  if (authRequired && !loggedIn) {
    return next("/login");
  }
  next();
});
  

export default router;
