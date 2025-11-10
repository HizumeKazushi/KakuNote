<template>
  <div
    :class="[
      'group relative px-3 py-2 rounded cursor-pointer transition-colors text-sm',
      isSelected
        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
        : 'hover:bg-slate-100 text-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
    ]"
    @click="$emit('click')"
  >
    <div class="flex items-center gap-2">
      <!-- Pin Icon -->
      <button
        @click.stop="$emit('toggle-pin')"
        class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-amber-500 dark:text-slate-500 dark:hover:text-amber-400 flex-shrink-0 p-1"
      >
        <Pin v-if="memo.isPinned" :size="16" />
        <Pin v-else :size="16" class="opacity-50" />
      </button>

      <!-- Title & Preview -->
      <div class="flex-1 min-w-0">
        <p class="font-medium truncate">
          {{ memo.title || "Untitled" }}
        </p>
        <p class="text-xs opacity-60 line-clamp-1">
          {{ memo.content.substring(0, 60).replace(/\n/g, " ") }}
        </p>
      </div>

      <!-- Delete Button -->
      <button
        @click.stop="$emit('delete')"
        class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 flex-shrink-0 p-1"
      >
        <Trash2 :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pin, Trash2 } from "lucide-vue-next";
import type { Memo } from "~/stores/memo";

defineProps<{
  memo: Memo;
  isSelected: boolean;
}>();

defineEmits<{
  click: [];
  delete: [];
  "toggle-pin": [];
}>();
</script>
