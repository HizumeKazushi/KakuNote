<template>
  <div class="flex flex-col h-full">
    <div class="mb-4">
      <button
        @click="createNewSession"
        class="w-full rounded px-3 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
      >
        <Plus :size="18" />
        新規チャット
      </button>
    </div>

    <div class="flex-1 overflow-y-auto space-y-2">
      <div v-for="session in sessions" :key="session.id" class="group relative">
        <button
          @click="selectSession(session.id)"
          class="w-full text-left px-3 py-2 rounded text-sm transition-colors"
          :class="[
            isSelected(session.id)
              ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
          ]"
        >
          <div class="font-medium truncate">{{ session.title }}</div>
          <div class="text-xs opacity-70 truncate">
            {{ session.messages.length }} メッセージ
          </div>
        </button>
        <!-- 削除ボタン（ホバー時表示） -->
        <button
          @click.stop="deleteSession(session.id)"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
          title="このチャットを削除"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { useMemoStore } from "~/stores/memo";
import type { ChatSession } from "~/stores/memo";

const memoStore = useMemoStore();

const props = defineProps<{
  sessions: ChatSession[];
}>();

const emit = defineEmits<{
  "select-session": [id: string];
  "create-session": [];
  "delete-session": [id: string];
}>();

const isSelected = (id: string): boolean => {
  return memoStore.currentChatSessionId === id;
};

const selectSession = (id: string) => {
  emit("select-session", id);
};

const deleteSession = (id: string) => {
  if (confirm("このチャットを削除しますか？")) {
    emit("delete-session", id);
  }
};

const createNewSession = () => {
  emit("create-session");
};
</script>
