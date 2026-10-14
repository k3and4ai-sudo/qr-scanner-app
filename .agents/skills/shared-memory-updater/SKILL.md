---
name: shared-memory-updater
description: 共有メモリ（docs/memory/decisions.md や docs/architecture.md）の記録・更新を支援するスキル。重要な技術選定、設計判断（ADR）、コンポーネント追加・変更時に使用する。
---

# 共有メモリ更新スキル (Shared Memory Updater Skill)

本スキルは、開発中に発生した設計判断やアーキテクチャの変更を、Claude Code Projects の「共有メモリ」として永続化するための手順書です。

## 1. 記録対象と更新先

| 変更内容 | 更新対象ファイル | フォーマット |
| :--- | :--- | :--- |
| 新しいライブラリ導入・アーキテクチャ決定・仕様変更 | [`docs/memory/decisions.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/memory/decisions.md) | ADR 形式（タイトル、日付、背景、決定、結果） |
| コンポーネントの追加・責務変更・データフロー更新 | [`docs/architecture.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/architecture.md) | Mermaid 図 ＋ 責務一覧表 |

## 2. ADR 追記フォーマット例

```markdown
## ADR-00X: <決定タイトル>

- **日付**: YYYY-MM-DD
- **背景**: なぜその決定が必要になったか
- **決定**: 採用した技術・方針
- **結果**: 得られた効果・影響範囲
```
