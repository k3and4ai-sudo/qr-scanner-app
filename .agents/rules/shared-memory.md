# 共有メモリとナレッジ蓄積規約 (Shared Memory Rules)

本規約は、Claude Code Projects の「共有メモリとライブラリ」の概念を Antigravity 上で実現し、過去の経緯やルールを各セッション・スレッドで確実に引き継ぐための指針です。

## 1. 共有メモリの構成と参照順序

エージェントはタスク着手時に以下の優先順序で共有メモリを参照・確認すること：

1. **行動規範・運用ルール**:
   - [`AGENTS.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/AGENTS.md)
   - [`.agents/rules/`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/.agents/rules/) 配下の全ルール
2. **システム構造とデータフロー**:
   - [`docs/architecture.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/architecture.md)
3. **過去の設計判断・決定事項 (ADR)**:
   - [`docs/memory/decisions.md`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/memory/decisions.md)
4. **直近の進捗報告・再開メモ**:
   - [`docs/reports/`](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/reports/) 内の最新レポート

## 2. メモリへの書き込み・蓄積ルール

以下の事項が発生した場合、チャット内の会話だけで終わらせず、速やかに共有メモリへ記録すること：

- **新しい技術選定やライブラリ追加**: なぜそのライブラリを選んだか、代替案と比較した理由を `docs/memory/decisions.md` に追記。
- **仕様や方針の変更**: ユーザーから指示された恒久的な仕様変更を `docs/memory/decisions.md` および `AGENTS.md` に反映。
- **アーキテクチャの変更**: コンポーネントの追加・統廃合、データフローの変更があった場合は `docs/architecture.md` を更新。
