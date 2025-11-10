<template>
  <div class="h-screen flex flex-col">
    <!-- Tab Navigation -->
    <NavigationTabs />

    <!-- Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar - Desktop -->
      <aside
        class="hidden md:flex w-60 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 overflow-y-auto flex flex-col"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-slate-900 dark:text-slate-100">
            メモ一覧
          </h2>
        </div>

        <!-- Memo Count Bar (HP Bar Style) -->
        <div
          class="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
        >
          <div class="flex items-center justify-between mb-2">
            <span
              class="text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              メモ: {{ memoStore.memos.length }}/{{
                maxMemos === Infinity ? "∞" : maxMemos
              }}
            </span>
            <span
              class="text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              {{ memoCountPercentage }}%
            </span>
          </div>
          <div
            class="w-full h-6 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden border border-slate-300 dark:border-slate-500"
          >
            <div
              class="h-full transition-all duration-300 flex items-center justify-center bg-slate-900 dark:bg-slate-100"
              :style="{ width: `${Math.min(memoCountPercentage, 100)}%` }"
            >
              <span
                v-if="memoCountPercentage > 20"
                class="text-xs font-bold text-white dark:text-slate-900 drop-shadow"
              >
                {{ memoStore.memos.length }}
              </span>
            </div>
          </div>
        </div>

        <!-- Premium Upgrade Button (shown when limit reached) -->
        <button
          v-if="!memoStore.canCreateMemo && memoStore.isFreePlan"
          @click="showUpgradeModal = true"
          class="w-full mb-4 px-3 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border-2 border-slate-700 dark:border-slate-300"
        >
          プレミアムにアップグレード
        </button>

        <button
          @click="createNewMemo"
          :disabled="!memoStore.canCreateMemo"
          class="w-full rounded px-3 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus :size="18" />
          新規作成
        </button>
        <div class="mt-6 flex-1">
          <MemoList />
        </div>
      </aside>

      <!-- Mobile Sidebar Overlay -->
      <div
        v-if="showMobileSidebar"
        class="fixed inset-0 z-40 md:hidden animate-in fade-in duration-200"
        @click="showMobileSidebar = false"
      >
        <div
          class="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        />
        <aside
          class="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-white dark:bg-slate-800 p-4 overflow-y-auto flex flex-col shadow-lg animate-in slide-in-from-left duration-300"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-slate-900 dark:text-slate-100">
              メモ一覧
            </h2>
            <button
              @click="showMobileSidebar = false"
              class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Memo Count Bar (Mobile) -->
          <div
            class="mb-4 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
          >
            <div class="flex items-center justify-between mb-2">
              <span
                class="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                メモ: {{ memoStore.memos.length }}/{{
                  maxMemos === Infinity ? "∞" : maxMemos
                }}
              </span>
              <span
                class="text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {{ memoCountPercentage }}%
              </span>
            </div>
            <div
              class="w-full h-5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden border border-slate-300 dark:border-slate-500"
            >
              <div
                class="h-full transition-all duration-300 flex items-center justify-center bg-slate-900 dark:bg-slate-100"
                :style="{ width: `${Math.min(memoCountPercentage, 100)}%` }"
              />
            </div>
          </div>

          <!-- Premium Upgrade Button (Mobile) -->
          <button
            v-if="!memoStore.canCreateMemo && memoStore.isFreePlan"
            @click="
              showUpgradeModal = true;
              showMobileSidebar = false;
            "
            class="w-full mb-4 px-3 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border-2 border-slate-700 dark:border-slate-300"
          >
            プレミアムにアップグレード
          </button>

          <button
            @click="createNewMemo"
            :disabled="!memoStore.canCreateMemo"
            class="w-full rounded px-3 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus :size="18" />
            新規作成
          </button>
          <div class="flex-1">
            <MemoList />
          </div>
        </aside>
      </div>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-hidden flex flex-col">
        <!-- Mobile Header -->
        <div
          class="md:hidden border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex items-center justify-between"
        >
          <button
            @click="showMobileSidebar = true"
            class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu :size="24" class="text-slate-600 dark:text-slate-400" />
          </button>
          <h2 class="font-semibold text-slate-900 dark:text-slate-100">メモ</h2>
          <div class="w-10" />
        </div>

        <div v-if="memoStore.currentMemo" class="flex-1 overflow-hidden">
          <MemoEditor :memo-id="memoStore.currentMemo.id" />
        </div>
        <div v-else class="flex h-full items-center justify-center flex-col">
          <div class="text-center">
            <p class="text-slate-400 mb-4">メモを選択してください</p>
            <button
              @click="createNewMemo"
              class="rounded px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Plus :size="18" />
              新規作成
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Plus, X, Menu, Moon, Sun } from "lucide-vue-next";
import { useMemoStore } from "~/stores/memo";
import { useAuthStore } from "~/stores/auth";
import { useRoute } from "vue-router";

const route = useRoute();
const memoStore = useMemoStore();
const authStore = useAuthStore();
const showMobileSidebar = ref(false);
const showUpgradeModal = ref(false);

// メモ枚数の上限
const FREE_PLAN_MAX_MEMOS = 10;
const maxMemos = computed(() => {
  return memoStore.isFreePlan ? FREE_PLAN_MAX_MEMOS : Infinity;
});

// メモ使用率をパーセンテージで計算
const memoCountPercentage = computed(() => {
  if (maxMemos.value === Infinity) return 0;
  return Math.round((memoStore.memos.length / maxMemos.value) * 100);
});

const isMemoDirect = computed(() => route.path === "/memo");
const isChatRoute = computed(() => route.path === "/chat");

// マウント時にストア初期化
onMounted(() => {
  authStore.initializeAuth();
  memoStore.initializeMemos();
  memoStore.initializeDarkMode();
});

const createNewMemo = () => {
  const memo = memoStore.createMemo("Untitled");
  memoStore.setCurrentMemo(memo.id);
  showMobileSidebar.value = false; // モバイル時はサイドバーを閉じる
};
</script>
