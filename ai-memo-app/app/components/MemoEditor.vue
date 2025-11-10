<template>
  <div class="flex h-full flex-col bg-white dark:bg-slate-900">
    <!-- Title Bar -->
    <div
      class="border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4 flex items-center justify-between"
    >
      <div class="flex-1">
        <input
          v-model="memo.title"
          type="text"
          placeholder="Untitled"
          class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 focus:outline-none w-full bg-transparent"
          @input="updateTitle"
        />
        <p class="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Updated {{ formatDate(memo.updatedAt) }}
        </p>
      </div>
      <button
        @click="memoStore.toggleDarkMode"
        class="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ml-4"
      >
        <Moon v-if="!memoStore.isDarkMode" :size="20" />
        <Sun v-else :size="20" />
      </button>
    </div>

    <!-- Split View: Editor + Preview -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Editor Panel -->
      <div
        class="flex-1 md:flex-1 flex flex-col md:border-r md:border-slate-200"
        :class="{ 'hidden md:flex': activeTab === 'preview' }"
      >
        <textarea
          v-model="memo.content"
          placeholder="メモを書く..."
          class="flex-1 resize-none px-4 md:px-8 py-6 font-mono text-sm text-slate-800 dark:text-slate-200 focus:outline-none bg-transparent"
          @input="updateContent"
        />
      </div>

      <!-- Preview Panel -->
      <div
        class="flex-1 md:flex-1 overflow-auto bg-white dark:bg-slate-900"
        :class="{ 'hidden md:flex': activeTab === 'editor' }"
      >
        <div
          class="prose prose-sm max-w-none px-4 md:px-8 py-6"
          v-html="renderedMarkdown"
        />
      </div>
    </div>

    <!-- Mobile Tab Switcher -->
    <div
      class="md:hidden border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 flex"
    >
      <button
        @click="activeTab = 'editor'"
        :class="[
          'flex-1 py-2 text-sm font-medium',
          activeTab === 'editor'
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-slate-600 dark:text-slate-400',
        ]"
      >
        編集
      </button>
      <button
        @click="activeTab = 'preview'"
        :class="[
          'flex-1 py-2 text-sm font-medium',
          activeTab === 'preview'
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-slate-600 dark:text-slate-400',
        ]"
      >
        プレビュー
      </button>
    </div>

    <!-- Bottom Bar: AI Tools -->
    <div
      class="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 md:px-8 py-4"
    >
      <div class="flex items-center gap-2">
        <button
          @click="generateIdeas"
          :disabled="
            !memo.content || isLoading || !hasApiKey || authStore.isGuest
          "
          class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="アイデア生成"
        >
          <Lightbulb :size="20" class="text-slate-700 dark:text-slate-300" />
        </button>
        <button
          @click="summarize"
          :disabled="
            !memo.content || isLoading || !hasApiKey || authStore.isGuest
          "
          class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="要約"
        >
          <FileText :size="20" class="text-slate-700 dark:text-slate-300" />
        </button>
        <button
          @click="extractTags"
          :disabled="
            !memo.content || isLoading || !hasApiKey || authStore.isGuest
          "
          class="p2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="タグ抽出"
        >
          <Tag :size="20" class="text-slate-700 dark:text-slate-300" />
        </button>
        <button
          @click="extractTasks"
          :disabled="
            !memo.content || isLoading || !hasApiKey || authStore.isGuest
          "
          class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="タスク抽出"
        >
          <CheckCircle :size="20" class="text-slate-700 dark:text-slate-300" />
        </button>

        <!-- Export Menu -->
        <div class="ml-2 relative">
          <button
            @click="
              () => {
                showExportMenu = !showExportMenu;
                updateExportMenuPosition();
              }
            "
            class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="エクスポート"
          >
            <Download :size="20" class="text-slate-700 dark:text-slate-300" />
          </button>
          <Teleport to="body">
            <div
              v-if="showExportMenu"
              class="fixed inset-0 z-40"
              @click="showExportMenu = false"
            />
            <div
              v-if="showExportMenu"
              class="fixed z-50 w-40 bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600"
              :style="{
                top: exportMenuPosition.top,
                left: exportMenuPosition.left,
              }"
            >
              <button
                @click="exportAs('md')"
                class="w-full text-left px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-t-lg transition-colors"
              >
                Markdownで出力
              </button>
              <button
                @click="exportAs('txt')"
                class="w-full text-left px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                テキストで出力
              </button>
              <button
                @click="exportAs('pdf')"
                class="w-full text-left px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                PDFで出力
              </button>
              <button
                @click="exportAs('docx')"
                class="w-full text-left px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-b-lg transition-colors"
              >
                Wordで出力
              </button>
            </div>
          </Teleport>
        </div>

        <div class="ml-auto flex items-center gap-3">
          <div
            v-if="isLoading"
            class="flex items-center gap-2 text-sm text-slate-500"
          >
            <Loader :size="16" class="animate-spin" />
            <span>AI処理中...</span>
          </div>
          <div v-if="error" class="text-sm text-red-600">
            {{ error }}
          </div>
          <div v-if="memoStore.isFreePlan" class="text-xs text-slate-500">
            {{ memoStore.memos.length }} / 10
          </div>
        </div>
      </div>
    </div>

    <!-- AI Response Modal -->
    <Teleport to="body">
      <div
        v-if="aiResponse"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      >
        <div
          class="max-h-96 w-full max-w-2xl mx-4 md:mx-auto overflow-auto rounded-lg bg-white dark:bg-slate-800 p-4 md:p-6 shadow-lg"
        >
          <h3 class="mb-3 font-semibold text-slate-900 dark:text-slate-100">
            AI応答
          </h3>
          <div
            class="prose prose-sm max-w-none mb-4 overflow-auto max-h-60 prose-slate dark:prose-invert"
          >
            <div v-html="renderedAIResponse" />
          </div>
          <div class="flex gap-2">
            <button
              @click="insertAIResponse"
              class="flex-1 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              メモに挿入
            </button>
            <button
              @click="
                aiResponse = null;
                error = null;
              "
              class="rounded bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>

      <!-- AI Processing Modal -->
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
            AI処理中...
          </p>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            少々お待ちください
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import MarkdownIt from "markdown-it";
import {
  Lightbulb,
  FileText,
  Tag,
  CheckCircle,
  Loader,
  Moon,
  Sun,
  Download,
} from "lucide-vue-next";
import { useMemoStore, type Memo } from "~/stores/memo";
import { useAuthStore } from "~/stores/auth";
import { useGeminiAI } from "~/composables/useGeminiAI";

const props = defineProps<{
  memoId: string;
}>();

const memoStore = useMemoStore();
const authStore = useAuthStore();
const aiResponse = ref<string | null>(null);
const aiRawResponse = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const activeTab = ref<"editor" | "preview">("editor");
const showExportMenu = ref(false);
const exportMenuPosition = ref({ top: "0px", left: "0px" });

// APIキーが設定されているかチェック
const hasApiKey = computed(() => authStore.hasGeminiApiKey());

const updateExportMenuPosition = () => {
  if (showExportMenu.value) {
    // ボタンの位置を計算する処理
    const buttons = document.querySelectorAll('button[title="エクスポート"]');
    if (buttons.length > 0) {
      const button = buttons[buttons.length - 1] as HTMLElement;
      const rect = button.getBoundingClientRect();
      // ボタンの上に表示（ボタンの上端 - メニューの高さ - margin）
      const menuHeight = 180; // 約4つのボタン分
      exportMenuPosition.value = {
        top: `${rect.top - menuHeight - 10 + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
      };
    }
  }
};

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

// シンタックスハイライトを有効化
md.options.highlight = (str, lang) => {
  const hljs = (window as any).hljs;
  if (lang && hljs && hljs.getLanguage(lang)) {
    try {
      return (
        '<code class="hljs language-' +
        lang +
        '">' +
        hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
        "</code>"
      );
    } catch (__) {}
  }
  return '<code class="hljs">' + md.utils.escapeHtml(str) + "</code>";
};

const memo = ref<Memo>({
  id: props.memoId,
  title: "",
  content: "",
  category: "general",
  tags: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isPinned: false,
});

// Markdownをリアルタイムでレンダリング
const renderedMarkdown = computed(() => {
  return md.render(memo.value.content);
});

const renderedAIResponse = computed(() => {
  return md.render(aiRawResponse.value || "");
});

// 現在のメモをロード
watch(
  () => props.memoId,
  (newId) => {
    const currentMemo = memoStore.memos.find((m) => m.id === newId);
    if (currentMemo) {
      memo.value = { ...currentMemo };
    }
  },
  { immediate: true }
);

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

const updateTitle = () => {
  memoStore.updateMemo(memo.value.id, { title: memo.value.title });
};

const updateContent = () => {
  memoStore.updateMemo(memo.value.id, { content: memo.value.content });
};

const insertAIResponse = () => {
  if (aiRawResponse.value) {
    memo.value.content += "\n\n" + aiRawResponse.value;
    updateContent();
    aiResponse.value = null;
    aiRawResponse.value = null;
  }
};

// AI機能
const callAI = async (fn: () => Promise<string>) => {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await fn();
    aiRawResponse.value = result;
    aiResponse.value = "AI応答を取得しました";
  } catch (err) {
    error.value = err instanceof Error ? err.message : "エラーが発生しました";
  } finally {
    isLoading.value = false;
  }
};

const generateIdeas = async () => {
  const ai = useGeminiAI();
  await callAI(() => ai.generateIdeas(memo.value.content));
};

const summarize = async () => {
  const ai = useGeminiAI();
  await callAI(() => ai.summarizeText(memo.value.content));
};

const extractTags = async () => {
  const ai = useGeminiAI();
  try {
    isLoading.value = true;
    error.value = null;
    const tags = await ai.extractTags(memo.value.content);
    memo.value.tags = tags;
    updateContent();
    aiRawResponse.value = `**抽出されたタグ:**\n\n${tags
      .map((t) => `- ${t}`)
      .join("\n")}`;
    aiResponse.value = "タグを抽出しました";
  } catch (err) {
    error.value = err instanceof Error ? err.message : "エラーが発生しました";
  } finally {
    isLoading.value = false;
  }
};

const extractTasks = async () => {
  const ai = useGeminiAI();
  try {
    isLoading.value = true;
    error.value = null;
    const tasks = await ai.extractTasks(memo.value.content);
    aiRawResponse.value = `**タスク一覧:**\n\n${tasks
      .map((t) => `- [ ] ${t}`)
      .join("\n")}`;
    aiResponse.value = "タスクを抽出しました";
  } catch (err) {
    error.value = err instanceof Error ? err.message : "エラーが発生しました";
  } finally {
    isLoading.value = false;
  }
};

// エクスポート機能
const exportAs = (format: "md" | "txt" | "pdf" | "docx") => {
  showExportMenu.value = false;

  const filename = `${memo.value.title || "memo"}.${
    format === "md"
      ? "md"
      : format === "txt"
      ? "txt"
      : format === "pdf"
      ? "pdf"
      : "docx"
  }`;

  if (format === "md") {
    exportMarkdown(filename);
  } else if (format === "txt") {
    exportText(filename);
  } else if (format === "pdf") {
    exportPDF(filename);
  } else if (format === "docx") {
    exportDocx(filename);
  }
};

const exportMarkdown = (filename: string) => {
  const content = `# ${memo.value.title}\n\n${memo.value.content}`;
  downloadFile(content, filename, "text/markdown");
};

const exportText = (filename: string) => {
  const content = `${memo.value.title}\n${"=".repeat(
    memo.value.title.length
  )}\n\n${memo.value.content.replace(/#+\s/g, "").replace(/[*_`]/g, "")}`;
  downloadFile(content, filename, "text/plain");
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportPDF = (filename: string) => {
  try {
    // html2pdfが利用可能な場合
    const element = document.createElement("div");
    element.innerHTML = `<h1>${memo.value.title}</h1>${renderedMarkdown.value}`;

    // PDFエクスポートの簡易実装（html2pdfライブラリが必要）
    // ここでは、ブラウザのプリント機能を使用した代替手段を提案
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${memo.value.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              h2 { color: #666; margin-top: 20px; }
              pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <h1>${memo.value.title}</h1>
            ${renderedMarkdown.value}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  } catch (err) {
    error.value =
      "PDF出力に失敗しました。ブラウザのプリント機能をご使用ください。";
  }
};

const exportDocx = (filename: string) => {
  try {
    // docxエクスポートの簡易実装
    // 実際にはdocx-jsライブラリなどが必要です
    // ここでは、RTF形式またはプレーンテキストで代用
    const rtfContent = `{\\rtf1\\ansi\\ansicpg1252\\cocoartf1\n{\\fonttbl\\f0\\fswiss Helvetica;}\n{\\colortbl;\\red255\\green0\\blue0;}\n${memo.value.title}\n\n${memo.value.content}`;
    downloadFile(rtfContent, filename, "application/rtf");
  } catch (err) {
    error.value = "Word出力に失敗しました。Markdown形式でお試しください。";
  }
};
</script>
