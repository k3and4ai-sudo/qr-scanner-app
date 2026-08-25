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

**記録した日時**: 2026-08-25 15:51:00 JST
**概要**: スキャンURL自動安全性診断・警告モーダル・即時カメラ起動の実装および取扱説明書 (MD/HTML/PDF) の全面更新

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

4. **「QRスキャナーを起動」ボタン押下時の即時カメラ自動スキャン開始**:
   - ボタンをクリックした際、カメラモーダルへ即座に画面遷移すると同時に、**自動的に Web カメラを起動しリアルタイムQRコード解読がミリ秒単位で開始**されるよう改修。

5. **取扱説明書ドキュメント (`USER_MANUAL.md` / `USER_MANUAL.html` / `USER_MANUAL.pdf`) の全面更新**:
   - 新機能「ワンタップ即時スキャン開始」および「URL安全性自動診断・危険警告システム」を反映した取扱説明書 (`USER_MANUAL.md`) を更新。
   - Python + LibreOffice を連携してスタンドアロン HTML (`USER_MANUAL.html`) および PDF (`USER_MANUAL.pdf`) を自動再生成し、`./dist` (GitHub Pages) 配下へ同期配置。

---

## 2. トラブルシューティング（問題点・原因・解決方法）

### 問題1: VirusTotal リンクをクリックすると "The page you navigated to does not exist (404)" になる
- **問題点**: スキャン結果の VirusTotal リンクを開くとページが存在しない404エラーが発生。
- **原因**: `/gui/search/https%3A%2F%2F...` のようにURLエンコード文字列を直接パスに結合していたため、VirusTotalのルーティング仕様に合致しなかった。
- **解決方法**: `https://www.virustotal.com/gui/search?query=${encodedUrl}` に修正。

### 問題2: urlscan.io リンクをクリックすると "Expected '\\' but '/' found" エラーが発生する
- **問題点**: urlscan.io の検索結果画面で構文解析エラーが発生し、検索が実行されない。
- **原因**: urlscan.io のハッシュ検索 (`#https://...`) でURL内の `/` が正規表現のデリミタとして認識されたため。
- **解決方法**: `https://urlscan.io/search/#domain:${hostname}` に修正。

---

## 3. 次回の作業予定

- 改修成果の検証および Git リモートリポジトリへのプッシュ。
