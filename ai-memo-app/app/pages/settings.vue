<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">
    <!-- Navigation Tabs -->
    <NavigationTabs />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-12">
      <!-- Page Header -->
      <div class="mb-8 sm:mb-12">
        <h1
          class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2"
        >
          アカウント設定
        </h1>
        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          あなたのアカウント情報とアプリケーション設定を管理します
        </p>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-6 sm:space-y-8">
        <!-- Account Information Section -->
        <div
          class="border border-slate-200 dark:border-slate-800 rounded-lg p-8"
        >
          <h2
            class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6"
          >
            アカウント情報
          </h2>

          <form @submit.prevent="handleAccountUpdate" class="space-y-6">
            <!-- User Email -->
            <div>
              <label
                class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
              >
                メールアドレス
              </label>
              <input
                v-model="editingEmail"
                type="email"
                :readonly="!isEditingAccount"
                class="w-full px-4 py-3 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                :class="{
                  'bg-slate-50 dark:bg-slate-900 cursor-not-allowed':
                    !isEditingAccount,
                }"
              />
            </div>

            <!-- User Name -->
            <div>
              <label
                class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
              >
                ユーザー名
              </label>
              <input
                v-model="editingName"
                type="text"
                :readonly="!isEditingAccount"
                class="w-full px-4 py-3 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                :class="{
                  'bg-slate-50 dark:bg-slate-900 cursor-not-allowed':
                    !isEditingAccount,
                }"
              />
            </div>

            <!-- Account Type -->
            <div>
              <label
                class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
              >
                アカウントタイプ
              </label>
              <div
                class="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              >
                <span
                  v-if="isGuest"
                  class="text-yellow-600 dark:text-yellow-400 font-medium"
                >
                  ゲスト（無料）
                </span>
                <span
                  v-else
                  class="text-green-600 dark:text-green-400 font-medium"
                >
                  通常ユーザー（無料）
                </span>
              </div>
            </div>

            <!-- Memo Count -->
            <div>
              <label
                class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
              >
                メモ保存数
              </label>
              <div
                class="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              >
                {{ memoCount }} / 10
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="accountError"
              class="text-sm text-red-600 dark:text-red-400"
            >
              {{ accountError }}
            </div>

            <!-- Success Message -->
            <div
              v-if="accountSuccess"
              class="text-sm text-green-600 dark:text-green-400"
            >
              {{ accountSuccess }}
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-4 pt-4">
              <button
                v-if="!isEditingAccount"
                type="button"
                @click="startEdit"
                class="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
              >
                編集する
              </button>
              <template v-else>
                <button
                  type="submit"
                  :disabled="accountLoading"
                  class="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ accountLoading ? "保存中..." : "保存" }}
                </button>
                <button
                  type="button"
                  @click="cancelEdit"
                  class="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  キャンセル
                </button>
              </template>
            </div>
          </form>
        </div>

        <!-- API Settings Section (登録ユーザーのみ) -->
        <div
          v-if="!isGuest"
          class="border border-slate-200 dark:border-slate-800 rounded-lg p-8"
        >
          <h2
            class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2"
          >
            API 設定
          </h2>
          <p class="text-slate-600 dark:text-slate-400 mb-6">
            Gemini APIキーを設定して、AI機能を使用できます
          </p>

          <form @submit.prevent="handleApiKeySubmit" class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2"
              >
                Gemini APIキー
              </label>
              <div class="relative">
                <input
                  v-model="apiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  placeholder="AIzaSyD..."
                  class="w-full px-4 py-3 pr-12 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                />
                <button
                  type="button"
                  @click="showApiKey = !showApiKey"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <EyeOff v-if="showApiKey" :size="18" />
                  <Eye v-else :size="18" />
                </button>
              </div>
              <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                APIキーはこのブラウザのローカルストレージに保存されます。サーバーには送信されません。
              </p>
            </div>

            <!-- API Status -->
            <div>
              <label
                class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
              >
                API キー状態
              </label>
              <div
                v-if="hasApiKey"
                class="px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded"
              >
                <p
                  class="text-green-900 dark:text-green-100 font-medium flex items-center gap-2"
                >
                  <span
                    class="inline-block w-2 h-2 bg-green-600 rounded-full"
                  ></span>
                  設定済み
                </p>
              </div>
              <div
                v-else
                class="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded"
              >
                <p class="text-yellow-900 dark:text-yellow-100">
                  未設定 - AI機能を使用するには設定が必要です
                </p>
              </div>
            </div>

            <!-- Info Box -->
            <div
              class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"
            >
              <p class="text-sm text-blue-900 dark:text-blue-100 mb-2">
                <strong>APIキーの取得方法：</strong>
              </p>
              <ol
                class="text-xs text-blue-900 dark:text-blue-100 space-y-1 list-decimal list-inside"
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
                <li>「API キーを取得」をクリック</li>
                <li>作成されたAPIキーをコピーして上に貼り付けてください</li>
              </ol>
            </div>

            <!-- Error Message -->
            <div
              v-if="apiKeyError"
              class="text-sm text-red-600 dark:text-red-400"
            >
              {{ apiKeyError }}
            </div>

            <!-- Success Message -->
            <div
              v-if="apiKeySuccess"
              class="text-sm text-green-600 dark:text-green-400"
            >
              {{ apiKeySuccess }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="apiKeyLoading || !apiKey.trim()"
              class="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ apiKeyLoading ? "保存中..." : "APIキーを保存" }}
            </button>
          </form>
        </div>

        <!-- Guest AI Restriction Notice -->
        <div
          v-if="isGuest"
          class="border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 bg-yellow-50 dark:bg-yellow-900/10"
        >
          <h2
            class="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-4"
          >
            ⚠️ ゲストアカウントについて
          </h2>
          <p class="text-yellow-900 dark:text-yellow-100 mb-4">
            ゲストアカウントでは、セキュリティ上の理由からAI関連機能（チャット、メモ分析など）が利用できません。
          </p>
          <p class="text-sm text-yellow-800 dark:text-yellow-200">
            AI機能を使用するには、メールアドレスで登録してください。登録は無料です。
          </p>
        </div>

        <!-- Display Settings Section -->
        <div
          class="border border-slate-200 dark:border-slate-800 rounded-lg p-8"
        >
          <h2
            class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6"
          >
            表示設定
          </h2>

          <div class="space-y-6">
            <!-- Dark Mode Toggle -->
            <div class="flex items-center justify-between">
              <div>
                <label
                  class="text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  ダークモード
                </label>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  アプリケーションの配色を変更します
                </p>
              </div>
              <button
                @click="toggleDarkMode"
                :class="[
                  'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                  memoStore.isDarkMode
                    ? 'bg-slate-900 dark:bg-slate-100'
                    : 'bg-slate-300 dark:bg-slate-700',
                ]"
              >
                <span
                  :class="[
                    'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                    memoStore.isDarkMode ? 'translate-x-7' : 'translate-x-1',
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Danger Zone Section -->
        <div
          class="border border-red-200 dark:border-red-800 rounded-lg p-8 bg-red-50 dark:bg-red-900/10"
        >
          <h2 class="text-2xl font-bold text-red-900 dark:text-red-100 mb-6">
            危険なアクション
          </h2>

          <div class="space-y-4">
            <!-- Logout Button -->
            <div>
              <button
                @click="handleLogout"
                class="px-6 py-3 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors"
              >
                ログアウト
              </button>
              <p class="text-sm text-red-900 dark:text-red-100 mt-2">
                このアカウントからログアウトします
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Eye, EyeOff } from "lucide-vue-next";
import { useMemoStore } from "~/stores/memo";
import { useAuthStore } from "~/stores/auth";

const memoStore = useMemoStore();
const authStore = useAuthStore();

// Account Info
const isEditingAccount = ref(false);
const editingEmail = ref("");
const editingName = ref("");
const accountLoading = ref(false);
const accountError = ref("");
const accountSuccess = ref("");

// API Key
const apiKey = ref("");
const showApiKey = ref(false);
const apiKeyLoading = ref(false);
const apiKeyError = ref("");
const apiKeySuccess = ref("");

// Computed
const hasApiKey = computed(() => authStore.hasGeminiApiKey());
const userEmail = computed(() => authStore.user?.email || "未設定");
const userName = computed(() => authStore.user?.name || "ユーザー");
const isGuest = computed(() => authStore.isGuest);
const memoCount = computed(() => memoStore.memos.length);

// Methods
const startEdit = () => {
  isEditingAccount.value = true;
  editingEmail.value = authStore.user?.email || "";
  editingName.value = authStore.user?.name || "";
  accountError.value = "";
  accountSuccess.value = "";
};

const cancelEdit = () => {
  isEditingAccount.value = false;
  editingEmail.value = "";
  editingName.value = "";
  accountError.value = "";
  accountSuccess.value = "";
};

const handleAccountUpdate = async () => {
  accountError.value = "";
  accountSuccess.value = "";

  if (!editingEmail.value.trim()) {
    accountError.value = "メールアドレスを入力してください";
    return;
  }

  if (!editingName.value.trim()) {
    accountError.value = "ユーザー名を入力してください";
    return;
  }

  // 簡易的なメールアドレスバリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editingEmail.value)) {
    accountError.value = "有効なメールアドレスを入力してください";
    return;
  }

  accountLoading.value = true;
  try {
    // User情報を更新
    if (authStore.user) {
      authStore.user.email = editingEmail.value.trim();
      authStore.user.name = editingName.value.trim();
      // localStorageに保存
      if (process.client) {
        localStorage.setItem("user", JSON.stringify(authStore.user));
      }
    }

    accountSuccess.value = "アカウント情報が更新されました";
    setTimeout(() => {
      isEditingAccount.value = false;
      accountSuccess.value = "";
    }, 2000);
  } catch (err) {
    accountError.value = "エラーが発生しました。もう一度お試しください。";
    console.error(err);
  } finally {
    accountLoading.value = false;
  }
};

const handleApiKeySubmit = async () => {
  apiKeyError.value = "";
  apiKeySuccess.value = "";

  if (!apiKey.value.trim()) {
    apiKeyError.value = "APIキーを入力してください";
    return;
  }

  if (!apiKey.value.trim().startsWith("AIza")) {
    apiKeyError.value = "有効なAPIキーを入力してください（AIzaで始まります）";
    return;
  }

  apiKeyLoading.value = true;
  try {
    authStore.setGeminiApiKey(apiKey.value.trim());
    apiKeySuccess.value = "APIキーが保存されました";
    apiKey.value = ""; // フォームをクリア
    showApiKey.value = false;
    setTimeout(() => {
      apiKeySuccess.value = "";
    }, 3000);
  } catch (err) {
    apiKeyError.value = "エラーが発生しました。もう一度お試しください。";
    console.error(err);
  } finally {
    apiKeyLoading.value = false;
  }
};

const toggleDarkMode = () => {
  memoStore.toggleDarkMode();
};

const handleLogout = () => {
  if (confirm("本当にログアウトしますか？")) {
    authStore.logout();
    navigateTo("/login");
  }
};

// Page Setup
onMounted(() => {
  memoStore.initializeDarkMode();
  authStore.initializeAuth();

  if (!authStore.isAuthenticated) {
    navigateTo("/login");
  }
});
</script>
