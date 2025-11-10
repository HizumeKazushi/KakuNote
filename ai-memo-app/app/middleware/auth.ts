import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // ログインとホームページは保護されていない
  if (to.path === "/login" || to.path === "/") {
    return;
  }

  // 認証が必要なページ
  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
