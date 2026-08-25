---
tags:
  - progress
  - log
  - qr-scanner
created: 2026-08-25
updated: 2026-08-25
type: session_log
---

# QR Scanner App - 作業ログ (2026-08-25)

**記録した日時**: 2026-08-25 15:25:00 JST
**概要**: スキャンURLの自動安全性診断・スコア判定・警告モーダルおよび外部DB検索リンクの不具合修正

---

## 1. 実施した作業概要

1. **URL 安全性自動判定＆脅威分析エンジン (`src/utils/urlSafety.js`) の実装**:
   - スキャンしたQRコードのURLに対して、**HTTPS通信有無・数値IPアドレス直打ち・Punycode文字偽装・高リスクTLD・危険拡張子・フィッシング語句**など8項目を総合診断し、0〜100点の安全スコアを算出するロジックを統合。

2. **安全スコアUI表示・警告モーダル・履歴連携 (`ResultCard.jsx` & `ScanHistory.jsx`)**:
   - `🟢 安全`, `🟡 注意`, `🔴 危険` のプログレスバー付きスコアバッジ、折りたたみ式詳細チェックリスト、外部調査リンクを表示。
   - スコアが注意・危険のURLを開こうとした際に事故を防止する **「安全警告ポップアップモーダル」** を実装。

3. **VirusTotal 404エラーおよび urlscan.io 構文エラーの解消**:
   - VirusTotal のURL検索フォーマットをパス結合型からクエリパラメータ型 (`?query=${url}`) へ修正し、404エラーを解決。
   - urlscan.io の検索クエリをスラッシュ直書き形式から `domain:${hostname}` 形式へ修正し、Elasticsearch 構文エラー (`Expected "\\" but "/" found`) を解消。
   - 補完サービスとして **`Norton Safe Web (安全診断)`** リンクを新たに追加。

---

## 2. トラブルシューティング（問題点・原因・解決方法）

### 問題1: VirusTotal リンクをクリックすると "The page you navigated to does not exist (404)" になる
- **問題点**: スキャン結果の VirusTotal リンクを開くとページが存在しない404エラーが発生。
- **原因**: `/gui/search/https%3A%2F%2F...` のようにURLエンコード文字列を直接パスに結合していたため、VirusTotalのルーティング仕様に合致しなかった。
- **解決方法**:
  - `https://www.virustotal.com/gui/search?query=${encodedUrl}` に修正し、検索エンドポイントへクエリ文字列として渡す構造に改善。

### 問題2: urlscan.io リンクをクリックすると "Expected '\\' but '/' found" エラーが発生する
- **問題点**: urlscan.io の検索結果画面で構文解析エラーが発生し、検索が実行されない。
- **原因**: urlscan.io のハッシュ検索 (`#https://...`) でURL内の `/` が正規表現のデリミタとして認識されたため。
- **解決方法**:
  - `https://urlscan.io/search/#domain:${hostname}` のドメイン指定形式に修正し、エラーなく該当ドメインの動作解析結果が表示されるよう改善。

---

## 3. 次回の作業予定

- 最新コードの動作テストおよび Git リモートへのコミット・プッシュ。
