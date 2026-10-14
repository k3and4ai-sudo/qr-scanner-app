---
name: git-topic-branch
description: 専用トピックブランチ（feature/xxx, fix/xxx）の作成、静的ビルド検証（npm run build）、および main への安全なマージを自動化・支援するスキル。新機能開発やバグ修正の開始・完了時に使用する。
---

# Git トピックブランチ管理スキル (Git Topic Branch Skill)

本スキルは、Claude Code Projects 風の専用ブランチ開発ワークフローを Antigravity 上で安全かつ確実に実行するための手順書です。

## 1. ワークフロー概要

```
[main] ──> git checkout -b feature/xxx ──> 実装 & コミット ──> npm run build ──> [main] へマージ
```

## 2. 実行手順

### ① ブランチ作成 (開発着手時)
タスク内容に応じて適切なプレフィックスでブランチを作成します：
```bash
git checkout -b <branch-name>
```
- 新機能: `feature/<name>` (例: `feature/export-csv`)
- バグ修正: `fix/<name>` (例: `fix/camera-flip`)
- ドキュメント: `docs/<name>` (例: `docs/readme-update`)
- リファクタリング: `refactor/<name>` (例: `refactor/hooks`)

### ② 実装・コミット
Conventional Commits 形式でコミットを作成：
```bash
git add <target-files>
git commit -m "<type>: <description>"
```

### ③ ビルド・静的検証ゲート (マージ前必須)
必ずビルドを実行し、エラー・警告ゼロを確認：
```bash
npm run build
```

### ④ マージとブランチ整理
検証をパスした場合、`main` に統合：
```bash
git checkout main
git merge <branch-name>
git branch -d <branch-name>
```
