<template>
  <div
    class="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-40"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          to="/dashboard"
          class="py-4 px-4 font-medium text-sm border-b-2 transition-colors"
          :class="[
            currentRoute === 'dashboard'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
          ]"
        >
          ダッシュボード
        </NuxtLink>
        <NuxtLink
          to="/memo"
          class="py-4 px-4 font-medium text-sm border-b-2 transition-colors"
          :class="[
            currentRoute === 'memo'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
          ]"
        >
          メモ
        </NuxtLink>
        <NuxtLink
          to="/chat"
          class="py-4 px-4 font-medium text-sm border-b-2 transition-colors"
          :class="[
            currentRoute === 'chat'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
          ]"
        >
          AIとチャット
        </NuxtLink>
        <NuxtLink
          to="/diary"
          class="py-4 px-4 font-medium text-sm border-b-2 transition-colors"
          :class="[
            currentRoute === 'diary'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
          ]"
        >
          日記
        </NuxtLink>
        <NuxtLink
          to="/settings"
          class="py-4 px-4 font-medium text-sm border-b-2 transition-colors"
          :class="[
            currentRoute === 'settings'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
          ]"
        >
          設定
        </NuxtLink>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden flex items-center justify-between">
        <div
          class="py-3 font-medium text-sm text-slate-900 dark:text-slate-100"
        >
          メニュー
        </div>
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu
            v-if="!showMobileMenu"
            :size="24"
            class="text-slate-600 dark:text-slate-400"
          />
          <X v-else :size="24" class="text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div
        v-if="showMobileMenu"
        class="md:hidden border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-1 animate-in slide-in-from-top duration-200 origin-top"
      >
        <NuxtLink
          to="/dashboard"
          class="block py-3 px-4 font-medium text-sm transition-colors"
          :class="[
            currentRoute === 'dashboard'
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100',
          ]"
          @click="closeMobileMenu"
        >
          ダッシュボード
        </NuxtLink>
        <NuxtLink
          to="/memo"
          class="block py-3 px-4 font-medium text-sm transition-colors"
          :class="[
            currentRoute === 'memo'
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100',
          ]"
          @click="closeMobileMenu"
        >
          メモ
        </NuxtLink>
        <NuxtLink
          to="/chat"
          class="block py-3 px-4 font-medium text-sm transition-colors"
          :class="[
            currentRoute === 'chat'
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100',
          ]"
          @click="closeMobileMenu"
        >
          AIとチャット
        </NuxtLink>
        <NuxtLink
          to="/diary"
          class="block py-3 px-4 font-medium text-sm transition-colors"
          :class="[
            currentRoute === 'diary'
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100',
          ]"
          @click="closeMobileMenu"
        >
          日記
        </NuxtLink>
        <NuxtLink
          to="/settings"
          class="block py-3 px-4 font-medium text-sm transition-colors"
          :class="[
            currentRoute === 'settings'
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100',
          ]"
          @click="closeMobileMenu"
        >
          設定
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { Menu, X } from "lucide-vue-next";

const route = useRoute();
const showMobileMenu = ref(false);

const currentRoute = computed(() => {
  const name = route.name as string;
  if (name?.includes("dashboard")) return "dashboard";
  if (name?.includes("memo")) return "memo";
  if (name?.includes("chat")) return "chat";
  if (name?.includes("diary")) return "diary";
  if (name?.includes("settings")) return "settings";
  return "";
});

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};
</script>
