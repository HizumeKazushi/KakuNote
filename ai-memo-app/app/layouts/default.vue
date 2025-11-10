<template>
  <div class="flex h-screen flex-col bg-white dark:bg-slate-900">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useMemoStore } from "~/stores/memo";

const memoStore = useMemoStore();

onMounted(() => {
  memoStore.initializeDarkMode();
});
</script>
