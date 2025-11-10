<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Kaku Note
        </h1>
        <p class="text-slate-600 dark:text-slate-400">思考をAIが次のレベルへ</p>
      </div>

      <!-- Tabs -->
      <div
        class="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-700"
      >
        <button
          @click="activeTab = 'login'"
          :class="[
            'pb-3 px-2 font-medium text-sm transition-colors border-b-2',
            activeTab === 'login'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
          ]"
        >
          ログイン
        </button>
        <button
          @click="activeTab = 'register'"
          :class="[
            'pb-3 px-2 font-medium text-sm transition-colors border-b-2',
            activeTab === 'register'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
          ]"
        >
          新規登録
        </button>
      </div>

      <!-- Login Form -->
      <form
        v-if="activeTab === 'login'"
        @submit.prevent="handleLogin"
        class="space-y-4 mb-6"
      >
        <div>
          <label
            class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
          >
            メールアドレス
          </label>
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="user@example.com"
            class="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            required
          />
        </div>
        <div>
          <label
            class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
          >
            パスワード
          </label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            required
          />
        </div>
        <div v-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? "ログイン中..." : "ログイン" }}
        </button>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4 mb-6">
        <div>
          <label
            class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
          >
            ユーザー名
          </label>
          <input
            v-model="registerForm.name"
            type="text"
            placeholder="太郎"
            class="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            required
          />
        </div>
        <div>
          <label
            class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
          >
            メールアドレス
          </label>
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="user@example.com"
            class="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            required
          />
        </div>
        <div>
          <label
            class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
          >
            パスワード
          </label>
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            required
          />
        </div>
        <div>
          <label
            class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
          >
            パスワード（確認）
          </label>
          <input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            required
          />
        </div>
        <div v-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? "登録中..." : "登録" }}
        </button>
      </form>

      <!-- Divider -->
      <div class="relative mb-6">
        <div class="absolute inset-0 flex items-center">
          <div
            class="w-full border-t border-slate-300 dark:border-slate-600"
          ></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span
            class="px-2 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400"
          >
            または
          </span>
        </div>
      </div>

      <!-- Guest Login -->
      <button
        @click="handleGuestLogin"
        :disabled="isLoading"
        class="w-full px-4 py-2 border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 rounded font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
      >
        ゲストでログイン
      </button>

      <!-- Info Text -->
      <div
        class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-900 dark:text-blue-100"
      >
        <p class="font-medium mb-2">ゲストモードについて</p>
        <ul class="space-y-1 text-xs">
          <li>• 1日10回まで無料でAI機能を利用できます</li>
          <li>• メモはブラウザに保存されます（永続化されません）</li>
          <li>• アカウント登録でメモを保存して使い続けることができます</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useMemoStore } from "~/stores/memo";

const authStore = useAuthStore();
const memoStore = useMemoStore();

const activeTab = ref<"login" | "register">("login");
const isLoading = ref(false);
const error = ref("");

const loginForm = ref({
  email: "",
  password: "",
});

const registerForm = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleLogin = async () => {
  error.value = "";

  if (!loginForm.value.email || !loginForm.value.password) {
    error.value = "メールアドレスとパスワードを入力してください";
    return;
  }

  isLoading.value = true;
  try {
    await authStore.login(loginForm.value.email, loginForm.value.password);
    memoStore.initializeMemos();
    navigateTo("/dashboard");
  } catch (err) {
    error.value = "ログインに失敗しました。もう一度お試しください。";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  error.value = "";

  if (
    !registerForm.value.name ||
    !registerForm.value.email ||
    !registerForm.value.password
  ) {
    error.value = "すべての項目を入力してください";
    return;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = "パスワードが一致しません";
    return;
  }

  if (registerForm.value.password.length < 6) {
    error.value = "パスワードは6文字以上で設定してください";
    return;
  }

  isLoading.value = true;
  try {
    await authStore.register(
      registerForm.value.email,
      registerForm.value.name,
      registerForm.value.password
    );
    memoStore.initializeMemos();
    navigateTo("/dashboard");
  } catch (err) {
    error.value = "登録に失敗しました。もう一度お試しください。";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleGuestLogin = () => {
  authStore.loginAsGuest();
  memoStore.initializeMemos();
  navigateTo("/dashboard");
};

onMounted(() => {
  // 既にログインしている場合はメモページへリダイレクト
  if (authStore.isAuthenticated) {
    navigateTo("/memo");
  }
});
</script>
