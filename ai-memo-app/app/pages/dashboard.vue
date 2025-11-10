<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Navigation Tabs -->
    <NavigationTabs />

    <!-- Header -->
    <div
      class="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
    >
      <div
        class="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between"
      >
        <div class="flex-1">
          <h1
            class="text-xl md:text-3xl font-bold text-slate-900 dark:text-slate-100"
          >
            ダッシュボード
          </h1>
          <p
            class="hidden sm:block mt-1 text-sm text-slate-500 dark:text-slate-400"
          >
            {{ userName }}さんのメモとチャット
          </p>
        </div>
        <button
          @click="memoStore.toggleDarkMode"
          class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Moon
            v-if="!memoStore.isDarkMode"
            :size="20"
            class="text-slate-600 dark:text-slate-400"
          />
          <Sun v-else :size="20" class="text-slate-600 dark:text-slate-400" />
        </button>
        <button
          @click="logout"
          class="px-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          ログアウト
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div
          class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <p
                class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium"
              >
                メモ数
              </p>
              <p
                class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2"
              >
                {{ memoStore.memos.length }}
              </p>
            </div>
            <FileText
              :size="20"
              class="sm:hidden text-slate-400 dark:text-slate-500"
            />
            <FileText
              :size="24"
              class="hidden sm:block text-slate-400 dark:text-slate-500"
            />
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <p
                class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium"
              >
                チャット
              </p>
              <p
                class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2"
              >
                {{ memoStore.chatSessions.length }}
              </p>
            </div>
            <MessageSquare
              :size="20"
              class="sm:hidden text-slate-400 dark:text-slate-500"
            />
            <MessageSquare
              :size="24"
              class="hidden sm:block text-slate-400 dark:text-slate-500"
            />
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 sm:col-span-2 lg:col-span-1"
        >
          <div class="flex items-center justify-between">
            <div>
              <p
                class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium"
              >
                日記数
              </p>
              <p
                class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2"
              >
                {{ memoStore.diaries.length }}
              </p>
            </div>
            <BookOpen
              :size="20"
              class="sm:hidden text-slate-400 dark:text-slate-500"
            />
            <BookOpen
              :size="24"
              class="hidden sm:block text-slate-400 dark:text-slate-500"
            />
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        <button
          @click="navigateTo('/memo')"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <div class="text-left">
            <p
              class="font-medium text-slate-900 dark:text-slate-100 text-sm sm:text-base"
            >
              新規メモを作成
            </p>
            <p
              class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1"
            >
              メモの編集とAI機能を使用
            </p>
          </div>
          <Plus
            :size="20"
            class="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-3 sm:mt-0 sm:ml-4"
          />
        </button>

        <button
          @click="navigateTo('/chat')"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <div class="text-left">
            <p
              class="font-medium text-slate-900 dark:text-slate-100 text-sm sm:text-base"
            >
              チャットを開く
            </p>
            <p
              class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1"
            >
              AIとの会話でアイデア出し
            </p>
          </div>
          <MessageCircle
            :size="20"
            class="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-3 sm:mt-0 sm:ml-4"
          />
        </button>
      </div>

      <!-- Mood Statistics Section -->
      <div
        class="mb-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6"
      >
        <div class="flex items-center gap-2 mb-6">
          <Smile
            :size="18"
            class="sm:hidden text-slate-600 dark:text-slate-400"
          />
          <Smile
            :size="20"
            class="hidden sm:block text-slate-600 dark:text-slate-400"
          />
          <h2
            class="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            気分統計
          </h2>
        </div>
        <div class="grid grid-cols-3 gap-3 sm:gap-6">
          <!-- Happy Count -->
          <div class="text-center">
            <div class="flex justify-center mb-2 sm:mb-3">
              <ThumbsUp
                :size="18"
                class="sm:hidden text-green-600 dark:text-green-400"
              />
              <ThumbsUp
                :size="24"
                class="hidden sm:block text-green-600 dark:text-green-400"
              />
            </div>
            <p
              class="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100"
            >
              {{ moodStats.happy }}
            </p>
            <p
              class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2"
            >
              良い日
            </p>
          </div>

          <!-- Neutral Count -->
          <div class="text-center">
            <div class="flex justify-center mb-2 sm:mb-3">
              <Minus
                :size="18"
                class="sm:hidden text-yellow-600 dark:text-yellow-400"
              />
              <Minus
                :size="24"
                class="hidden sm:block text-yellow-600 dark:text-yellow-400"
              />
            </div>
            <p
              class="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100"
            >
              {{ moodStats.neutral }}
            </p>
            <p
              class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2"
            >
              普通の日
            </p>
          </div>

          <!-- Sad Count -->
          <div class="text-center">
            <div class="flex justify-center mb-2 sm:mb-3">
              <ThumbsDown
                :size="18"
                class="sm:hidden text-red-600 dark:text-red-400"
              />
              <ThumbsDown
                :size="24"
                class="hidden sm:block text-red-600 dark:text-red-400"
              />
            </div>
            <p
              class="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100"
            >
              {{ moodStats.sad }}
            </p>
            <p
              class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2"
            >
              悪い日
            </p>
          </div>
        </div>
      </div>

      <!-- Two Column Layout: Memos and Chat Sessions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <!-- Recent Memos -->
        <div
          class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div
            class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2"
          >
            <FileText :size="18" class="text-slate-600 dark:text-slate-400" />
            <h2
              class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              最近のメモ
            </h2>
          </div>
          <div class="divide-y divide-slate-200 dark:divide-slate-700">
            <div
              v-if="recentMemos.length === 0"
              class="p-6 text-center text-slate-500 dark:text-slate-400"
            >
              <p class="text-sm">メモがまだありません</p>
              <button
                @click="navigateTo('/memo')"
                class="mt-3 text-slate-900 dark:text-slate-100 hover:underline font-medium text-sm"
              >
                最初のメモを作成
              </button>
            </div>
            <button
              v-for="memo in recentMemos"
              :key="memo.id"
              @click="navigateTo(`/memo?id=${memo.id}`)"
              class="w-full text-left p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-medium text-slate-900 dark:text-slate-100 truncate"
                  >
                    {{ memo.title || "Untitled" }}
                  </h3>
                  <p
                    class="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2"
                  >
                    {{ memo.content.substring(0, 100)
                    }}{{ memo.content.length > 100 ? "..." : "" }}
                  </p>
                  <p class="mt-2 text-xs text-slate-500 dark:text-slate-500">
                    {{ formatDate(memo.updatedAt) }}
                  </p>
                </div>
                <div v-if="memo.isPinned" class="flex-shrink-0">
                  <Pin :size="16" class="text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Recent Chat Sessions -->
        <div
          class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div
            class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2"
          >
            <MessageSquare
              :size="18"
              class="text-slate-600 dark:text-slate-400"
            />
            <h2
              class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              最近のチャット
            </h2>
          </div>
          <div class="divide-y divide-slate-200 dark:divide-slate-700">
            <div
              v-if="recentSessions.length === 0"
              class="p-6 text-center text-slate-500 dark:text-slate-400"
            >
              <p class="text-sm">チャットセッションがまだありません</p>
              <button
                @click="navigateTo('/chat')"
                class="mt-3 text-slate-900 dark:text-slate-100 hover:underline font-medium text-sm"
              >
                チャットを開始
              </button>
            </div>
            <button
              v-for="session in recentSessions"
              :key="session.id"
              @click="navigateTo(`/chat?session=${session.id}`)"
              class="w-full text-left p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-medium text-slate-900 dark:text-slate-100 truncate"
                  >
                    {{ session.title || "Untitled Chat" }}
                  </h3>
                  <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    メッセージ: {{ session.messages.length }}件
                  </p>
                  <p class="mt-2 text-xs text-slate-500 dark:text-slate-500">
                    {{ formatDate(session.createdAt) }}
                  </p>
                </div>
                <MessageCircle
                  :size="16"
                  class="flex-shrink-0 text-slate-400 dark:text-slate-500"
                />
              </div>
            </button>
          </div>
        </div>

        <!-- Recent Diaries -->
        <div
          class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div
            class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2"
          >
            <BookOpen :size="18" class="text-slate-600 dark:text-slate-400" />
            <h2
              class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              最近の日記
            </h2>
          </div>
          <div class="divide-y divide-slate-200 dark:divide-slate-700">
            <div
              v-if="recentDiaries.length === 0"
              class="p-6 text-center text-slate-500 dark:text-slate-400"
            >
              <p class="text-sm">日記がまだありません</p>
              <button
                @click="navigateTo('/diary')"
                class="mt-3 text-slate-900 dark:text-slate-100 hover:underline font-medium text-sm"
              >
                日記を作成
              </button>
            </div>
            <button
              v-for="diary in recentDiaries"
              :key="diary.id"
              @click="navigateTo('/diary')"
              class="w-full text-left p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-medium text-slate-900 dark:text-slate-100 truncate"
                  >
                    {{ diary.title || `${formatDateOnly(diary.date)}の日記` }}
                  </h3>
                  <p
                    class="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2"
                  >
                    {{ diary.content.substring(0, 80)
                    }}{{ diary.content.length > 80 ? "..." : "" }}
                  </p>
                  <div class="mt-2 flex items-center gap-2">
                    <span
                      :class="['text-sm font-medium', getMoodColor(diary.mood)]"
                    >
                      気分: {{ getMoodLabel(diary.mood) }}
                    </span>
                    <span class="text-xs text-slate-500 dark:text-slate-500">
                      {{ formatDateOnly(diary.date) }}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useMemoStore } from "~/stores/memo";
import { useAuthStore } from "~/stores/auth";
import {
  FileText,
  MessageSquare,
  Plus,
  MessageCircle,
  Moon,
  Sun,
  Pin,
  BookOpen,
  Smile,
  ThumbsUp,
  Minus,
  ThumbsDown,
} from "lucide-vue-next";

const router = useRouter();
const memoStore = useMemoStore();
const authStore = useAuthStore();

const userName = computed(() => {
  return authStore.user?.name || "ユーザー";
});

// 最近のメモ（最大5件）
const recentMemos = computed(() => {
  return memoStore.memos
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);
});

// 最近のチャットセッション（最大5件）
const recentSessions = computed(() => {
  return memoStore.chatSessions
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);
});

// 最近の日記（最大5件）
const recentDiaries = computed(() => {
  return memoStore.diaries
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
});

// 気分統計
const moodStats = computed(() => {
  let happy = 0;
  let neutral = 0;
  let sad = 0;

  memoStore.diaries.forEach((diary) => {
    if (diary.mood === "happy") happy++;
    else if (diary.mood === "neutral") neutral++;
    else if (diary.mood === "sad") sad++;
  });

  return { happy, neutral, sad };
});

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "昨日";
  } else {
    return date.toLocaleDateString("ja-JP");
  }
};

const formatDateOnly = (dateString: string) => {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("ja-JP");
};

const getMoodLabel = (mood: string) => {
  if (mood === "happy") return "良い";
  if (mood === "neutral") return "普通";
  if (mood === "sad") return "悪い";
  return mood;
};

const getMoodColor = (mood: string) => {
  if (mood === "happy") return "text-green-600 dark:text-green-400";
  if (mood === "neutral") return "text-yellow-600 dark:text-yellow-400";
  if (mood === "sad") return "text-red-600 dark:text-red-400";
  return "text-slate-600 dark:text-slate-400";
};

const logout = () => {
  authStore.logout();
  navigateTo("/login");
};

// ページアクセス時の初期化
onMounted(() => {
  memoStore.initializeDarkMode();
  memoStore.initializeMemos();
  memoStore.initializeChatSessions();
  memoStore.initializeDiaries();
  authStore.initializeAuth();

  if (!authStore.isAuthenticated) {
    navigateTo("/login");
  }
});
</script>
