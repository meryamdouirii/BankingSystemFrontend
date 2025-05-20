import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import ManageUsers from "../components/employee/ManageUsers.vue";
import ViewAccount from "@/components/customer/ViewAccount.vue";
import TransactionHistory from "@/components/customer/transaction-history/TransactionOverview.vue";
const routes = [
  { path: "/", component: Home },
  { path: "/manage-users", component: ManageUsers },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/view-account", component: ViewAccount },
  { path: "/transactionhistory", component: TransactionHistory },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
