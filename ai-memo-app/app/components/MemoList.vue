<template>
  <div class="space-y-3">
    <!-- Search & Filter -->
    <div class="space-y-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="検索..."
        class="w-full rounded px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
      />
      <select
        v-model="selectedCategory"
        class="w-full rounded px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
      >
        <option value="all">すべて</option>
        <option value="general">一般</option>
        <option value="work">仕事</option>
        <option value="personal">個人</option>
        <option value="idea">アイデア</option>
      </select>
    </div>

    <!-- Memos List -->
    <div class="space-y-1">
      <div
        v-if="memoStore.filteredMemos.length === 0"
        class="py-8 text-center text-sm text-slate-400"
      >
        メモがありません
      </div>
      <MemoItem
        v-for="memo in memoStore.filteredMemos"
        :key="memo.id"
        :memo="memo"
        :is-selected="memo.id === memoStore.currentMemoId"
        @click="selectMemo(memo.id)"
        @delete="deleteMemo(memo.id)"
        @toggle-pin="togglePin(memo.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMemoStore } from "~/stores/memo";

const memoStore = useMemoStore();

const searchQuery = computed({
  get: () => memoStore.searchQuery,
  set: (value) => memoStore.setSearchQuery(value),
});

const selectedCategory = computed({
  get: () => memoStore.selectedCategory,
  set: (value) => memoStore.setSelectedCategory(value),
});

const selectMemo = (id: string) => {
  memoStore.setCurrentMemo(id);
};

const deleteMemo = (id: string) => {
  if (confirm("このメモを削除してもよろしいですか?")) {
    memoStore.deleteMemo(id);
  }
};

const togglePin = (id: string) => {
  memoStore.togglePin(id);
};
</script>
