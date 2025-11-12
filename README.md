# KakuNote - AI 搭載ノートテイキングアプリケーション

Google Gemini AI を活用した高機能メモアプリケーション。アイデアの創出、整理、コンテンツの改善をインテリジェントなアシスタンスで実現します。

---

## <span style="color: #2563eb;">◆</span> 概要

KakuNote は、Vue 3 フロントエンドと Go バックエンドを組み合わせた最新のフルスタック メモアプリケーションです。AI を活用してアイデアを生成し、コンテンツを洗練し、タスクを抽出し、情報をシームレスに整理できます。

---

## <span style="color: #059669;">★</span> 主な機能

### AI 搭載機能

| 機能               | 説明                                               |
| ------------------ | -------------------------------------------------- |
| **アイデア生成**   | テーマに対して多角的な視点と創造的なアイデアを生成 |
| **コンテンツ改善** | テキストの自動洗練と改善提案                       |
| **スマート整理**   | 自動タグ付けとインテリジェントなコンテンツ構造化   |
| **タスク抽出**     | メモから自動的にアクションアイテムを抽出           |
| **要約生成**       | 長いコンテンツを簡潔な要約に変換                   |

### コア機能

| 機能                         | 説明                                            |
| ---------------------------- | ----------------------------------------------- |
| **Markdown エディタ**        | フル Markdown 対応のリッチテキスト編集          |
| **全文検索**                 | タイトル、コンテンツ、タグ全体から検索          |
| **カテゴリシステム**         | カスタムカテゴリでメモを整理                    |
| **ピン留め機能**             | 重要なメモを上部に固定                          |
| **自動保存**                 | すべての変更が自動的に保存                      |
| **チャットインターフェース** | AI とのインタラクティブな会話でコンテンツを改善 |

---

## <span style="color: #7c3aed;">◈</span> アーキテクチャ

```
KakuNote/
├── ai-memo-app/              # フロントエンド (Nuxt 3 + Vue 3)
│   ├── app/
│   │   ├── components/       # Vue コンポーネント
│   │   ├── composables/      # ロジック構成
│   │   ├── layouts/          # ページレイアウト
│   │   ├── pages/            # ルーティング対象ページ
│   │   ├── stores/           # Pinia 状態管理
│   │   ├── plugins/          # Vue プラグイン
│   │   └── assets/           # CSS と静的ファイル
│   ├── nuxt.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── backend/                  # バックエンド (Go)
    ├── cmd/                  # アプリケーション エントリーポイント
    ├── internal/
    │   ├── api/              # API ハンドラー
    │   ├── models/           # データモデル
    │   ├── repository/       # データベース層
    │   ├── service/          # ビジネスロジック
    │   └── middleware/       # HTTP ミドルウェア
    ├── config/               # 設定ファイル
    ├── db/                   # データベース マイグレーション
    ├── main.go
    └── go.mod
```

---

## <span style="color: #dc2626;">▶</span> クイックスタート

### 必要な環境

- **Node.js** 16 以上（pnpm 8 以上）
- **Go** 1.21 以上
- **PostgreSQL**（Sakura VPS またはローカル）

### フロントエンド セットアップ

```bash
cd ai-memo-app

# 依存パッケージをインストール
pnpm install

# 環境変数を設定
cp .env.example .env
# .env に Gemini API キーを追加

# 開発サーバーを起動
pnpm run dev
```

`http://localhost:3000` を開く

### バックエンド セットアップ

```bash
cd backend

# 依存パッケージをダウンロード
go mod download

# データベース設定
cp .env.example .env
# DATABASE_URL を PostgreSQL 接続文字列に更新

# サーバー起動
go run cmd/main.go
```

サーバーは `http://localhost:8080` で実行

---

## <span style="color: #ea580c;">⚙</span> 技術スタック

### フロントエンド

- **フレームワーク**: Nuxt 4 + Vue 3
- **スタイリング**: Tailwind CSS
- **状態管理**: Pinia
- **AI 統合**: Google Generative AI (Gemini)
- **言語**: TypeScript

### バックエンド

- **言語**: Go 1.21 以上
- **フレームワーク**: Gin
- **データベース**: PostgreSQL (GORM 使用)
- **認証**: JWT
- **暗号化**: bcrypt

---

## <span style="color: #0891b2;">◎</span> 使用ガイド

### メモの作成

1. サイドバーの **新規作成** をクリック
2. タイトルと内容を入力
3. 変更は localStorage/データベースに自動保存
4. （オプション）重要なメモをピン留め

### AI 機能の使用

メモ エディタから：

| ボタン           | アクション                     |
| ---------------- | ------------------------------ |
| **アイデア生成** | テーマに対して複数の視点を提供 |
| **要約**         | コンテンツを簡潔に要約         |
| **タグ抽出**     | 関連タグを自動生成             |
| **タスク抽出**   | アクションアイテムを識別・抽出 |
| **テキスト改善** | 文章の品質と明確性を向上       |

### 整理機能

- **検索**: サイドバーの検索ボックスで全文検索
- **フィルター**: ドロップダウンからカテゴリを選択
- **ピン留め/解除**: ピン状態を切り替えて素早くアクセス
- **削除**: 削除アクションでメモを削除

---

## <span style="color: #be185d;">⚡</span> セキュリティ上の注意

- `.env` ファイルに機密情報を含めてコミットしない
- `.gitignore` に環境ファイルが含まれていることを確認
- 本番環境では環境変数を安全に管理
- Gemini API キーを機密に保つ
- すべてのネットワーク通信で HTTPS を使用
- バックエンド エンドポイントにレート制限を実装

---

## <span style="color: #4f46e5;">✎</span> 開発ワークフロー

### フロントエンド開発

```bash
cd ai-memo-app

# ホットリロード付き開発サーバー
pnpm run dev

# 本番用ビルド
pnpm run build

# 型チェック
pnpm run typecheck
```

### バックエンド開発

```bash
cd backend

# ホットリロード実行（air などが必要）
go run cmd/main.go

# バイナリをビルド
go build -o kakunote-backend cmd/main.go

# テスト実行
go test ./...
```

---

## <span style="color: #0284c7;">◎</span> デプロイ

### Vercel へのフロントエンド デプロイ

```bash
cd ai-memo-app

# デプロイ
vercel
```

### Sakura VPS へのバックエンド デプロイ

```bash
# ビルド
go build -o kakunote-backend cmd/main.go

# VPS に転送
scp kakunote-backend user@your-vps-ip:~/

# VPS で実行
ssh user@your-vps-ip
./kakunote-backend
```

---

## <span style="color: #7c3aed;">◊</span> API エンドポイント

### 認証

```
POST   /api/auth/register    - 新規ユーザー登録
POST   /api/auth/login       - ユーザーログイン
POST   /api/auth/logout      - ユーザーログアウト
```

### メモ

```
GET    /api/memos            - ユーザーのメモ一覧
POST   /api/memos            - 新規メモ作成
GET    /api/memos/:id        - メモ詳細取得
PATCH  /api/memos/:id        - メモ更新
DELETE /api/memos/:id        - メモ削除
```

### AI 機能

```
POST   /api/ai/generate-ideas      - アイデア生成
POST   /api/ai/summarize           - コンテンツ要約
POST   /api/ai/extract-tags        - タグ抽出
POST   /api/ai/extract-tasks       - タスク抽出
```

---

## <span style="color: #16a34a;">⟡</span> 貢献

ご協力ありがとうございます。以下の手順でお願いします：

1. リポジトリをフォーク
2. フィーチャーブランチを作成: `git checkout -b feature/amazing-feature`
3. 変更をコミット: `git commit -m 'Add amazing feature'`
4. ブランチにプッシュ: `git push origin feature/amazing-feature`
5. プルリクエストを作成

---

## <span style="color: #ca8a04;">■</span> リソース

- [Nuxt ドキュメント](https://nuxt.com/docs)
- [Vue 3 ガイド](https://vuejs.org/guide/)
- [Gin Web フレームワーク](https://github.com/gin-gonic/gin)
- [GORM ドキュメント](https://gorm.io/)
- [Google Gemini API](https://ai.google.dev/)
- [PostgreSQL ドキュメント](https://www.postgresql.org/docs/)

---

## <span style="color: #6366f1;">▪</span> ライセンス

MIT ライセンス - LICENSE ファイルを参照

---

## <span style="color: #475569;">◆</span> 作成者

**HizumeKazushi**

---

## <span style="color: #e11d48;">◉</span> サポート

問題、質問、提案がある場合は、GitHub で Issue を開いてください。

---

**最終更新**: 2025 年 11 月
