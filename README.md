# 学習時間記録アプリ

![2025-08-2522 40 22-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/e6d104cf-32ec-4e06-8037-4397167cd556)

## サービスの説明

学習記録をフォームで入力し、履歴として保存・編集・削除できる Web アプリです。  
React（Vite 環境）＋ Supabase を利用。  
自動テスト＆CI/CD パイプラインも整備しています。

## 主な機能

- 学習内容・学習時間・備考の記録
- 登録履歴の一覧表示／編集／削除
- 合計学習時間の自動計算・目標管理
- 自動テスト・CI 対応

## 技術スタック

- [React](https://react.dev/) (Vite)
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)
- [Supabase](https://supabase.com/) (DB/API)
- [Firebase Hosting](https://firebase.google.com/?hl=ja)（ホスティング・デプロイ）
- [GitHub Actions](https://docs.github.com/ja/actions)（CI/CD）
- [Makefile](https://www.gnu.org/software/make/manual/make.html)（デプロイスクリプト）
- [ESLint](https://eslint.org/)（静的コード解析）

## 開発・実行環境

- **フロントエンド**: Vite + React (TypeScript)
- **バックエンド**: Supabase（PostgreSQL/認証）
- **デプロイ**: Firebase Hosting
- **CI/CD**: GitHub Actions
- **テスト**: Jest, React Testing Library
- **パッケージ管理**: npm
- **その他**: Makefile（手動デプロイ補助）

## 環境設定の方法

### 1. このリポジトリをクローン

```bash
   git clone https://github.com/hello-yuki0409/completed-learning-recordApp
   cd completed-learning-recordApp
```

### 2. 必要なパッケージをインストール

```bash
  npm install
```

### 4. 環境変数の設定

下記を参考に`.env`ファイルを作成

```ini
   VITE_SUPABASE_URL=xxx
   VITE_SUPABASE_ANON_KEY=yyy
```

## 起動方法

### 開発サーバーを立ち上げる

```bash
   npm run dev
```

ブラウザで http://localhost:5173 を開く

## ビルド方法

```bash
   npm run build
```

`dist/`フォルダが生成されます

### テストの実行

```bash
   npm run test
```

Jest + React Testing Library で自動テストを実行

## デプロイ方法

### 自動デプロイ（GitHub Actions）

`main`ブランチへの push 等で`.github/workflows/deploy.yaml`が自動実行されます<br>
Firebase Hosting に自動デプロイされます

### 手動デプロイ（Makefile）

下記コマンドで手動デプロイも可能です。<br>
事前に Firebase CLI 認証（firebase login）をしておく必要があります

```bash
   make deploy
```

## データベース構成（Supabase）

- [Supabase](https://supabase.com/)のアカウントを作成する
- 新規プロジェクトを作成する(プロジェクト名は study-record、データベースパスワードは任意)
- Table Editor で以下のテーブルを作成する

テーブル名 : study-record

| カラム名  | 型      | デフォルト値        | 主キー | 説明              |
| :-------- | :------ | :------------------ | :----: | :---------------- |
| `id`      | uuid    | `gen_random_uuid()` |   ✅   | レコードの一意 ID |
| `records` | varchar | `NULL`              |        | 学習内容          |
| `time`    | int4    | `NULL`              |        | 学習時間          |
| `remark`  | varchar | `NULL`              |        | 備考              |

## Firebase Hosting 構成

詳細設定は`firebase.json`に記載

## テスト内容の例

- サンプルコンポーネントの表示テスト
- 入力フォームへの値入力・登録・削除ボタンの操作テスト
- 自動テストのコードは src/tests/ 配下に配置
