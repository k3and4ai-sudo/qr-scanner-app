#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QR Master Studio - インフォグラフィック生成スクリプト
スライド13/14をベースにした徹底比較＆コアバリューの美しい高精細インフォグラフィック（HTML, PNG, PDF）を生成します。
"""

import os
import subprocess
import shutil

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_PATH = os.path.join(ROOT_DIR, "INFOGRAPHIC.html")
PNG_PATH = os.path.join(ROOT_DIR, "INFOGRAPHIC.png")
PDF_PATH = os.path.join(ROOT_DIR, "INFOGRAPHIC.pdf")

def build_infographic_html():
    html_content = """<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Master Studio - 次世代機能比較 ＆ コアバリュー インフォグラフィック</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #070c18;
      --bg-card: rgba(15, 23, 42, 0.75);
      --bg-card-border: rgba(255, 255, 255, 0.09);
      --primary: #38bdf8;
      --primary-gradient: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
      --accent-green: #10b981;
      --accent-green-gradient: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      --accent-amber: #f59e0b;
      --accent-purple: #c084fc;
      --accent-rose: #f43f5e;
      --text-main: #f8fafc;
      --text-sub: #94a3b8;
      --text-muted: #64748b;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', 'Noto Sans JP', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      display: flex;
      justify-content: center;
      padding: 40px 20px;
      line-height: 1.5;
    }

    .infographic-container {
      width: 100%;
      max-width: 1100px;
      background: radial-gradient(circle at 90% 10%, rgba(56, 189, 248, 0.12) 0%, transparent 50%),
                  radial-gradient(circle at 10% 90%, rgba(192, 132, 252, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 60%),
                  #090f20;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 56px 64px;
      box-shadow: 0 30px 90px -20px rgba(0, 0, 0, 0.9), 0 0 50px rgba(56, 189, 248, 0.1);
      position: relative;
      overflow: hidden;
    }

    /* ヘッダー領域 */
    .header {
      text-align: center;
      margin-bottom: 50px;
      position: relative;
      z-index: 2;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 20px;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: var(--primary);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .title {
      font-size: 46px;
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.2;
      margin-bottom: 14px;
    }

    .gradient-text {
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 18px;
      color: var(--text-sub);
      max-width: 820px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* セクション共通 */
    .section {
      margin-bottom: 52px;
      position: relative;
      z-index: 2;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }

    .section-num {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(56, 189, 248, 0.15);
      color: var(--primary);
      border: 1px solid rgba(56, 189, 248, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 800;
    }

    .section-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #fff;
    }

    .section-desc {
      font-size: 13px;
      color: var(--text-muted);
      margin-left: auto;
    }

    /* 4大コアバリュー（グリッド） */
    .core-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }

    .core-card {
      background: var(--bg-card);
      border: 1px solid var(--bg-card-border);
      border-radius: 16px;
      padding: 24px 20px;
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      position: relative;
      overflow: hidden;
      transition: transform 0.2s;
    }

    .core-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .core-card.speed::before { background: var(--primary-gradient); }
    .core-card.security::before { background: var(--accent-green-gradient); }
    .core-card.utility::before { background: linear-gradient(135deg, #f59e0b, #ef4444); }
    .core-card.autonomy::before { background: linear-gradient(135deg, #c084fc, #818cf8); }

    .core-icon {
      font-size: 28px;
      margin-bottom: 12px;
      display: inline-block;
    }

    .core-title {
      font-size: 16px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 8px;
    }

    .core-feature {
      font-size: 12.5px;
      color: var(--primary);
      font-weight: 700;
      margin-bottom: 8px;
    }

    .core-card.security .core-feature { color: var(--accent-green); }
    .core-card.utility .core-feature { color: var(--accent-amber); }
    .core-card.autonomy .core-feature { color: var(--accent-purple); }

    .core-p {
      font-size: 12px;
      color: var(--text-sub);
      line-height: 1.5;
    }

    /* 徹底比較マトリクス */
    .matrix-card {
      background: var(--bg-card);
      border: 1px solid var(--bg-card-border);
      border-radius: 18px;
      padding: 24px 28px;
      backdrop-filter: blur(16px);
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
    }

    .compare-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 13px;
    }

    .compare-table th {
      padding: 14px 16px;
      font-weight: 700;
      text-align: left;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      color: var(--text-sub);
      background: rgba(255, 255, 255, 0.02);
    }

    .compare-table th.app-hero {
      color: #fff;
      background: rgba(56, 189, 248, 0.12);
      border-bottom: 2px solid var(--primary);
      font-size: 14px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .compare-table td {
      padding: 13px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--text-sub);
      vertical-align: middle;
    }

    .compare-table tr:last-child td {
      border-bottom: none;
    }

    .compare-table td.feature-name {
      color: #fff;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .compare-table td.app-hero-cell {
      background: rgba(56, 189, 248, 0.04);
      color: #fff;
      font-weight: 700;
      border-left: 1px solid rgba(56, 189, 248, 0.15);
      border-right: 1px solid rgba(56, 189, 248, 0.15);
    }

    .compare-table tr:last-child td.app-hero-cell {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      border-bottom: 1px solid rgba(56, 189, 248, 0.15);
    }

    .tag-bad {
      color: #f87171;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .tag-mid {
      color: #fbbf24;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .tag-good {
      color: #34d399;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* 4ステップ・ワークフロー */
    .workflow-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      position: relative;
    }

    .flow-step {
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 14px;
      padding: 18px 16px;
      position: relative;
    }

    .flow-badge {
      font-size: 11px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 6px;
    }

    .flow-title {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }

    .flow-desc {
      font-size: 11.5px;
      color: var(--text-sub);
      line-height: 1.45;
    }

    /* フッター領域 */
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 28px;
      margin-top: 40px;
    }

    .footer-left h4 {
      font-size: 16px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 4px;
    }

    .footer-left p {
      font-size: 13px;
      color: var(--text-sub);
    }

    .footer-url {
      font-size: 14px;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 0.05em;
      background: rgba(56, 189, 248, 0.1);
      padding: 10px 24px;
      border-radius: 9999px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    @media print {
      body {
        padding: 0;
        background: #070c18 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .infographic-container {
        border: none !important;
        box-shadow: none !important;
        max-width: 100% !important;
        border-radius: 0 !important;
        padding: 40px !important;
      }
    }
  </style>
</head>
<body>

  <div class="infographic-container">
    
    <!-- HEADER -->
    <div class="header">
      <div class="badge">
        <span>⚡ 次世代 Progressive Web App (PWA) プラットフォーム</span>
      </div>
      <h1 class="title">
        <span class="gradient-text">QR Master Studio</span><br>
        機能徹底比較 ＆ 4大コアバリュー
      </h1>
      <p class="subtitle">
        ミリ秒GPUデコード × リアルタイム自動露出最適化 × 8項目詐欺防止診断。<br>
        従来のQRリーダーのストレス・危険・機能不足を1つのWebアプリで根底から解決。
      </p>
    </div>

    <!-- SECTION 1: 4大コアバリュー (スライド14より) -->
    <div class="section">
      <div class="section-header">
        <div class="section-num">1</div>
        <h2 class="section-title">QR Master Studio を支える 4大コアバリュー</h2>
        <span class="section-desc">スライド 14/14 より集約</span>
      </div>
      <div class="core-grid">
        <div class="core-card speed">
          <div class="core-icon">⚡</div>
          <h3 class="core-title">圧倒的な速さ</h3>
          <div class="core-feature">ミリ秒 GPU デコード</div>
          <p class="core-p">
            ブラウザ標準 BarcodeDetector API と自動露出最適化(Auto-EV)により、PC白飛びも暗所も0秒で瞬時解読。
          </p>
        </div>
        <div class="core-card security">
          <div class="core-icon">🛡️</div>
          <h3 class="core-title">最高峰の安心</h3>
          <div class="core-feature">8項目 安全スコア診断</div>
          <p class="core-p">
            100点満点以外の全URLは直前の警告確認モーダルで誤タップを完全遮断。フィッシング詐欺を未然に防止。
          </p>
        </div>
        <div class="core-card utility">
          <div class="core-icon">💼</div>
          <h3 class="core-title">業務直結の機能</h3>
          <div class="core-feature">ファイル読込 ＆ CSV連携</div>
          <p class="core-p">
            写真・D&D・貼付対応、自由なQR作成、Excelで絶対に文字化けしない UTF-8 BOM付きCSV出力を標準完備。
          </p>
        </div>
        <div class="core-card autonomy">
          <div class="core-icon">📖</div>
          <h3 class="core-title">取説 ＆ オフライン</h3>
          <div class="core-feature">PWA 0秒起動 ＆ 配布PDF</div>
          <p class="core-p">
            電波の届かない地下や機内でも全機能稼働。目次ジャンプ付き内蔵取説と印刷用A4 PDFをダウンロード可能。
          </p>
        </div>
      </div>
    </div>

    <!-- SECTION 2: 従来アプリ vs QR Master Studio 徹底比較 (スライド13より) -->
    <div class="section">
      <div class="section-header">
        <div class="section-num">2</div>
        <h2 class="section-title">従来アプリ vs QR Master Studio 徹底比較マトリクス</h2>
        <span class="section-desc">スライド 13/14 より集約</span>
      </div>
      <div class="matrix-card">
        <table class="compare-table">
          <thead>
            <tr>
              <th style="width: 28%;">評価項目</th>
              <th style="width: 24%;">一般的な無料QRアプリ</th>
              <th style="width: 20%;">標準カメラ機能</th>
              <th class="app-hero" style="width: 28%;">⚡ QR Master Studio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="feature-name"><span>⏱️</span> 起動速度 ＆ 広告</td>
              <td><span class="tag-bad">❌ 全画面広告で数秒待ち</span></td>
              <td>標準起動</td>
              <td class="app-hero-cell"><span class="tag-good">⭕ 0秒即時起動（広告完全ゼロ・PWA）</span></td>
            </tr>
            <tr>
              <td class="feature-name"><span>☀️</span> 白飛び・液晶画面の反射</td>
              <td><span class="tag-bad">❌ 反射で読取不可</span></td>
              <td><span class="tag-mid">△ 露出補正が難しい</span></td>
              <td class="app-hero-cell"><span class="tag-good">⭕ 自動露出最適化 (Auto-EV -2.0〜+2.0)</span></td>
            </tr>
            <tr>
              <td class="feature-name"><span>💡</span> 暗所・夜間のスキャン</td>
              <td><span class="tag-mid">△ 手動ライト点灯が必要</span></td>
              <td><span class="tag-mid">△ ノイズに弱い</span></td>
              <td class="app-hero-cell"><span class="tag-good">⭕ 暗所バックライト自動点灯 ＆ 二値化</span></td>
            </tr>
            <tr>
              <td class="feature-name"><span>🛡️</span> 詐欺・フィッシング防止</td>
              <td><span class="tag-bad">❌ そのまま直接開く</span></td>
              <td><span class="tag-bad">❌ そのまま直接開く</span></td>
              <td class="app-hero-cell"><span class="tag-good">⭕ 8項目安全診断 ＆ 100点未満警告ゲート</span></td>
            </tr>
            <tr>
              <td class="feature-name"><span>🖼️</span> 画像・スクショ読み込み</td>
              <td><span class="tag-mid">△ 一部アプリのみ対応</span></td>
              <td><span class="tag-bad">❌ カメラ撮影のみ</span></td>
              <td class="app-hero-cell"><span class="tag-good">⭕ 写真選択・D&D・Ctrl+V 貼り付け</span></td>
            </tr>
            <tr>
              <td class="feature-name"><span>🎨</span> QRコード作成・生成</td>
              <td><span class="tag-bad">❌ 別アプリが必要</span></td>
              <td><span class="tag-bad">❌ 非対応</span></td>
              <td class="app-hero-cell"><span class="tag-good">⭕ URL/Wi-Fi/テキスト・配色変更・PNG</span></td>
            </tr>
            <tr>
              <td class="feature-name"><span>📊</span> 履歴管理 ＆ Excel連携</td>
              <td><span class="tag-bad">❌ 閲覧のみ・制限あり</span></td>
              <td><span class="tag-bad">❌ 履歴が残らない</span></td>
              <td class="app-hero-cell"><span class="tag-good">⭕ メモ編集 ＆ 文字化けゼロ BOM付きCSV</span></td>
            </tr>
            <tr>
              <td class="feature-name"><span>📶</span> 通信圏外 (完全オフライン)</td>
              <td><span class="tag-bad">❌ 広告読込エラーで停止</span></td>
              <td><span class="tag-good">⭕ カメラのみ動作</span></td>
              <td class="app-hero-cell"><span class="tag-good">⭕ 全機能オフライン稼働 ＆ 内蔵取説</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 3: 4ステップ利用フロー -->
    <div class="section" style="margin-bottom: 20px;">
      <div class="section-header">
        <div class="section-num">3</div>
        <h2 class="section-title">迷わない 4ステップ利用フロー</h2>
        <span class="section-desc">現場の誰もが直感的に操作可能</span>
      </div>
      <div class="workflow-grid">
        <div class="flow-step">
          <div class="flow-badge">STEP 01</div>
          <div class="flow-title">🚀 0秒起動</div>
          <div class="flow-desc">ブラウザから即座にアクセス。初期画面ですぐに「QRスキャナー」がスタンバイ。</div>
        </div>
        <div class="flow-step">
          <div class="flow-badge">STEP 02</div>
          <div class="flow-title">🎯 1タップスキャン</div>
          <div class="flow-desc">最上部の大きな緑ボタンでカメラ起動。環境光に合わせて露出やバックライトが自動調整。</div>
        </div>
        <div class="flow-step">
          <div class="flow-badge">STEP 03</div>
          <div class="flow-title">🛡️ 8項目安全診断</div>
          <div class="flow-desc">瞬時に安全スコアを判定。リスク要因がある場合は直前の警告確認モーダルで誤タップを防御。</div>
        </div>
        <div class="flow-step">
          <div class="flow-badge">STEP 04</div>
          <div class="flow-title">🌐 安全アクセス ＆ 記録</div>
          <div class="flow-desc">水色の「URLを開く」で安全ジャンプ。履歴にはメモが保存され、ワンクリックでCSV出力。</div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-left">
        <h4>QR Master Studio (PWA)</h4>
        <p>登録不要・完全無料 ｜ 日常から現場のプロユースまで即座に使える次世代Webツール</p>
      </div>
      <div class="footer-url">
        🌐 https://k3and4ai-sudo.github.io/qr-scanner-app/
      </div>
    </div>

  </div>

</body>
</html>
"""
    with open(HTML_PATH, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Generated Infographic HTML: {HTML_PATH}")

def render_infographic_assets():
    print("[Render] Generating high-resolution INFOGRAPHIC.png via Headless Chrome...")
    # 1200x2300 高解像度キャプチャ
    cmd_png = [
        "google-chrome",
        "--headless",
        "--disable-gpu",
        "--window-size=1200,2250",
        "--hide-scrollbars",
        f"--screenshot={PNG_PATH}",
        HTML_PATH
    ]
    subprocess.run(cmd_png, check=True)
    print(f"Generated High-Res PNG: {PNG_PATH}")

    print("[Render] Generating print-ready INFOGRAPHIC.pdf via Headless Chrome...")
    cmd_pdf = [
        "google-chrome",
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={PDF_PATH}",
        HTML_PATH
    ]
    subprocess.run(cmd_pdf, check=True)
    print(f"Generated PDF: {PDF_PATH}")

def sync_distribution():
    print("[Sync] Syncing INFOGRAPHIC assets to public/ and dist/ ...")
    os.makedirs(os.path.join(ROOT_DIR, "public"), exist_ok=True)
    os.makedirs(os.path.join(ROOT_DIR, "dist"), exist_ok=True)

    for fname in ["INFOGRAPHIC.html", "INFOGRAPHIC.png", "INFOGRAPHIC.pdf"]:
        src = os.path.join(ROOT_DIR, fname)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(ROOT_DIR, "public", fname))
            shutil.copy2(src, os.path.join(ROOT_DIR, "dist", fname))
    print("[Sync] Completed.")

if __name__ == "__main__":
    build_infographic_html()
    render_infographic_assets()
    sync_distribution()
    print("All infographic artifacts generated successfully!")
