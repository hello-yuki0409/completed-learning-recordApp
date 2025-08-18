# サンドボックス → 本番 デプロイ フロー

## 1. サンドボックスで作業
### 新しい作業ブランチを切る
```
git switch -c feature/my-change
# コード修正
# (例: src/App.tsx を編集)

# 動作確認
npm run dev
```

## 2. サンドボックスの GitHub に push（プレビュー確認用）
```
git add .
git commit -m "feat: xxx"
git push origin feature/my-change
```
👉 サンドボックスの GitHub Actions が走り、Preview URL が発行される。
👉 PR ボタンが出るので確認。

## 3. 本番リポジトリにブランチを push
```
# prod リモートへも同じブランチを push
git push prod feature/my-change
```
👉 本番リポジトリにブランチが作られる。

## 4. GitHub 上で本番リポジトリに PR を作成

`feature/my-change` → `main` の Pull Request を作成

必要なら **レビュー/承認** を行う

## 5. マージ & デプロイ

PR を main にマージ

GitHub Actions が `deploy_production` を実行

`Actions` タブで「Review deployments」→ Approve and deploy を押す

👉 Firebase Hosting に本番デプロイされる

## 6. 最終確認
本番URL（例: https://completed-learning-recordapp.web.app）を開いて反映確認
```
ローカルを整理
git switch main
git pull origin main
git branch -d feature/my-change
git push origin --delete feature/my-change
git push prod   --delete feature/my-change
```
