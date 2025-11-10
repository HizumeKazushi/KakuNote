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
        <div class="mb-4">
          <h2 class="font-semibold text-slate-900 dark:text-slate-100">
            チャット
          </h2>
        </div>
        <ChatSidebar
          :sessions="memoStore.chatSessions"
          @select-session="selectSession"
          @create-session="createNewSession"
          @delete-session="deleteSession"
        />
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
              チャット
            </h2>
            <button
              @click="showMobileSidebar = false"
              class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X :size="20" />
            </button>
          </div>
          <ChatSidebar
            :sessions="memoStore.chatSessions"
            @select-session="selectSession"
            @create-session="createNewSession"
          />
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
          <h2 class="font-semibold text-slate-900 dark:text-slate-100">
            チャット
          </h2>
          <div class="w-10" />
        </div>

        <!-- Chat Area -->
        <div
          v-if="currentSession"
          class="flex-1 grid grid-rows-[1fr_auto_auto] overflow-hidden"
        >
          <!-- Messages -->
          <div ref="messagesContainer" class="overflow-y-auto p-4">
            <div class="max-w-4xl mx-auto">
              <ChatMessage
                :messages="currentSession.messages"
                @convert-to-memo="convertToMemo"
              />
              <!-- AI処理中の表示 -->
              <div v-if="isLoading" class="flex gap-3 mt-4">
                <div
                  class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                />
                <div class="flex items-center gap-1">
                  <div
                    class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
                    style="animation-delay: 0s"
                  />
                  <div
                    class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
                    style="animation-delay: 0.1s"
                  />
                  <div
                    class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
                    style="animation-delay: 0.2s"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Input Separator -->
          <div class="border-t border-slate-200 dark:border-slate-700" />

          <!-- Input (Fixed at bottom) -->
          <div>
            <ChatInput
              :is-loading="isLoading"
              @send="handleSendMessage"
              @summarize="handleSummarizeChat"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex-1 flex items-center justify-center px-4 overflow-auto"
        >
          <div class="text-center">
            <p class="text-slate-500 dark:text-slate-400 mb-8 text-lg">
              チャットセッションを選択またはハイライト作成してください
            </p>
            <button
              @click="createNewSession"
              class="rounded px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center gap-3 mx-auto text-base"
            >
              <Plus :size="20" />
              新規チャット
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Summarizing Modal -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 animate-in fade-in duration-300"
      >
        <div class="flex gap-2">
          <div
            class="w-2 h-2 bg-slate-900 dark:bg-slate-100 rounded-full animate-bounce"
            style="animation-delay: 0s"
          />
          <div
            class="w-2 h-2 bg-slate-900 dark:bg-slate-100 rounded-full animate-bounce"
            style="animation-delay: 0.1s"
          />
          <div
            class="w-2 h-2 bg-slate-900 dark:bg-slate-100 rounded-full animate-bounce"
            style="animation-delay: 0.2s"
          />
        </div>
        <p class="text-slate-900 dark:text-slate-100 font-medium">
          チャットを要約中...
        </p>
        <p class="text-slate-500 dark:text-slate-400 text-sm">
          少々お待ちください
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { Plus, X, Menu } from "lucide-vue-next";
import { useMemoStore } from "~/stores/memo";
import { useAuthStore } from "~/stores/auth";
import { useRoute } from "vue-router";
import ChatSidebar from "~/components/ChatSidebar.vue";
import ChatMessage from "~/components/ChatMessage.vue";
import ChatInput from "~/components/ChatInput.vue";
import { useGeminiAI } from "~/composables/useGeminiAI";

const route = useRoute();
const memoStore = useMemoStore();
const authStore = useAuthStore();
const {
  generateIdeas,
  generateWelcomeMessage,
  summarizeText,
  generateChatTitle,
  generateMemoTitle,
} = useGeminiAI();

const showMobileSidebar = ref(false);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const currentSession = computed(() => memoStore.getCurrentChatSession());
const isMemoRoute = computed(() => route.path === "/memo");
const isChatDirect = computed(() => route.path === "/chat");

// APIキーが設定されていないかチェック
onMounted(() => {
  if (!authStore.hasGeminiApiKey()) {
    navigateTo("/api-setup");
  }
});

// メッセージが更新されたときに自動スクロール
watch(
  () => currentSession.value?.messages,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true }
);

// セッションが切り替わったときもスクロール
watch(
  () => currentSession.value?.id,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  }
);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(() => {
  memoStore.initializeChatSessions();
  memoStore.initializeDarkMode();
  authStore.initializeAuth();

  // ゲストアカウントはチャット機能を使用できない
  if (authStore.isGuest) {
    navigateTo("/dashboard");
    return;
  }

  // APIキーが設定されていない場合は設定ページへ
  if (!authStore.hasGeminiApiKey()) {
    navigateTo("/settings");
  }
});

const createNewSession = async () => {
  const session = memoStore.createChatSession("New Chat");
  memoStore.setCurrentChatSession(session.id);
  showMobileSidebar.value = false;

  // ローディングメッセージを表示
  memoStore.addChatMessage(session.id, "assistant", "...");

  // ウェルカムメッセージを送信（2-3秒の遅延でUX向上）
  await new Promise((resolve) => setTimeout(resolve, 2500));

  try {
    const welcomeMessage = await generateWelcomeMessage();
    // 最後のメッセージ（ローディング）を置き換え
    if (
      currentSession.value?.messages &&
      currentSession.value.messages.length > 0
    ) {
      const lastMessage =
        currentSession.value.messages[currentSession.value.messages.length - 1];
      if (lastMessage && lastMessage.content === "...") {
        const msgs = currentSession.value.messages;
        if (msgs && msgs.length > 0) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg) {
            lastMsg.content = welcomeMessage;
            memoStore.saveChatSessions();
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to generate welcome message:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "こんにちは！本日も一緒にアイデアを考えるのが楽しみです。どんなテーマについて考えを整理したいですか？";
    // 最後のメッセージ（ローディング）を置き換え
    if (
      currentSession.value?.messages &&
      currentSession.value.messages.length > 0
    ) {
      const lastMessage =
        currentSession.value.messages[currentSession.value.messages.length - 1];
      if (lastMessage && lastMessage.content === "...") {
        const msgs = currentSession.value.messages;
        if (msgs && msgs.length > 0) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg) {
            lastMsg.content = errorMessage;
            memoStore.saveChatSessions();
          }
        }
      }
    }
  }
};

const selectSession = (id: string) => {
  memoStore.setCurrentChatSession(id);
  showMobileSidebar.value = false;
};

const deleteSession = (id: string) => {
  memoStore.deleteChatSession(id);
  showMobileSidebar.value = false;
  // 削除後、他のセッションがあれば最初のセッションを選択
  if (memoStore.chatSessions.length > 0) {
    const firstSession = memoStore.chatSessions[0];
    if (firstSession) {
      memoStore.setCurrentChatSession(firstSession.id);
    }
  }
};

const handleSendMessage = async (message: string) => {
  if (!currentSession.value) return;

  // ユーザーメッセージを追加
  memoStore.addChatMessage(currentSession.value.id, "user", message);

  // ローディングメッセージを表示
  memoStore.addChatMessage(currentSession.value.id, "assistant", "...");

  // AI応答を生成
  try {
    // 会話履歴を取得（ローディングメッセージを除外）
    const conversationHistory = currentSession.value.messages
      .filter((msg) => msg.content !== "...")
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const response = await generateIdeas(message, conversationHistory);

    // 最後のメッセージ（ローディング）を置き換え
    if (
      currentSession.value?.messages &&
      currentSession.value.messages.length > 0
    ) {
      const lastMessage =
        currentSession.value.messages[currentSession.value.messages.length - 1];
      if (lastMessage && lastMessage.content === "...") {
        lastMessage.content = response;
        memoStore.saveChatSessions();
      }
    }

    // セッションタイトルを会話履歴から自動生成（毎回更新）
    try {
      // 会話履歴を取得
      const chatHistory = currentSession.value.messages
        .filter((msg) => msg.content !== "...")
        .map(
          (msg) => `${msg.role === "user" ? "ユーザー" : "AI"}: ${msg.content}`
        )
        .join("\n");

      const newTitle = await generateChatTitle(chatHistory);
      memoStore.updateChatSession(currentSession.value.id, {
        title: newTitle || message.substring(0, 30),
      });
    } catch (error) {
      // フォールバック：メッセージの最初の30文字
      memoStore.updateChatSession(currentSession.value.id, {
        title: message.substring(0, 30),
      });
    }
  } catch (error) {
    console.error("Failed to generate response:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "申し訳ありません。エラーが発生しました。";

    // 最後のメッセージ（ローディング）を置き換え
    if (
      currentSession.value?.messages &&
      currentSession.value.messages.length > 0
    ) {
      const lastMessage =
        currentSession.value.messages[currentSession.value.messages.length - 1];
      if (lastMessage && lastMessage.content === "...") {
        lastMessage.content = errorMessage;
        memoStore.saveChatSessions();
      }
    }
  }
};

const convertToMemo = async (content: string) => {
  try {
    // コンテンツからタイトルを生成
    const memoTitle = await generateMemoTitle(content);
    const memo = memoStore.createMemo(
      memoTitle || currentSession.value?.title || "From Chat"
    );
    memoStore.updateMemo(memo.id, { content });
    memoStore.setCurrentMemo(memo.id);
    navigateTo("/memo");
  } catch (error) {
    console.error("Failed to generate memo title:", error);
    // フォールバック
    const memo = memoStore.createMemo(
      currentSession.value?.title || "From Chat"
    );
    memoStore.updateMemo(memo.id, { content });
    memoStore.setCurrentMemo(memo.id);
    navigateTo("/memo");
  }
};

const handleSummarizeChat = async () => {
  if (!currentSession.value || currentSession.value.messages.length === 0)
    return;

  isLoading.value = true;
  try {
    // チャットメッセージをテキストにまとめる
    const chatContent = currentSession.value.messages
      .map(
        (msg) => `${msg.role === "user" ? "ユーザー" : "AI"}: ${msg.content}`
      )
      .join("\n\n");

    // AIに要約させる
    const summary = await summarizeText(chatContent);

    // 要約からメモのタイトルを生成
    let memoTitle = "チャット要約";
    try {
      memoTitle = (await generateMemoTitle(summary)) || "チャット要約";
    } catch (error) {
      console.error("Failed to generate memo title:", error);
    }

    // 新しいメモを作成
    const memo = memoStore.createMemo(memoTitle);
    memoStore.updateMemo(memo.id, { content: summary });
    memoStore.setCurrentMemo(memo.id);

    // メモページへ移動
    navigateTo("/memo");
  } catch (error) {
    console.error("Failed to summarize chat:", error);
    alert("要約に失敗しました。もう一度お試しください。");
  } finally {
    isLoading.value = false;
  }
};
</script>
