<template>
  <div class="h-screen flex flex-col">
    <!-- Tab Navigation -->
    <NavigationTabs />

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar - Desktop -->
      <aside
        class="hidden md:flex w-60 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 overflow-y-auto flex flex-col"
      >
        <div class="mb-4">
          <input
            v-model="selectedDate"
            type="date"
            class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
          />
        </div>

        <button
          @click="createNewDiary"
          class="w-full px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors mb-4 flex items-center justify-center gap-2"
        >
          <Plus :size="18" />
          新規日記
        </button>

        <!-- Diary List -->
        <div class="space-y-2 flex-1">
          <div
            v-if="sortedDiaries.length === 0"
            class="text-center text-slate-500 dark:text-slate-400 py-8"
          >
            <p class="text-sm">日記がまだありません</p>
          </div>
          <button
            v-for="diary in sortedDiaries"
            :key="diary.id"
            @click="selectDiary(diary.id)"
            class="w-full text-left px-3 py-2 rounded transition-colors"
            :class="[
              isSelected(diary.id)
                ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
            ]"
          >
            <div class="font-medium truncate text-sm">{{ diary.title }}</div>
            <div class="text-xs opacity-70 truncate">{{ diary.date }}</div>
          </button>
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
          class="absolute left-0 top-0 h-full w-60 max-w-[80vw] bg-white dark:bg-slate-800 p-4 overflow-y-auto flex flex-col shadow-lg animate-in slide-in-from-left duration-300"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-slate-900 dark:text-slate-100">
              日記一覧
            </h2>
            <button
              @click="showMobileSidebar = false"
              class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X :size="20" />
            </button>
          </div>
          <div class="mb-4">
            <input
              v-model="selectedDate"
              type="date"
              class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-sm"
            />
          </div>
          <button
            @click="createNewDiary"
            class="w-full px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors mb-4 flex items-center justify-center gap-2 text-sm"
          >
            <Plus :size="18" />
            新規日記
          </button>
          <!-- Diary List -->
          <div class="space-y-2 flex-1">
            <div
              v-if="sortedDiaries.length === 0"
              class="text-center text-slate-500 dark:text-slate-400 py-8"
            >
              <p class="text-sm">日記がまだありません</p>
            </div>
            <button
              v-for="diary in sortedDiaries"
              :key="diary.id"
              @click="
                selectDiary(diary.id);
                showMobileSidebar = false;
              "
              class="w-full text-left px-3 py-2 rounded transition-colors"
              :class="[
                isSelected(diary.id)
                  ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
              ]"
            >
              <div class="font-medium truncate text-sm">{{ diary.title }}</div>
              <div class="text-xs opacity-70 truncate">{{ diary.date }}</div>
            </button>
          </div>
        </aside>
      </div>

      <!-- Editor -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <div
          v-if="!currentDiary"
          class="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 p-4"
        >
          <div class="text-center">
            <p class="text-base sm:text-lg font-medium mb-2">
              日記を選択してください
            </p>
            <p class="text-xs sm:text-sm">
              左のリストから日記を選ぶか、「新規日記」をクリック
            </p>
            <button
              @click="showMobileSidebar = true"
              class="md:hidden mt-4 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <Menu :size="18" />
              日記一覧を開く
            </button>
          </div>
        </div>

        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <!-- Header -->
          <div
            class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between gap-2"
          >
            <div class="flex-1 min-w-0">
              <input
                v-model="currentDiary.title"
                @blur="updateCurrentDiary"
                type="text"
                class="w-full text-lg sm:text-2xl font-bold bg-transparent text-slate-900 dark:text-slate-100 border-none outline-none truncate"
              />
              <p
                class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1"
              >
                {{ currentDiary.date }}
              </p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                @click="showMobileSidebar = true"
                class="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Menu :size="20" class="text-slate-600 dark:text-slate-400" />
              </button>
              <!-- Mood Selector -->
              <div
                class="hidden sm:flex items-center gap-1 border border-slate-300 dark:border-slate-600 rounded p-1"
              >
                <button
                  @click="setMood('happy')"
                  :class="[
                    'px-2 py-1 sm:px-3 sm:py-2 rounded transition-colors flex items-center gap-1',
                    currentDiary.mood === 'happy'
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400',
                  ]"
                  title="良い"
                >
                  <ThumbsUp :size="16" />
                  <span class="text-xs sm:text-sm hidden sm:inline">良い</span>
                </button>
                <button
                  @click="setMood('neutral')"
                  :class="[
                    'px-2 py-1 sm:px-3 sm:py-2 rounded transition-colors flex items-center gap-1',
                    currentDiary.mood === 'neutral'
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400',
                  ]"
                  title="普通"
                >
                  <Minus :size="16" />
                  <span class="text-xs sm:text-sm hidden sm:inline">普通</span>
                </button>
                <button
                  @click="setMood('sad')"
                  :class="[
                    'px-2 py-1 sm:px-3 sm:py-2 rounded transition-colors flex items-center gap-1',
                    currentDiary.mood === 'sad'
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400',
                  ]"
                  title="悪い"
                >
                  <ThumbsDown :size="16" />
                  <span class="text-xs sm:text-sm hidden sm:inline">悪い</span>
                </button>
              </div>

              <!-- Delete Button -->
              <button
                @click="deleteCurrent"
                class="px-2 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex-shrink-0"
                title="削除"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </div>

          <!-- Editor -->
          <div class="flex-1 overflow-hidden px-4 sm:px-8 py-4">
            <textarea
              v-model="currentDiary.content"
              @blur="updateCurrentDiary"
              placeholder="今日の思いを記録しましょう..."
              class="w-full h-full resize-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-3 sm:p-4 text-sm sm:text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            />
          </div>

          <!-- Footer -->
          <div
            class="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 sm:px-8 py-3 text-xs text-slate-500 dark:text-slate-400"
          >
            最終更新: {{ formatDate(currentDiary.updatedAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  Plus,
  Trash2,
  ThumbsUp,
  Minus,
  ThumbsDown,
  Menu,
  X,
} from "lucide-vue-next";
import { useMemoStore } from "~/stores/memo";
import { useAuthStore } from "~/stores/auth";

const memoStore = useMemoStore();
const authStore = useAuthStore();

const selectedDate = ref(getTodayDate());
const showMobileSidebar = ref(false);

const sortedDiaries = computed(() => {
  return memoStore.diaries.sort((a, b) => {
    return b.date.localeCompare(a.date);
  });
});

const currentDiary = computed(() => {
  return memoStore.diaries.find((d) => d.id === memoStore.currentDiaryId);
});

function getTodayDate(): string {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  return dateStr || "";
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString("ja-JP");
}

function isSelected(id: string): boolean {
  return memoStore.currentDiaryId === id;
}

function selectDiary(id: string) {
  memoStore.setCurrentDiary(id);
}

function createNewDiary() {
  const diary = memoStore.createDiary(selectedDate.value);
  memoStore.setCurrentDiary(diary.id);
}

function setMood(mood: string) {
  if (currentDiary.value) {
    currentDiary.value.mood = mood;
    updateCurrentDiary();
  }
}

function updateCurrentDiary() {
  if (currentDiary.value) {
    memoStore.updateDiary(currentDiary.value.id, {
      title: currentDiary.value.title,
      content: currentDiary.value.content,
      mood: currentDiary.value.mood,
    });
  }
}

function deleteCurrent() {
  if (!currentDiary.value) return;
  if (confirm("このダイアリーを削除しますか？")) {
    const id = currentDiary.value.id;
    memoStore.deleteDiary(id);
  }
}

onMounted(() => {
  memoStore.initializeDarkMode();
  memoStore.initializeDiaries();
  authStore.initializeAuth();

  if (!authStore.isAuthenticated) {
    navigateTo("/login");
  }

  // 今日の日記があれば選択、なければ作成
  const todaysDiary = memoStore.getDiaryByDate(getTodayDate());
  if (todaysDiary) {
    memoStore.setCurrentDiary(todaysDiary.id);
  } else {
    const diary = memoStore.createDiary(getTodayDate());
    memoStore.setCurrentDiary(diary.id);
  }
});
</script>
