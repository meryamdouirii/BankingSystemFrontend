import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import ProductList from "../components/products/ProductList.vue";
import CreateProduct from "../components/products/CreateProduct.vue";
import EditProduct from "../components/products/EditProduct.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
const routes = [
  { path: "/", component: Home },
  { path: "/products", component: ProductList },
  { path: "/createproduct", component: CreateProduct },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/editproduct/:id", component: EditProduct, props: true },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
