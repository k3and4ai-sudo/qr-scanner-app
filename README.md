# ⚡ QR Master Studio - 超高速 PWA QRコードスキャナー & 発行ツール

![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)
![BarcodeDetector](https://img.shields.io/badge/Web_API-BarcodeDetector-orange.svg)

> **Web API ハードウェア加速 (`BarcodeDetector`) ＋ `jsQR` デュアルエンジン搭載。**  
> スマホ・PCのブラウザからカメラをかざすだけで、数ミリ秒の超高速でQRコードをリアルタイム解読できる Progressive Web Application (PWA) です。

---

## ✨ 主な機能と特徴

1. **⚡ 超高速スキャン (GPUアクセラレーション)**
   - Chromium 系ブラウザ（Android Chrome / PC Chrome / Edge 等）のネイティブ GPU 加速 API **`window.BarcodeDetector`** を優先利用。キャンバス抽出を経由せず、ミリ秒単位で瞬時デコード。
   - Safari / iOS 等非対応ブラウザでは最適化済み **`jsQR`**（25FPS シングルパス高速化）へ自動フォールバック。

2. **🟢 3段階ダイナミック LED ステータスランプ**
   - **`⚪ 未読み込み (待機中)`**: 消灯状態の灰色インジケーター。
   - **`🟡 スキャン実行中...`**: カメラ作動時にパルス点滅する黄色インジケーター。
   - **`🟢 読み込み完了！`**: スキャン成功時に輝く高輝度ネオングリーン。

3. **📁 ファイル読み込み (画像フォルダー / D&D / クリップボード)**
   - アルバム、写真ライブラリ、ダウンロードフォルダー内の画像やスクリーンショットから QR コードを高精度に解読。
   - 大津の二値化＋マルチ解像度スケーリングにより、暗所や高解像度写真も瞬時にデコード。

4. **🛡️ リアルタイム URL 安全度診断**
   - 読み取り URL のドメイン、プロトコル、短縮URL、不審な拡張子を解析し、0〜100点の安全スコアと内訳を表示。
   - LINE公式リンク判定時は専用の「📱 LINEで開く」ボタンでワンタップ起動。

5. **🎨 QRコード作成・発行ツール (Generator)**
   - URL、テキスト、Wi-Fi接続情報、vCard 名刺データからカスタマイズされた QR コードを瞬時に生成。
   - カラー変更機能（コード色・背景色）＆ 高画質 PNG ダウンロード機能。

6. **💾 履歴保存 & オフライン対応 (LocalStorage & PWA)**
   - スキャンした過去のコード履歴をブラウザ内に自動保存。ワンタップでコピー / リンク遷移。
   - PWA Manifest 対応により、スマホのホーム画面にアプリとして追加可能。

---

## 🏛️ 開発体制 (Antigravity Projects Architecture)

本プロジェクトは、Claude Code Projects の概念（司令塔・並列スレッド・共有メモリ・専用ブランチ管理）を Antigravity 上に最適化した自律型開発体制を採用しています。

- 📘 **[Antigravity Projects 運用ガイド](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/antigravity_projects_guide.md)**
- 🏗️ **[システムアーキテクチャ & コンポーネント相関](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/architecture.md)**
- 🧠 **[過去の設計判断 (ADR)](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/memory/decisions.md)**
- 📚 **[ドキュメント目次 (Obsidian MOC)](file:///media/k3and4/For_AI_Data/Antigravity/TestApp/qr-scanner-app/docs/README.md)**


## 🛠️ 技術スタック (Tech Stack)

- **Frontend**: React 18 / Vite 5
- **Icons**: Lucide React
- **QR Decoder**: Web BarcodeDetector API / `jsQR`
- **QR Encoder**: `qrcode`
- **Styling**: Modern Dark-Mode CSS (Glassmorphism & HSL tailoring)
- **Deployment**: GitHub Pages (GitHub Actions CI/CD)

---

## 🚀 ローカル開発手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/YOUR_USERNAME/qr-scanner-app.git
cd qr-scanner-app
```

### 2. 依存パッケージのインストール
```bash
npm install
```

### 3. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで `http://localhost:3000` にアクセスします。

### 4. プロダクションビルド
```bash
npm run build
```

---

## 🌐 GitHub Pages への自動デプロイ設定

本プロジェクトには `.github/workflows/deploy.yml` が同梱されています。

1. GitHub にリポジトリを作成し、`main` ブランチにコードをプッシュします。
2. GitHub リポジトリの `Settings` ➔ `Pages` タブを開きます。
3. **Build and deployment** の `Source` を **GitHub Actions** に変更します。
4. `main` ブランチへのプッシュ時に自動的にビルドされ、GitHub Pages URL に公開されます。

---

## 📄 ライセンス

[MIT License](LICENSE) &copy; 2026 QR Master Studio
