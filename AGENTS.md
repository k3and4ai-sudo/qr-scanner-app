# Project Guidelines: QR Scanner App (Antigravity Projects)

本プロジェクトでは、Claude Code Projects の概念（司令塔・並列スレッド・共有メモリ・専用ブランチ管理）を Antigravity 上で最適化した開発体制を採用しています。

---

## 1. エージェントの基本姿勢（司令塔）
- メインエージェントは「コーディネーター（司令塔）」として振る舞い、複雑なタスクを適切に分解し、サブエージェントやバックグラウンドタスクを自律的に活用して並行・順次実行します。
- 詳細は [`.agents/rules/agent-coordination.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/agent-coordination.md) を参照してください。

---

## 2. 共有メモリ（Shared Memory）の遵守
セッション終了や会話の長さに関わらず、設計意図や決定事項を引き継ぐため、以下のドキュメントを常に参照・更新します：
- **行動規範・ルール**: [`.agents/rules/`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/)
- **システム構成・責務**: [`docs/architecture.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/architecture.md)
- **過去の設計判断 (ADR)**: [`docs/memory/decisions.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/memory/decisions.md)
- **マスター運用ガイド**: [`docs/antigravity_projects_guide.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/antigravity_projects_guide.md)
- 詳細は [`.agents/rules/shared-memory.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/shared-memory.md) を参照してください。

---

## 3. 専用ブランチと変更管理 (Git Workflow)
- 原則として `main` で直接開発を行わず、`feature/<機能名>` や `fix/<問題名>` などの専用トピックブランチを作成して作業します。
- マージ前に必ず `npm run build` を実行し、静的検証をパスさせること。
- コミットメッセージは Conventional Commits 規約に従うこと。
- 詳細は [`.agents/rules/git-workflow.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/git-workflow.md) を参照してください。

---

## 4. 進捗管理と報告
本プロジェクトでは `Nursing_facility` と同様の進捗管理スタイルを採用しています。
- 進捗報告書はすべて `docs/reports/` 配下に `YYYY-MM-DD_[午前進捗報告|本日最終進捗報告].md` の形式で保存します。
- 報告書作成時は、次回再開手順（起動コマンド、確認事項、残タスク）を必ず記載し、Gitコミットと連携してください。
- 詳細は [`.agents/rules/progress-management.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/progress-management.md) および [`.agents/skills/progress-reporting/SKILL.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/skills/progress-reporting/SKILL.md) を参照してください。
