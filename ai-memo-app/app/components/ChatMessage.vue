<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="message in messages"
      :key="message.id"
      :class="[
        'flex gap-3 max-w-2xl group',
        message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
      ]"
    >
      <div
        :class="[
          'rounded-lg px-4 py-2 flex-1',
          message.role === 'user'
            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
            : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
        ]"
      >
        <!-- ローディング表示（...） -->
        <div
          v-if="message.content === '...' && message.role === 'assistant'"
          class="flex items-center gap-0.5 h-6"
        >
          <span
            class="text-sm font-semibold"
            :style="{ animation: 'discord-pulse 1.4s ease-in-out infinite 0s' }"
            >•</span
          >
          <span
            class="text-sm font-semibold"
            :style="{
              animation: 'discord-pulse 1.4s ease-in-out infinite 0.2s',
            }"
            >•</span
          >
          <span
            class="text-sm font-semibold"
            :style="{
              animation: 'discord-pulse 1.4s ease-in-out infinite 0.4s',
            }"
            >•</span
          >
        </div>
        <!-- マークダウンをHTMLとして表示 -->
        <div
          v-else-if="message.role === 'assistant'"
          class="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-li:text-inherit"
          v-html="renderMarkdown(message.content)"
        />
        <p v-else class="text-sm leading-relaxed">{{ message.content }}</p>

        <div class="flex items-center gap-2 mt-2">
          <p class="text-xs opacity-70">
            {{ formatTime(message.timestamp) }}
          </p>
          <button
            v-if="message.role === 'assistant' && message.content !== '...'"
            @click="$emit('convert-to-memo', message.content)"
            class="text-xs opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            メモ化
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from "~/stores/memo";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
});

defineProps<{
  messages: ChatMessage[];
}>();

defineEmits<{
  "convert-to-memo": [content: string];
}>();

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const renderMarkdown = (content: string): string => {
  return md.render(content);
};
</script>
