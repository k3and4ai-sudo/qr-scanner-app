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

3. **🎨 QRコード作成・発行ツール (Generator)**
   - URL、テキスト、Wi-Fi接続情報、vCard 名刺データからカスタマイズされた QR コードを瞬時に生成。
   - カラー変更機能（コード色・背景色）＆ 高画質 PNG ダウンロード機能。

4. **💾 履歴保存 & オフライン対応 (LocalStorage & PWA)**
   - スキャンした過去のコード履歴をブラウザ内に自動保存。ワンタップでコピー / リンク遷移。
   - PWA Manifest 対応により、スマホのホーム画面にアプリとして追加可能。

5. **📱 LINE WebView / スマホ実機最適化**
   - `liff.scanCodeV2` 連携に対応。LINE ミニアプリ内でも動作可能。

---

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
