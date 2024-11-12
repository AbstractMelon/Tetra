import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";
import Community from "./views/Community.vue";
import CreateCommunity from "./views/CreateCommunity.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
    { path: "/c/:name", component: Community },
    { path: "/create-community", component: CreateCommunity },
  ],
});

export default router;
