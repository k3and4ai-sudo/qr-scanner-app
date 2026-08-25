---
tags:
  - progress
  - log
  - qr-scanner
created: 2026-08-25
updated: 2026-08-25
type: session_log
---

# QR Scanner App - セッション終了ログ (2026-08-25)

**記録した日時**: 2026-08-25 17:00:00 JST
**概要**: スキャンURL自動安全性判定・カメラ最上部配置・ナビ2行2列大文字化および取説全更新

---

## 1. 本セッションの実施成果

1. **URL 安全性自動判定＆脅威分析エンジン (`src/utils/urlSafety.js`) の構築**:
   - 読み込んだQRコードのURLに対し、**HTTPS通信有無・数値IP直打ち・Punycode文字偽装・高リスクTLD・危険拡張子・フィッシング語句**など8項目を総合診断し、0〜100点の安全スコアを算出。

2. **安全スコアUI表示・安全警告モーダル・履歴連携 (`ResultCard.jsx` & `ScanHistory.jsx`)**:
   - 🟢 安全 / 🟡 注意 / 🔴 危険のプログレスバー付きスコアバッジ、アコーディオン診断内訳、外部セキュリティDB調査リンクを実装。
   - 注意・危険URLを開こうとした際に誤アクセスを防止する **「安全警告ポップアップモーダル」** を搭載。

3. **VirusTotal 404エラーおよび urlscan.io 構文エラーの解消**:
   - VirusTotal のURL検索フォーマットをパス結合型からクエリパラメータ型 (`?query=${url}`) へ修正。
   - urlscan.io の検索クエリを `domain:${hostname}` 形式へ修正し構文エラーを解消。`Norton Safe Web` リンクを新設。

4. **「QRスキャナーを起動」ボタン押下時の即時カメラ自動スキャン開始**:
   - ボタンをクリックした瞬間、カメラモーダル画面へ即座に画面遷移すると同時に、遅延なく Web カメラが起動してリアルタイムスキャンが自動開始されるよう改修。

5. **起動画面上部4ボタンの「2行2列」グリッド化 ＆ 特大フォント化 (`Navbar.jsx`)**:
   - 上部ヘッダーの「QRスキャナー」「QRコード作成」「履歴」「取説」の4ボタンを **2行2列均等グリッド (`fontSize: 16px bold`)** に再構築し、視認性と押しやすさを向上。

6. **スキャナーモーダル内「カメラ映像プレビュー」の最上部配置 (`QrScanner.jsx`)**:
   - カメラモーダル画面にて、カメラ選択や露光制御パネルより前に **カメラ映像ビュー (`<video>`) を最上部（タイトル/ステータスランプ直下）へ配置換え**。

7. **取扱説明書ドキュメント (`USER_MANUAL.md` / `USER_MANUAL.html` / `USER_MANUAL.pdf` / `UserManual.jsx`) の全更新**:
   - アプリ内 `UserManual.jsx` タブ画面の構築、および「2行2列ナビ」「即時カメラ起動」「8項目URL安全性判定」「GPU加速BarcodeDetector & 白飛び復元エンジン」の技術解説をマニュアル全形式に反映・再生成。

---

## 2. トラブルシューティング（問題点・原因・解決方法）

### 問題1: VirusTotal リンクをクリックすると "The page you navigated to does not exist (404)" になる
- **問題点**: スキャン結果の VirusTotal リンクを開くとページが存在しない404エラーが発生。
- **原因**: `/gui/search/https%3A%2F%2F...` のようにURLエンコード文字列を直接パスに結合していたため。
- **解決方法**: `https://www.virustotal.com/gui/search?query=${encodedUrl}` に修正。

### 問題2: urlscan.io リンクをクリックすると "Expected '\\' but '/' found" エラーが発生する
- **問題点**: urlscan.io の検索結果画面で構文解析エラーが発生し、検索が実行されない。
- **原因**: urlscan.io のハッシュ検索 (`#https://...`) でURL内の `/` が正規表現のデリミタとして認識されたため。
- **解決方法**: `https://urlscan.io/search/#domain:${hostname}` に修正。

---

## 3. 次回スタート時の申し送り事項

- **GitHub Pages 公開 URL**:  
  👉 [https://k3and4ai-sudo.github.io/qr-scanner-app/](https://k3and4ai-sudo.github.io/qr-scanner-app/)
- **ローカル開発環境 URL**:  
  👉 [http://localhost:3000/](http://localhost:3000/)
- **同じ Wi-Fi（LAN）内アクセス URL**:  
  👉 [http://192.168.0.10:3000/](http://192.168.0.10:3000/)
- 全変更コードのビルド・ローカルコミット・GitHub への Remote Push はすべて完了しており、作業ツリーはクリーンな状態です。
