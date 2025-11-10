<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          APIキー設定
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Google Gemini APIキーを入力してください
        </p>
      </div>

      <!-- Info Box -->
      <div
        class="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"
      >
        <p class="text-sm text-blue-900 dark:text-blue-100 mb-3">
          <strong>Google Gemini APIキーを取得する方法：</strong>
        </p>
        <ol
          class="text-xs text-blue-900 dark:text-blue-100 space-y-2 list-decimal list-inside"
        >
          <li>
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:font-semibold"
            >
              Google AI Studio
            </a>
            にアクセス
          </li>
          <li>Googleアカウントでログイン</li>
          <li>「API キーを取得」をクリック</li>
          <li>作成されたAPIキーをコピーして下に貼り付けてください</li>
        </ol>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4 mb-6">
        <div>
          <label
            class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
          >
            Gemini APIキー
          </label>
          <input
            v-model="apiKey"
            type="password"
            placeholder="AIzaSyD..."
            class="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            required
          />
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
            APIキーはこのブラウザのローカルストレージに保存されます
          </p>
        </div>

        <div v-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          {{ isLoading ? "設定中..." : "設定して続行" }}
        </button>
      </form>

      <!-- Skip Button -->
      <button
        @click="handleSkip"
        class="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
      >
        スキップ（後で設定）
      </button>

      <!-- Warning -->
      <div
        class="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-900 dark:text-yellow-100"
      >
        <p class="font-medium mb-2">⚠️ APIキーを設定しないと</p>
        <p>
          AI機能（アイデア生成、要約、タグ抽出、タスク抽出、チャット）は使用できません。
          後からいつでも設定できます。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

const apiKey = ref("");
const isLoading = ref(false);
const error = ref("");

const handleSubmit = async () => {
  error.value = "";

  if (!apiKey.value.trim()) {
    error.value = "APIキーを入力してください";
    return;
  }

  if (!apiKey.value.trim().startsWith("AIza")) {
    error.value = "有効なAPIキーを入力してください（AIzaで始まります）";
    return;
  }

  isLoading.value = true;
  try {
    // APIキーを設定
    authStore.setGeminiApiKey(apiKey.value.trim());

    // メモページへ遷移
    await navigateTo("/memo");
  } catch (err) {
    error.value = "エラーが発生しました。もう一度お試しください。";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleSkip = () => {
  // APIキーなしでメモページへ
  navigateTo("/memo");
};

onMounted(() => {
  // ゲストアカウントの場合はダッシュボードへ
  if (authStore.isGuest) {
    navigateTo("/dashboard");
    return;
  }

  // 既にAPIキーが設定されている場合はメモページへ
  if (authStore.hasGeminiApiKey()) {
    navigateTo("/memo");
    return;
  }

  // ログインしていない場合はログインページへ
  if (!authStore.isAuthenticated) {
    navigateTo("/login");
  }
});
</script>
