# 📚 QR Scanner App ドキュメント・インデックス (Obsidian MOC)

> [!NOTE]
> 本ディレクトリ（`docs/`）は、本プロジェクトの設計思想、アーキテクチャ、過去の意思決定（ADR）、進捗報告、および開発運用ルールを集約した Obsidian 対応ナレッジベースです。

---

## 🗺️ ナレッジマップ (Map of Content)

### 1. 開発運用・Projects フレームワーク
- 📘 **[`antigravity_projects_guide.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/antigravity_projects_guide.md)**:
  - Antigravity Projects の全体マスターガイド。
  - 司令塔（コーディネーター）、並列サブタスク、共有メモリ、専用ブランチ運用の全容とシーケンス図。

### 2. システム設計・アーキテクチャ
- 🏗️ **[`architecture.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/architecture.md)**:
  - 全体コンポーネント構成図（Mermaid）、各コンポーネントの責務一覧、データフロー定義。

### 3. 意思決定記録 (ADR / Memory)
- 🧠 **[`memory/decisions.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/memory/decisions.md)**:
  - ADR-001: ローカル HTTPS（basic-ssl）の導入
  - ADR-002: BarcodeDetector と jsQR のハイブリッド方式
  - ADR-003: LINE QRコード判定と専用起動
  - ADR-004: ナビゲーション二段表示レイアウト刷新

### 4. 進捗報告・再開メモ (Reports)
- 📋 **[`reports/`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/reports/)**:
  - `YYYY-MM-DD_午前進捗報告.md`
  - `YYYY-MM-DD_本日最終進捗報告.md`

---

## ⚡ エージェント向けルール・スキル連携
- **行動規範**: [`.agents/rules/`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/)
  - [`agent-coordination.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/agent-coordination.md): 司令塔オーケストレーション
  - [`shared-memory.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/shared-memory.md): 共有メモリ規約
  - [`git-workflow.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/git-workflow.md): トピックブランチ・変更管理規約
  - [`progress-management.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/progress-management.md): 進捗管理指針
