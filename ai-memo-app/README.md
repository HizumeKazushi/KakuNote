# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

# 🤖 AI メモ アプリケーション

AI を活用した高機能メモアプリケーション。Google Gemini API を使用して、アイデア創出、文章編集、情報整理などの機能を提供します。

## ✨ 主な機能

### AI 機能

- **💡 アイデア創出支援** - テーマに対して多角的なアイデアを生成
- **📝 文章生成・編集支援** - テキストのリライト、改善提案
- **🏷️ 情報整理・構造化支援** - 自動タグ付け、タスク抽出
- **✅ タスク抽出** - メモからアクションアイテムを自動抽出
- **📊 要約生成** - 長いテキストを簡潔に要約

### 基本機能

- **✍️ Markdown 対応エディタ** - 豊富なテキスト編集機能
- **🔍 全文検索** - タイトル、内容、タグから検索可能
- **🏷️ カテゴリ分類** - メモを複数のカテゴリで整理
- **📌 ピン留め機能** - 重要なメモを上部に固定
- **💾 自動保存** - すべてのメモは localStorage に自動保存
- **🌙 ダーク/ライトモード** - テーマ切り替え

## 🚀 セットアップ

### 必要な環境

- Node.js 16+
- pnpm 8+

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd kaku-note

# 依存パッケージをインストール
pnpm install

# 環境変数を設定
cp .env.example .env
# .envファイルを編集して、Gemini API キーを設定
```

### Gemini API キーの取得

1. [Google AI Studio](https://aistudio.google.com/app/apikey) にアクセス
2. 「API キーを作成」をクリック
3. 生成されたキーを `.env` ファイルに貼り付け

```env
NUXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

## 🏃 開発

### 開発サーバー起動

```bash
pnpm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### ビルド

```bash
pnpm run build
```

### プレビュー

```bash
pnpm run preview
```

## 📦 プロジェクト構造

```
kaku-note/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Tailwind CSS
│   ├── components/
│   │   ├── MemoEditor.vue        # メモエディタ
│   │   ├── MemoList.vue          # メモリスト
│   │   └── MemoItem.vue          # メモアイテム
│   ├── composables/
│   │   └── useGeminiAI.ts        # AI機能コンポーザブル
│   ├── layouts/
│   │   └── default.vue           # デフォルトレイアウト
│   ├── pages/
│   │   └── index.vue             # ホームページ
│   ├── plugins/
│   │   └── pinia.ts              # Pinia初期化
│   ├── stores/
│   │   └── memo.ts               # メモストア
│   └── app.vue                   # ルートコンポーネント
├── public/                        # 静的ファイル
├── nuxt.config.ts                # Nuxt設定
├── tailwind.config.ts            # Tailwind CSS設定
├── tsconfig.json                 # TypeScript設定
└── package.json                  # 依存パッケージ
```

## 🛠️ 技術スタック

- **フレームワーク**: Nuxt 4 + Vue 3
- **スタイリング**: Tailwind CSS
- **状態管理**: Pinia
- **AI API**: Google Generative AI (Gemini)
- **言語**: TypeScript
- **パッケージマネージャー**: pnpm

## 📝 使用方法

### メモの作成

1. 左のサイドバーの「✏️ 新規作成」ボタンをクリック
2. タイトルと内容を入力
3. 自動的に保存されます

### AI 機能の使用

1. メモの内容を入力
2. 以下のボタンをクリック：
   - **💡 アイデア生成** - 新しいアイデアを提案
   - **📝 要約** - テキストを簡潔に要約
   - **🏷️ タグ抽出** - 自動でタグを生成
   - **✅ タスク抽出** - アクションアイテムを抽出

### メモの整理

- **検索**: サイドバーの検索ボックスにキーワードを入力
- **フィルター**: カテゴリドロップダウンで分類
- **ピン留め**: メモ右側の 📍 アイコンをクリック
- **削除**: メモ右側の 🗑️ アイコンをクリック

## 🔒 セキュリティに関する注意

- API キーは絶対に公開リポジトリにコミットしないでください
- `.gitignore` に `.env` ファイルが含まれていることを確認してください
- 本番環境では環境変数を安全に管理してください

## 🤝 貢献

改善提案やバグ報告は、Issue を通じてお願いします。

## 📄 ライセンス

MIT License

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
