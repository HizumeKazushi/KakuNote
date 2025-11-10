<template>
  <div class="bg-white dark:bg-slate-900 p-4">
    <div class="max-w-4xl mx-auto flex gap-3">
      <button
        @click="$emit('summarize')"
        :disabled="isLoading"
        class="rounded bg-slate-600 text-white px-3 py-2 font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 text-sm"
        title="チャット全体を要約してメモ化"
      >
        📋
      </button>
      <textarea
        ref="textarea"
        v-model="message"
        @keydown="handleKeydown"
        placeholder="メッセージを入力..."
        rows="1"
        class="flex-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 resize-none overflow-hidden"
        @input="autoResize"
      />
      <button
        @click="sendMessage"
        :disabled="!message.trim() || isLoading"
        class="rounded bg-slate-900 text-white px-4 py-2 font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 self-end flex-shrink-0"
      >
        <Send :size="18" />
        <span class="hidden sm:inline">送信</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Send } from "lucide-vue-next";

const props = defineProps<{
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  send: [message: string];
  summarize: [];
}>();

const message = ref("");
const textarea = ref<HTMLTextAreaElement>();

const sendMessage = async () => {
  if (!message.value.trim()) return;

  emit("send", message.value);
  message.value = "";

  // テキストエリアのサイズをリセット
  if (textarea.value) {
    textarea.value.style.height = "auto";
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  // Enterキーが押された場合
  if (event.key === "Enter") {
    // Shift+Enterの場合は改行を許可（デフォルト動作）
    if (event.shiftKey) {
      return;
    }

    // EnterキーのみではImeCompositionイベント対応を追加
    // IMEの変換確定中かどうかを確認
    if ((event as any).isComposing) {
      event.preventDefault();
      return;
    }

    // Enterのみで送信
    event.preventDefault();
    sendMessage();
  }
};

const autoResize = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  target.style.height = "auto";
  target.style.height = Math.min(target.scrollHeight, 120) + "px";
};
</script>
