<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">
    <!-- Navigation -->
    <nav
      class="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
    >
      <div
        class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
      >
        <h1 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Kaku Note
        </h1>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/login"
            class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium"
          >
            ログイン
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
      <div class="mx-auto max-w-4xl">
        <h2
          class="text-5xl sm:text-7xl font-bold text-slate-900 dark:text-slate-50 leading-tight mb-8"
        >
          あなたの思考を<br />クリアに整理する
        </h2>
        <p
          class="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-10"
        >
          シンプルで強力なメモアプリ。<br />
          Gemini AIの力を借りて、アイデアをより深く掘り下げ、<br />
          メモを有意義な情報に変換します。
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink
            to="/login"
            class="inline-block px-8 py-4 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium text-center"
          >
            ログイン / 新規登録
          </NuxtLink>
          <button
            @click="handleGuestLogin"
            class="inline-block px-8 py-4 border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-medium text-center"
          >
            ゲストでお試し
          </button>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div
      class="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-20 sm:py-32"
    >
      <div class="mx-auto max-w-6xl">
        <h2
          class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-20 text-center"
        >
          三つの柱で生産性を向上
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Feature 1 -->
          <div class="space-y-4">
            <FileText
              :size="40"
              class="text-slate-900 dark:text-slate-100 mb-4"
            />
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-50">
              シンプルで快適
            </h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              Markdownで直感的に書く。リアルタイムプレビュー。ダークモード完全対応。
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="space-y-4">
            <MessageSquare
              :size="40"
              class="text-slate-900 dark:text-slate-100 mb-4"
            />
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-50">
              AIと対話する
            </h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              アイデアをブレストストーミング。Gemini AIが洞察を提供します。
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="space-y-4">
            <Download
              :size="40"
              class="text-slate-900 dark:text-slate-100 mb-4"
            />
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-50">
              複数形式で出力
            </h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              Markdown、PDF、Word。どのツールでも使えます。
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- How it works Section -->
    <div
      class="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-20 sm:py-32"
    >
      <div class="mx-auto max-w-4xl">
        <h2
          class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-20 text-center"
        >
          すぐに始められる
        </h2>

        <div class="space-y-12">
          <!-- Step 1 -->
          <div class="flex gap-8">
            <div
              class="flex-shrink-0 w-12 h-12 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-full flex items-center justify-center font-bold text-lg"
            >
              1
            </div>
            <div>
              <h3
                class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2"
              >
                ログイン
              </h3>
              <p class="text-slate-600 dark:text-slate-400">
                メールアドレスで登録。ゲストで試すこともできます。
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex gap-8">
            <div
              class="flex-shrink-0 w-12 h-12 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-full flex items-center justify-center font-bold text-lg"
            >
              2
            </div>
            <div>
              <h3
                class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2"
              >
                API キーを設定
              </h3>
              <p class="text-slate-600 dark:text-slate-400">
                Google Gemini APIキーを登録。設定ページから簡単にできます。
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex gap-8">
            <div
              class="flex-shrink-0 w-12 h-12 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-full flex items-center justify-center font-bold text-lg"
            >
              3
            </div>
            <div>
              <h3
                class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2"
              >
                メモを作成
              </h3>
              <p class="text-slate-600 dark:text-slate-400">
                思考をメモに記入。Markdownでフォーマットも自在。
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex gap-8">
            <div
              class="flex-shrink-0 w-12 h-12 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-full flex items-center justify-center font-bold text-lg"
            >
              4
            </div>
            <div>
              <h3
                class="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2"
              >
                AIで深掘り
              </h3>
              <p class="text-slate-600 dark:text-slate-400">
                チャットでアイデアをブレストストーミング。優れたアイデアはメモに変換。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Section -->
    <div
      class="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-20 sm:py-32"
    >
      <div class="mx-auto max-w-4xl">
        <h2
          class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-20 text-center"
        >
          プランと価格
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Free Plan -->
          <div
            class="border border-slate-200 dark:border-slate-700 rounded-lg p-10 hover:shadow-lg transition-shadow"
          >
            <h3
              class="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-3"
            >
              フリー
            </h3>
            <p
              class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2"
            >
              無料
            </p>
            <p class="text-slate-600 dark:text-slate-400 mb-8">
              最大10個のメモを保存
            </p>
            <ul class="space-y-4 mb-10">
              <li class="flex items-start gap-3">
                <span class="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span class="text-slate-600 dark:text-slate-400"
                  >メモ作成・編集・削除</span
                >
              </li>
              <li class="flex items-start gap-3">
                <span class="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span class="text-slate-600 dark:text-slate-400"
                  >AIとのチャット</span
                >
              </li>
              <li class="flex items-start gap-3">
                <span class="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span class="text-slate-600 dark:text-slate-400"
                  >複数形式エクスポート</span
                >
              </li>
              <li class="flex items-start gap-3">
                <span class="text-slate-400 mt-1">✕</span>
                <span class="text-slate-400">メモ保存数制限あり</span>
              </li>
            </ul>
            <NuxtLink
              to="/login"
              class="w-full px-6 py-3 border border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-medium text-center block"
            >
              今すぐ始める
            </NuxtLink>
          </div>

          <!-- Premium Plan -->
          <div
            class="border-2 border-slate-900 dark:border-slate-100 rounded-lg p-10 bg-slate-50 dark:bg-slate-900/50 shadow-lg hover:shadow-xl transition-shadow relative"
          >
            <div
              class="absolute -top-3 left-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-3 py-1 text-sm font-semibold rounded"
            >
              近日公開
            </div>
            <h3
              class="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-3"
            >
              プレミアム
            </h3>
            <p
              class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2"
            >
              予定中
            </p>
            <p class="text-slate-600 dark:text-slate-400 mb-8">
              無制限メモ保存
            </p>
            <ul class="space-y-4 mb-10 opacity-60">
              <li class="flex items-start gap-3">
                <span class="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span class="text-slate-600 dark:text-slate-400"
                  >すべての機能</span
                >
              </li>
              <li class="flex items-start gap-3">
                <span class="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span class="text-slate-600 dark:text-slate-400"
                  >無制限メモ保存</span
                >
              </li>
              <li class="flex items-start gap-3">
                <span class="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span class="text-slate-600 dark:text-slate-400"
                  >優先サポート</span
                >
              </li>
              <li class="flex items-start gap-3">
                <span class="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span class="text-slate-600 dark:text-slate-400"
                  >高度な機能</span
                >
              </li>
            </ul>
            <button
              disabled
              class="w-full px-6 py-3 bg-slate-400 dark:bg-slate-600 text-white rounded-lg cursor-not-allowed font-medium"
            >
              準備中
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div
      class="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950"
    >
      <div class="mx-auto max-w-3xl text-center">
        <h2
          class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-8"
        >
          あなたのアイデアを<br />形にしましょう
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-400 mb-12">
          無料で始めて、Gemini AIの力を体験。<br />
          メモはシンプルに、思考は深く。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/login"
            class="inline-block px-8 py-4 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium"
          >
            ログインする
          </NuxtLink>
          <button
            @click="handleGuestLogin"
            class="inline-block px-8 py-4 border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-950 transition-colors font-medium"
          >
            ゲストで試す
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-slate-950"
    >
      <div class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Kaku Note
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              AIが手伝う次世代メモアプリ
            </p>
          </div>
          <div>
            <h4
              class="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm"
            >
              プロダクト
            </h4>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink
                  to="/memo"
                  class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >メモ</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/chat"
                  class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >AIチャット</NuxtLink
                >
              </li>
            </ul>
          </div>
          <div>
            <h4
              class="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm"
            >
              情報
            </h4>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >プライバシー</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >利用規約</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h4
              class="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm"
            >
              サポート
            </h4>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >お問い合わせ</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >よくある質問</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="border-t border-slate-200 dark:border-slate-800 pt-8 text-center"
        >
          <p class="text-slate-600 dark:text-slate-400 text-sm">
            &copy; 2025 Kaku Note. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMemoStore } from "~/stores/memo";
import { useAuthStore } from "~/stores/auth";
import { FileText, MessageSquare, Download } from "lucide-vue-next";

const memoStore = useMemoStore();
const authStore = useAuthStore();

const handleGuestLogin = () => {
  authStore.loginAsGuest();
  memoStore.initializeMemos();
  navigateTo("/dashboard");
};

onMounted(() => {
  memoStore.initializeDarkMode();
  authStore.initializeAuth();
});
</script>
