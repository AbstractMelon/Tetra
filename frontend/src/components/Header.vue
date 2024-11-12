<template>
  <header class="header">
    <router-link to="/" class="logo">Tetra</router-link>
    <div v-if="authStore.user" class="user-menu">
      <span>{{ authStore.user.username }}</span>
      <button @click="logout">Logout</button>
    </div>
    <div v-else class="auth-links">
      <router-link to="/login">Login</router-link>
      <router-link to="/signup">Sign Up</router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "../stores/auth";

export default defineComponent({
  name: "Header",
  setup() {
    const authStore = useAuthStore();

    const logout = () => {
      authStore.logout();
    };

    return {
      authStore,
      logout,
    };
  },
});
</script>
