#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QR Master Studio - インタラクティブ・プレゼンテーションスライド生成スクリプト
ブラウザで全画面発表・操作できるスタンドアロンHTMLと、16:9印刷用PDFを一括生成します。
"""

import os
import base64
import subprocess
import shutil

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_PATH = os.path.join(ROOT_DIR, "PRESENTATION.html")
PDF_PATH = os.path.join(ROOT_DIR, "PRESENTATION.pdf")
IMAGES_DIR = os.path.join(ROOT_DIR, "docs", "manual_images")

def get_base64_image(filename):
    path = os.path.join(IMAGES_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/png;base64,{encoded}"
    return ""

def build_presentation_html():
    img_scanner = get_base64_image("01_qr_scanner_main.png")
    img_result = get_base64_image("02_qr_scanner_result.png")
    img_file = get_base64_image("03_file_scanner.png")
    img_gen = get_base64_image("04_qr_generator.png")
    img_history = get_base64_image("05_scan_history.png")
    img_manual = get_base64_image("06_user_manual.png")

    html_content = f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Master Studio - プレゼンテーションスライド (Interactive Slide Deck)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg-dark: #060913;
      --bg-card: rgba(15, 23, 42, 0.72);
      --bg-card-border: rgba(255, 255, 255, 0.08);
      --primary: #38bdf8;
      --primary-gradient: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
      --accent-cyan: #22d3ee;
      --accent-green: #10b981;
      --accent-green-gradient: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      --accent-amber: #f59e0b;
      --accent-purple: #c084fc;
      --text-main: #f8fafc;
      --text-sub: #94a3b8;
      --text-muted: #64748b;
      --slide-width: 1280px;
      --slide-height: 720px;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      font-family: 'Inter', 'Noto Sans JP', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }}

    /* スライドコンテナ（16:9比率固定・自動スケール） */
    #presentation-viewport {{
      position: relative;
      width: var(--slide-width);
      height: var(--slide-height);
      transform-origin: center center;
      box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.9), 0 0 50px rgba(56, 189, 248, 0.12);
      border-radius: 16px;
      overflow: hidden;
      background: radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.09) 0%, transparent 60%),
                  radial-gradient(circle at 15% 85%, rgba(192, 132, 252, 0.08) 0%, transparent 60%),
                  radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.6) 0%, transparent 100%),
                  #070c18;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }}

    /* 各スライド共通 */
    .slide {{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 40px 52px 32px 52px;
      display: flex;
      flex-direction: column;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, transform 0.3s ease;
      transform: scale(0.985);
      pointer-events: none;
    }}

    .slide.active {{
      opacity: 1;
      visibility: visible;
      transform: scale(1);
      pointer-events: auto;
    }}

    /* ヘッダー領域 */
    .slide-header {{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px;
      position: relative;
      z-index: 2;
    }}

    .header-left {{
      display: flex;
      flex-direction: column;
      gap: 5px;
    }}

    .slide-badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      padding: 3px 12px;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.12);
      color: var(--primary);
      border: 1px solid rgba(56, 189, 248, 0.3);
      width: fit-content;
    }}

    .slide-title {{
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
    }}

    .gradient-text {{
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .slide-subtitle {{
      font-size: 13.5px;
      color: var(--text-sub);
      font-weight: 500;
    }}

    .header-logo {{
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.06em;
      background: rgba(255, 255, 255, 0.03);
      padding: 6px 14px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }}

    /* メインコンテンツ領域 */
    .slide-body {{
      flex: 1;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 32px;
      align-items: center;
      position: relative;
      z-index: 2;
      min-height: 0;
    }}

    .slide-body.full-width {{
      grid-template-columns: 1fr;
    }}

    /* コンテンツカード */
    .card {{
      background: var(--bg-card);
      border: 1px solid var(--bg-card-border);
      border-radius: 14px;
      padding: 20px 24px;
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    }}

    .feature-list {{
      display: flex;
      flex-direction: column;
      gap: 12px;
    }}

    .feature-item {{
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 12px 16px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: background 0.2s ease, transform 0.2s ease;
    }}

    .feature-item:hover {{
      background: rgba(255, 255, 255, 0.05);
      transform: translateX(4px);
    }}

    .feature-icon {{
      width: 36px;
      height: 36px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
      background: rgba(56, 189, 248, 0.15);
      color: var(--primary);
      border: 1px solid rgba(56, 189, 248, 0.3);
    }}

    .feature-icon.green {{
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent-green);
      border-color: rgba(16, 185, 129, 0.3);
    }}

    .feature-icon.amber {{
      background: rgba(245, 158, 11, 0.15);
      color: var(--accent-amber);
      border-color: rgba(245, 158, 11, 0.3);
    }}

    .feature-icon.purple {{
      background: rgba(192, 132, 252, 0.15);
      color: var(--accent-purple);
      border-color: rgba(192, 132, 252, 0.3);
    }}

    .feature-content h4 {{
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 3px;
    }}

    .feature-content p {{
      font-size: 12.5px;
      color: var(--text-sub);
      line-height: 1.5;
    }}

    /* 右側：画像キャプチャ表示枠 */
    .screenshot-frame {{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }}

    .device-mockup {{
      position: relative;
      background: #0b1329;
      border: 2px solid rgba(255, 255, 255, 0.18);
      border-radius: 20px;
      padding: 5px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.15);
      max-height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .device-mockup img {{
      height: 440px;
      max-width: 250px;
      border-radius: 16px;
      display: block;
      object-fit: contain;
    }}

    .mockup-caption {{
      margin-top: 8px;
      font-size: 11.5px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    /* フッター領域 */
    .slide-footer {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 11px;
      color: var(--text-muted);
      position: relative;
      z-index: 2;
    }}

    /* 表紙スライド（Slide 1） */
    .hero-slide {{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 100%;
      padding: 20px 40px;
    }}

    .hero-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 18px;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: var(--primary);
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 20px;
      letter-spacing: 0.05em;
    }}

    .hero-title {{
      font-size: 52px;
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 14px;
    }}

    .hero-sub {{
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 18px;
    }}

    .hero-desc {{
      font-size: 17px;
      color: var(--text-sub);
      max-width: 840px;
      line-height: 1.6;
      margin-bottom: 30px;
    }}

    .hero-pills {{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-bottom: 28px;
    }}

    .hero-pill {{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 13px;
      font-weight: 600;
    }}

    /* 比較テーブル（Slide 2 / Slide 3） */
    .compare-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      margin-top: 6px;
    }}

    .compare-table th, .compare-table td {{
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }}

    .compare-table th {{
      color: var(--text-sub);
      font-weight: 600;
      background: rgba(255, 255, 255, 0.02);
    }}

    .compare-table tr:last-child td {{
      border-bottom: none;
    }}

    .compare-table td.highlight {{
      color: var(--primary);
      font-weight: 700;
      background: rgba(56, 189, 248, 0.06);
    }}

    /* コントロールバー（画面下部） */
    #deck-controls {{
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(20px);
      padding: 7px 16px;
      border-radius: 9999px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      z-index: 100;
      font-size: 13px;
    }}

    .control-btn {{
      background: none;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border-radius: 6px;
      transition: background 0.2s, color 0.2s;
    }}

    .control-btn:hover {{
      background: rgba(255, 255, 255, 0.12);
      color: var(--primary);
    }}

    .progress-track {{
      width: 130px;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      overflow: hidden;
      margin: 0 6px;
    }}

    .progress-fill {{
      height: 100%;
      background: var(--primary-gradient);
      width: 10%;
      transition: width 0.3s ease;
    }}

    /* スピーカーノート・ドロワー */
    #speaker-notes-drawer {{
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      width: 390px;
      background: rgba(9, 14, 26, 0.96);
      border-left: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(24px);
      padding: 24px;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 90;
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.6);
    }}

    #speaker-notes-drawer.open {{
      transform: translateX(0);
    }}

    .notes-header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 16px;
    }}

    .notes-content {{
      flex: 1;
      overflow-y: auto;
      font-size: 13.5px;
      line-height: 1.7;
      color: #cbd5e1;
    }}

    .notes-content h4 {{
      color: var(--primary);
      font-size: 15px;
      margin-bottom: 10px;
    }}

    .notes-content p {{
      margin-bottom: 14px;
    }}

    /* スライド一覧オーバーレイ */
    #overview-overlay {{
      position: fixed;
      inset: 0;
      background: rgba(5, 8, 15, 0.95);
      backdrop-filter: blur(15px);
      z-index: 150;
      display: none;
      flex-direction: column;
      padding: 36px;
      overflow-y: auto;
    }}

    #overview-overlay.open {{
      display: flex;
    }}

    .overview-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 18px;
      margin-top: 20px;
    }}

    .overview-thumb {{
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    }}

    .overview-thumb:hover {{
      transform: translateY(-3px);
      border-color: var(--primary);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
    }}

    .overview-thumb.active {{
      border-color: var(--primary);
      background: rgba(56, 189, 248, 0.08);
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
    }}

    .overview-num {{
      font-size: 11px;
      color: var(--primary);
      font-weight: 800;
      margin-bottom: 6px;
      letter-spacing: 0.05em;
    }}

    .overview-title {{
      font-size: 13.5px;
      font-weight: 700;
      color: #fff;
      line-height: 1.4;
    }}

    /* 印刷 (PDF生成) スタイル */
    @media print {{
      @page {{
        size: 16in 9in;
        margin: 0;
      }}

      body {{
        background: #060913 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        display: block !important;
        overflow: visible !important;
        width: auto !important;
        height: auto !important;
      }}

      #deck-controls, #speaker-notes-drawer, #overview-overlay {{
        display: none !important;
      }}

      #presentation-viewport {{
        box-shadow: none !important;
        border: none !important;
        width: 100% !important;
        height: auto !important;
        transform: none !important;
        border-radius: 0 !important;
      }}

      .slide {{
        position: relative !important;
        page-break-after: always !important;
        page-break-inside: avoid !important;
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        width: 16in !important;
        height: 9in !important;
        padding: 50px 70px !important;
        box-sizing: border-box !important;
        display: flex !important;
      }}

      .slide.active {{
        display: flex !important;
      }}

      .device-mockup {{
        box-shadow: none !important;
      }}
    }}
  </style>
</head>
<body>

  <!-- プレゼンテーション本体 -->
  <div id="presentation-viewport">

    <!-- ==================== SLIDE 1 ==================== -->
    <div class="slide active" data-slide="1">
      <div class="hero-slide">
        <div class="hero-badge">
          <span>⚡ 次世代 Progressive Web App (PWA)</span>
        </div>
        <h1 class="hero-title">
          <span class="gradient-text">QR Master Studio</span>
        </h1>
        <div class="hero-sub">
          ミリ秒デコード × 露出最適化 × 詐欺防止安全診断
        </div>
        <p class="hero-desc">
          ブラウザだけで動く最新のWeb標準APIとGPUハードウェア加速。<br>
          白飛び・暗所・フィッシング詐欺の課題を根底から解決する、次世代QRコードプラットフォーム。
        </p>
        <div class="hero-pills">
          <div class="hero-pill">⚡ 0秒起動 ＆ 完全オフライン動作</div>
          <div class="hero-pill">☀️ 自動露出補正 (Auto-EV) ＆ 暗所自動点灯</div>
          <div class="hero-pill">🛡️ 8項目URL安全性スコア診断</div>
          <div class="hero-pill">📥 文字化けゼロ BOM付きCSV出力</div>
        </div>
        <div style="font-size: 13px; color: var(--text-muted);">
          キーボードの [→] または [スペース] でスライドを進めます ｜ [S] で発表台本表示
        </div>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 1】表紙 (Title Slide)</h4>
        <p>「みなさん、QRコードを読み取る際に、暗くてピントが合わなかったり、PC画面のギラつきで白飛びして読み取れなかった経験はありませんか？さらに最近では、悪質なサイトへ誘導するQRコード詐欺（QRishing）も急増しています。」</p>
        <p>「本日ご紹介する『QR Master Studio』は、ブラウザだけで動く最新のPWA技術とGPUハードウェア加速、そしてリアルタイムの安全診断を融合させた、まったく新しいQRコードツールです。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 2 ==================== -->
    <div class="slide" data-slide="2">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">BACKGROUND & CHALLENGES</span>
          <h2 class="slide-title">現代のQRコード利用における<span class="gradient-text">3大課題</span></h2>
          <p class="slide-subtitle">日常業務や生活のあらゆる場面で直面するストレスとセキュリティリスク</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon amber">☀️</div>
            <div class="feature-content">
              <h4>1. 白飛び・液晶画面の反射による読取失敗</h4>
              <p>直射日光やPCモニタ・タブレットの強いバックライトが反射し、コントラストが低下。カメラをいくら近づけても認識しないストレス。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon amber">⚠️</div>
            <div class="feature-content">
              <h4>2. 巧妙化するQRコード詐欺（QRishing）</h4>
              <p>悪質な短縮URLやフィッシング詐欺サイトへの誘導が急増。印刷されたQRコードの行き先が見た目では判別できず、無防備に開いてしまうリスク。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon amber">📶</div>
            <div class="feature-content">
              <h4>3. アプリインストールの手間 ＆ オフライン停止</h4>
              <p>専用アプリのダウンロードが億劫。電波の届かない地下街、倉庫、機内など通信圏外ではアプリが起動すらしない不便さ。</p>
            </div>
          </div>
        </div>
        <div class="card">
          <h4 style="font-size: 15px; color: var(--accent-amber); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>📊 従来アプリの現状</span>
          </h4>
          <p style="font-size: 13px; color: var(--text-sub); line-height: 1.6; margin-bottom: 16px;">
            従来の多くの無料QRアプリは、起動時に全画面広告が挟まり、カメラ撮影したURLをノーチェックで開いてしまいます。また露光調整機能がないため、光の強い現場では無力でした。
          </p>
          <div style="background: rgba(245, 158, 11, 0.08); border-left: 3px solid var(--accent-amber); padding: 10px 14px; border-radius: 4px; font-size: 12px; color: #fbbf24;">
            <strong>現場の声:</strong> 「倉庫のバーコードやPC画面のQRが読めず、作業が止まる」「不審なURLを開かないか不安」
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 02 / 10</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 2】背景と課題</h4>
        <p>「QRコードは生活やビジネスに欠かせないインフラになりましたが、現場では依然として多くの課題が存在します。直射日光やPC画面の白飛び、暗所での読取失敗。そして何より、印刷されたQRコードの先に何があるか分からないというセキュリティの不安です。通信が不安定な場所で広告に邪魔されて動かないアプリも少なくありません。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 3 ==================== -->
    <div class="slide" data-slide="3">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">SOLUTION & INNOVATION</span>
          <h2 class="slide-title">課題を解決する<span class="gradient-text">3大コア・イノベーション</span></h2>
          <p class="slide-subtitle">最先端Webテクノロジーが可能にした圧倒的な読取体験</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon green">⚡</div>
            <div class="feature-content">
              <h4>GPU加速ハイブリッド・デュアルエンジン</h4>
              <p>ブラウザ標準 `BarcodeDetector API` によるGPU直結ミリ秒デコードと、陰影に強い大津適応二値化 `jsQR` の最強タッグ。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">☀️</div>
            <div class="feature-content">
              <h4>自動露出最適化 (Auto-EV) ＆ 暗所自動点灯</h4>
              <p>カメラ中心フレームの輝度をミリ秒解析。`-2.0EV` 〜 `+2.0EV` の物理露光調整と、暗所でのバックライト自動点灯を完備。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🛡️</div>
            <div class="feature-content">
              <h4>8項目安全性診断 ＆ 100点未満警告ゲート</h4>
              <p>URLの暗号化や偽装文字を8軸で自動診断。安全スコア完全100点満点以外のURLは、直前の警告確認モーダルで誤アクセスを絶対防止。</p>
            </div>
          </div>
        </div>
        <div class="card">
          <h4 style="font-size: 15px; color: var(--primary); margin-bottom: 12px;">🏆 従来アプリとの徹底比較</h4>
          <table class="compare-table">
            <thead>
              <tr>
                <th>項目</th>
                <th>従来アプリ</th>
                <th>本アプリ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>起動速度</td>
                <td>広告で数秒</td>
                <td class="highlight">0秒 (即時)</td>
              </tr>
              <tr>
                <td>白飛び補正</td>
                <td>不可</td>
                <td class="highlight">自動EV補正</td>
              </tr>
              <tr>
                <td>暗所対策</td>
                <td>手動ライト</td>
                <td class="highlight">自動点灯+二値化</td>
              </tr>
              <tr>
                <td>詐欺防止</td>
                <td>無防備</td>
                <td class="highlight">8項目安全診断</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 03 / 10</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 3】ソリューション</h4>
        <p>「この課題をすべて解決するのが QR Master Studio です。ハードウェア加速と独自アルゴリズムを組み合わせ、環境光に左右されず瞬時に読み取ります。さらに、読み取った瞬間にURLの安全性を8項目で診断し、危険なサイトへの誤アクセスを完全にブロックします。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 4 ==================== -->
    <div class="slide" data-slide="4">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">USER EXPERIENCE</span>
          <h2 class="slide-title">親指1本で完結する<span class="gradient-text">洗練されたモバイルUI</span></h2>
          <p class="slide-subtitle">押しやすい2段ナビゲーションと、カード上部の即時起動ボタン</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon green">🎯</div>
            <div class="feature-content">
              <h4>スキャンカード最上部に起動ボタンを配置</h4>
              <p>アプリを開いて最初の視線が届く最上部に、特大の緑色「QRスキャナーを起動」ボタンを常設。迷わず1タップでスキャン開始。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-content">
              <h4>押しやすい2段グリッドナビゲーション</h4>
              <p>上段に【QRスキャナー】【ファイル読み込み】のメイン読取系、下段に【QR作成】【履歴】【取説】を整然と配置。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🚀</div>
            <div class="feature-content">
              <h4>迷わせない4ステップ・ワークフロー</h4>
              <p>「起動」→「スキャン」→「8項目安全診断」→ 水色の「URLを開く」ボタンで目的のページへ安全にジャンプ。</p>
            </div>
          </div>
        </div>
        <div class="screenshot-frame">
          <div class="device-mockup">
            <img src="{img_scanner}" alt="QRスキャナー待機画面">
          </div>
          <div class="mockup-caption">▲ 実機画面: QRスキャナー待機画面</div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 04 / 10</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 4】直感的なUI</h4>
        <p>「操作性にも徹底的にこだわりました。スマホの片手操作でも押しやすいよう、ナビゲーションを2段の特大グリッドボタンに整理。アプリを起動すると『QRスキャナー』が選択された状態になっており、カード上部の大きな緑ボタンを押せば即座にカメラが起動します。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 5 ==================== -->
    <div class="slide" data-slide="5">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">ENGINE ARCHITECTURE</span>
          <h2 class="slide-title">驚異の読取性能<span class="gradient-text">GPU加速 ＆ 大津適応二値化</span></h2>
          <p class="slide-subtitle">ミリ秒解読のプライマリと、難読化を復元するセカンダリの二重構造</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div class="feature-content">
              <h4>プライマリ: Web BarcodeDetector API</h4>
              <p>ブラウザ標準のハードウェアアクセラレーションを利用し、GPU直結でミリ秒単位の超高速・低負荷スキャンを実現。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon green">🧬</div>
            <div class="feature-content">
              <h4>セカンダリ: 大津の適応二値化 ＋ jsQR</h4>
              <p>斜めからの撮影や手ブレ、陰影でコントラストが失われた場合、統計的手法で明暗境界を再計算し強力にリカバリー。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🖼️</div>
            <div class="feature-content">
              <h4>写真アルバム・D&D・クリップボード貼付</h4>
              <p>カメラ撮影だけでなく、端末内の画像ファイル、PCからのドラッグ＆ドロップ、`Ctrl + V` 画像貼り付けも即座に解析。</p>
            </div>
          </div>
        </div>
        <div class="screenshot-frame">
          <div class="device-mockup">
            <img src="{img_file}" alt="ファイル読み込み画面">
          </div>
          <div class="mockup-caption">▲ 実機画面: ファイル読み込み画面</div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 05 / 10</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 5】驚異の読取性能</h4>
        <p>「心臓部には2つの高性能エンジンを搭載しています。まずはブラウザのGPU直結APIでミリ秒デコード。もしピントが甘かったり影が落ちている場合は、画像処理の大津の二値化アルゴリズムを介してjsQRが瞬時にリカバリーします。端末内の画像やスクリーンショットも瞬時に解読可能です。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 6 ==================== -->
    <div class="slide" data-slide="6">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">PROPRIETARY TECH</span>
          <h2 class="slide-title">独自技術<span class="gradient-text">自動露出補正 ＆ 暗所自動点灯</span></h2>
          <p class="slide-subtitle">白飛び・液晶反射・暗がりを克服する環境光適応システム</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">☀️</div>
            <div class="feature-content">
              <h4>ミリ秒単位のリアルタイム中心輝度計測</h4>
              <p>カメラ中心フレームの明度（0〜255）を動的にサンプリング。液晶画面の白飛びや暗闇を瞬時に察知。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon green">💡</div>
            <div class="feature-content">
              <h4>暗所でのバックライト（トーチ）自動点灯</h4>
              <p>周囲が暗い場合、背面のLEDトーチを自動で点灯。手動切り替えボタンもコンパクトに常備し、快適な夜間スキャンを保証。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon amber">🎛️</div>
            <div class="feature-content">
              <h4>物理露光 EV値コントロール ＆ 4大プリセット</h4>
              <p>白飛び時は `-2.0 EV` まで自動減光。「標準」「暗く(液晶画面用)」「明るく」「ハイコントラスト」のワンタップ切替も可能。</p>
            </div>
          </div>
        </div>
        <div class="card">
          <h4 style="font-size: 15px; color: var(--primary); margin-bottom: 12px;">🔬 露出補正のビフォー・アフター</h4>
          <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
            <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 12px 14px; border-radius: 6px;">
              <strong style="color: #f87171;">❌ 従来（補正なし）:</strong><br>
              PCモニタの白飛びによりQRコードの境界が消失し、何度カメラをかざしても認識しない。
            </div>
            <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; padding: 12px 14px; border-radius: 6px;">
              <strong style="color: #34d399;">⭕ 本アプリ (Auto-EV ＆ バックライト):</strong><br>
              強い光量を即座に減光、暗がりではトーチが自動点灯。常に最適なコントラストで一発解読。
            </div>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 06 / 10</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 6】露出最適化</h4>
        <p>「PCやスマートフォンの画面に表示されたQRコードを読み取ろうとして、白飛びして苦労したことはありませんか？本アプリの独自機能『Auto Exposure System』は、中心部の明るさをリアルタイムで監視し、自動で光量を絞り込みます。液晶画面の強いバックライトも一瞬で適正露出に補正されます。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 7 ==================== -->
    <div class="slide" data-slide="7">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">CYBER SECURITY</span>
          <h2 class="slide-title">鉄壁のセキュリティ<span class="gradient-text">8項目安全診断 ＆ 警告ゲート</span></h2>
          <p class="slide-subtitle">危険サイトやフィッシング詐欺からユーザーを未然に守る多層防御</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon purple">🛡️</div>
            <div class="feature-content">
              <h4>多層 8軸セキュリティチェック</h4>
              <p>① HTTPS通信の有無 ② IPアドレス直打ち ③ Punycode偽装文字 ④ 高リスクTLD ⑤ 危険な実行ファイル拡張子 ⑥ フィッシングキーワード ⑦ 多重サブドメイン ⑧ メジャードメイン合致。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon amber">⚠️</div>
            <div class="feature-content">
              <h4>安全スコア 100点満点以外の警告確認ゲート</h4>
              <p>少しでもリスク要因があるURLを開く場合、直前に「アクセス確認警告モーダル」が起動。誤タップによる被害を物理的に遮断。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon green">🔍</div>
            <div class="feature-content">
              <h4>Google Safe Browsing 照会連携</h4>
              <p>不審なURLはモーダル内からワンタップで Google の公式セキュリティデータベースに照会可能。</p>
            </div>
          </div>
        </div>
        <div class="screenshot-frame">
          <div class="device-mockup">
            <img src="{img_result}" alt="スキャン結果・安全スコア画面">
          </div>
          <div class="mockup-caption">▲ 実機画面: 安全スコア100点と「URLを開く」</div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 07 / 10</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 7】鉄壁のセキュリティ</h4>
        <p>「セキュリティも最高水準です。URLがスキャンされると、8つのチェック項目から安全スコアを瞬時に算出します。重要なのは、安全スコアが『完全100点満点』以外のURLを開く際には、必ず直前に警告確認モーダルが割り込む設計になっている点です。誤タップによるウイルス感染や詐欺サイト誘導を確実に防ぎます。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 8 ==================== -->
    <div class="slide" data-slide="8">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">ENTERPRISE UTILITY</span>
          <h2 class="slide-title">業務効率を高める<span class="gradient-text">履歴管理 ＆ CSV/JSON出力</span></h2>
          <p class="slide-subtitle">スキャン結果を現場の資産に変える、メモ保存とExcel完全対応エクスポート</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon green">📥</div>
            <div class="feature-content">
              <h4>UTF-8 BOM付き CSV エクスポート</h4>
              <p>Windows / Mac の Excel、Google スプレッドシートで直接ダブルクリックしても日本語が一切文字化けしない完全仕様。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📝</div>
            <div class="feature-content">
              <h4>スキャン毎のタイトル・現場メモ編集</h4>
              <p>「第2倉庫 機材番号4」「来場者A様」など、スキャン直後に自由なメモを即座に記録・永続保存。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🎨</div>
            <div class="feature-content">
              <h4>自由なQR作成 ＆ スタイリング機能</h4>
              <p>URL、Wi-Fi設定、自由テキストを綺麗なカラー指定や高解像度PNGで作成・ダウンロード可能。</p>
            </div>
          </div>
        </div>
        <div class="screenshot-frame">
          <div class="device-mockup">
            <img src="{img_history}" alt="履歴管理画面">
          </div>
          <div class="mockup-caption">▲ 実機画面: 履歴管理とエクスポート</div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 08 / 10</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 8】業務機能</h4>
        <p>「スキャンしたデータを業務で活かすための機能も満載です。履歴にはその場でメモやタイトルを記録でき、秒単位で日時が残ります。さらに『CSV出力』ボタンを押せば、Excelで開いても絶対に文字化けしないBOM付きCSVが即座に手に入ります。棚卸しや機器管理、来場者受付などの現場業務にそのまま活用できます。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 9 ==================== -->
    <div class="slide" data-slide="9">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">PWA PERFORMANCE</span>
          <h2 class="slide-title">ネイティブを超える快適性<span class="gradient-text">0秒起動 ＆ 完全オフライン</span></h2>
          <p class="slide-subtitle">Service Workerによるスマートキャッシュと、脱Webview連携</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon green">⚡</div>
            <div class="feature-content">
              <h4>PWAワンタップインストール</h4>
              <p>ヘッダーの「ホーム画面に追加」からインストール可能。アドレスバーのないフルスクリーンで起動し、公式アプリ同等の操作感。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">✈️</div>
            <div class="feature-content">
              <h4>完全オフライン稼働</h4>
              <p>電波の届かない地下施設、コンテナ倉庫、機内モードでも0秒で高速起動し、全スキャン・生成機能が動作。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🔔</div>
            <div class="feature-content">
              <h4>更新自動検知 ＆ LINEブラウザ脱出</h4>
              <p>新機能配信時はトーストで即時通知。LINEアプリ内ブラウザで開かれた際もワンタップで外部ブラウザへ安全脱出。</p>
            </div>
          </div>
        </div>
        <div class="screenshot-frame">
          <div class="device-mockup">
            <img src="{img_manual}" alt="取扱説明書画面">
          </div>
          <div class="mockup-caption">▲ 実機画面: 取扱説明書とPWA機能</div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 09 / 10</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 9】PWA技術</h4>
        <p>「PWA技術を最大限に活用しているため、App StoreやGoogle Playからのダウンロードは不要。ヘッダーのボタンからワンタップでホーム画面に追加できます。Service Workerのおかげで、電波の一切届かない地下や倉庫でも0秒で起動。新機能がリリースされた際も、トースト通知からワンタップで最新版へリロードされます。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 10 ==================== -->
    <div class="slide" data-slide="10">
      <div class="hero-slide">
        <div class="hero-badge">
          <span>🎯 SUMMARY & ACCESS</span>
        </div>
        <h2 class="hero-title" style="font-size: 44px; margin-bottom: 16px;">
          これからのQR体験を、あなたの手に。<br>
          <span class="gradient-text">QR Master Studio</span>
        </h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; max-width: 960px; margin-bottom: 24px;">
          <div class="card" style="text-align: left;">
            <div style="font-size: 24px; margin-bottom: 6px;">⚡</div>
            <h4 style="font-size: 15px; color: #fff; margin-bottom: 4px;">圧倒的に速い</h4>
            <p style="font-size: 12.5px; color: var(--text-sub);">GPU加速 × 自動露出補正 × バックライトで、どんな環境でも瞬時に読み取り完了。</p>
          </div>
          <div class="card" style="text-align: left;">
            <div style="font-size: 24px; margin-bottom: 6px;">🛡️</div>
            <h4 style="font-size: 15px; color: var(--accent-green); margin-bottom: 4px;">最高峰の安心</h4>
            <p style="font-size: 12.5px; color: var(--text-sub);">8項目セキュリティ診断と警告確認ゲートで、QR詐欺や危険サイトを徹底ブロック。</p>
          </div>
          <div class="card" style="text-align: left;">
            <div style="font-size: 24px; margin-bottom: 6px;">💼</div>
            <h4 style="font-size: 15px; color: var(--primary); margin-bottom: 4px;">現場で使える</h4>
            <p style="font-size: 12.5px; color: var(--text-sub);">文字化けしないCSV出力、オフライン稼働、取扱説明書内蔵で誰でも直感的に運用可能。</p>
          </div>
        </div>
        <div style="font-size: 13.5px; color: var(--primary); font-weight: 700; letter-spacing: 0.05em; background: rgba(56, 189, 248, 0.1); padding: 8px 26px; border-radius: 9999px; border: 1px solid rgba(56, 189, 248, 0.3);">
          🌐 今すぐアクセス: https://k3and4ai-sudo.github.io/qr-scanner-app/
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 10 / 10</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 10】まとめ</h4>
        <p>「速い、安全、そして便利。QR Master Studio は、従来のQRリーダーのストレスと危険をすべて解消した次世代のスタンダードツールです。登録不要、完全無料で今すぐお使いいただけます。ぜひ一度、お手元のスマートフォンでこの快適さを体験してください。ご清聴ありがとうございました。」</p>
      </div>
    </div>

  </div>

  <!-- フローティング・操作コントロールバー -->
  <div id="deck-controls">
    <button class="control-btn" id="btn-prev" title="前のスライド (← / PageUp)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <div class="progress-track">
      <div class="progress-fill" id="progress-fill"></div>
    </div>
    <span id="slide-indicator" style="font-size: 12px; font-weight: 700; min-width: 45px; text-align: center;">01 / 10</span>
    <button class="control-btn" id="btn-next" title="次のスライド (→ / Space / PageDown)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    </button>
    <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.2); margin: 0 4px;"></div>
    <button class="control-btn" id="btn-overview" title="スライド一覧 (O)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
    </button>
    <button class="control-btn" id="btn-notes" title="発表者ノート (S)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    </button>
    <button class="control-btn" id="btn-fullscreen" title="全画面表示 (F)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
    </button>
    <button class="control-btn" id="btn-print" title="PDF保存 / 印刷 (Ctrl+P)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
    </button>
  </div>

  <!-- スピーカーノート・ドロワー -->
  <div id="speaker-notes-drawer">
    <div class="notes-header">
      <div style="font-size: 15px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
        <span style="color: var(--primary);">🎙️</span> スピーカーノート (発表台本)
      </div>
      <button class="control-btn" id="btn-close-notes" style="padding: 4px;">✕</button>
    </div>
    <div class="notes-content" id="notes-content">
      <!-- 動的注入 -->
    </div>
    <div style="font-size: 11px; color: var(--text-muted); margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
      ショートカットキー: [S] ノート開閉 | [←][→] スライド移動
    </div>
  </div>

  <!-- スライド一覧オーバーレイ -->
  <div id="overview-overlay">
    <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; width: 100%;">
      <h3 style="font-size: 22px; font-weight: 800; color: #fff;">📋 スライド一覧</h3>
      <button class="control-btn" id="btn-close-overview" style="font-size: 18px; padding: 6px 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">✕ 閉じる (Esc)</button>
    </div>
    <div class="overview-grid" id="overview-grid" style="max-width: 1200px; margin: 20px auto 0 auto; width: 100%;">
      <!-- 動的生成 -->
    </div>
  </div>

  <script>
    (function() {{
      const slides = Array.from(document.querySelectorAll('.slide'));
      const totalSlides = slides.length;
      let currentIndex = 0;

      const viewport = document.getElementById('presentation-viewport');
      const progressFill = document.getElementById('progress-fill');
      const slideIndicator = document.getElementById('slide-indicator');
      const notesDrawer = document.getElementById('speaker-notes-drawer');
      const notesContent = document.getElementById('notes-content');
      const overviewOverlay = document.getElementById('overview-overlay');
      const overviewGrid = document.getElementById('overview-grid');

      // URLハッシュやクエリパラメータから初期スライド取得
      function getInitialSlide() {{
        const hashMatch = window.location.hash.match(/#(\\d+)/);
        if (hashMatch) {{
          return parseInt(hashMatch[1], 10) - 1;
        }}
        const urlParams = new URLSearchParams(window.location.search);
        const slideParam = urlParams.get('slide');
        if (slideParam) {{
          return parseInt(slideParam, 10) - 1;
        }}
        return 0;
      }}

      // スケーリング計算（16:9 比率を維持してビューポートに最大化）
      function adjustScale() {{
        const baseWidth = 1280;
        const baseHeight = 720;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const scaleX = (windowWidth - 30) / baseWidth;
        const scaleY = (windowHeight - 30) / baseHeight;
        const scale = Math.min(scaleX, scaleY, 1.3);

        viewport.style.transform = `scale(${{scale}})`;
      }}

      window.addEventListener('resize', adjustScale);
      adjustScale();

      // スライド表示切り替え
      function goToSlide(index, updateHash = true) {{
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;

        currentIndex = index;

        slides.forEach((slide, idx) => {{
          if (idx === currentIndex) {{
            slide.classList.add('active');
          }} else {{
            slide.classList.remove('active');
          }}
        }});

        if (updateHash) {{
          window.location.hash = `#${{currentIndex + 1}}`;
        }}

        // 進捗バーとインジケーター更新
        const progressPercent = ((currentIndex + 1) / totalSlides) * 100;
        progressFill.style.width = progressPercent + '%';
        slideIndicator.textContent = `${{String(currentIndex + 1).padStart(2, '0')}} / ${{String(totalSlides).padStart(2, '0')}}`;

        // ノート更新
        updateNotes();

        // オーバーレイのアクティブ更新
        const thumbs = overviewGrid.querySelectorAll('.overview-thumb');
        thumbs.forEach((thumb, idx) => {{
          if (idx === currentIndex) {{
            thumb.classList.add('active');
          }} else {{
            thumb.classList.remove('active');
          }}
        }});
      }}

      function updateNotes() {{
        const activeSlide = slides[currentIndex];
        const notes = activeSlide.querySelector('.speaker-notes');
        if (notes) {{
          notesContent.innerHTML = notes.innerHTML;
        }} else {{
          notesContent.innerHTML = '<p style="color: var(--text-muted);">スピーカーノートはありません。</p>';
        }}
      }}

      // スライド一覧のサムネイル生成
      function initOverview() {{
        overviewGrid.innerHTML = '';
        slides.forEach((slide, idx) => {{
          const thumb = document.createElement('div');
          thumb.className = 'overview-thumb' + (idx === currentIndex ? ' active' : '');
          
          let title = `Slide ${{idx + 1}}`;
          const titleEl = slide.querySelector('.slide-title') || slide.querySelector('.hero-title');
          if (titleEl) {{
            title = titleEl.innerText.replace(/\\n/g, ' ').substring(0, 36);
          }}

          thumb.innerHTML = `
            <div class="overview-num">SLIDE ${{String(idx + 1).padStart(2, '0')}}</div>
            <div class="overview-title">${{title}}</div>
          `;

          thumb.addEventListener('click', () => {{
            goToSlide(idx);
            overviewOverlay.classList.remove('open');
          }});

          overviewGrid.appendChild(thumb);
        }});
      }}

      initOverview();

      // ボタン操作
      document.getElementById('btn-prev').addEventListener('click', () => goToSlide(currentIndex - 1));
      document.getElementById('btn-next').addEventListener('click', () => goToSlide(currentIndex + 1));

      // スピーカーノート開閉
      const btnNotes = document.getElementById('btn-notes');
      const btnCloseNotes = document.getElementById('btn-close-notes');
      function toggleNotes() {{
        notesDrawer.classList.toggle('open');
      }}
      btnNotes.addEventListener('click', toggleNotes);
      btnCloseNotes.addEventListener('click', () => notesDrawer.classList.remove('open'));

      // スライド一覧開閉
      const btnOverview = document.getElementById('btn-overview');
      const btnCloseOverview = document.getElementById('btn-close-overview');
      function toggleOverview() {{
        overviewOverlay.classList.toggle('open');
      }}
      btnOverview.addEventListener('click', toggleOverview);
      btnCloseOverview.addEventListener('click', () => overviewOverlay.classList.remove('open'));

      // フルスクリーン切り替え
      const btnFullscreen = document.getElementById('btn-fullscreen');
      btnFullscreen.addEventListener('click', () => {{
        if (!document.fullscreenElement) {{
          document.documentElement.requestFullscreen().catch(() => {{}});
        }} else {{
          document.exitFullscreen().catch(() => {{}});
        }}
      }});

      // PDF印刷
      document.getElementById('btn-print').addEventListener('click', () => {{
        window.print();
      }});

      // キーボードナビゲーション
      window.addEventListener('keydown', (e) => {{
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key) {{
          case 'ArrowRight':
          case 'PageDown':
          case ' ':
            e.preventDefault();
            goToSlide(currentIndex + 1);
            break;
          case 'ArrowLeft':
          case 'PageUp':
            e.preventDefault();
            goToSlide(currentIndex - 1);
            break;
          case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
          case 'End':
            e.preventDefault();
            goToSlide(totalSlides - 1);
            break;
          case 's':
          case 'S':
            toggleNotes();
            break;
          case 'o':
          case 'O':
            toggleOverview();
            break;
          case 'f':
          case 'F':
            if (!document.fullscreenElement) {{
              document.documentElement.requestFullscreen().catch(() => {{}});
            }} else {{
              document.exitFullscreen().catch(() => {{}});
            }}
            break;
          case 'Escape':
            notesDrawer.classList.remove('open');
            overviewOverlay.classList.remove('open');
            break;
        }}
      }});

      // ハッシュ変更監視
      window.addEventListener('hashchange', () => {{
        const newIndex = getInitialSlide();
        if (newIndex !== currentIndex) {{
          goToSlide(newIndex, false);
        }}
      }});

      // 初期化
      goToSlide(getInitialSlide(), false);
    }})();
  </script>
</body>
</html>
"""
    with open(HTML_PATH, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Generated Interactive Presentation HTML: {HTML_PATH}")

def render_pdf_with_chrome():
    print("[PDF Render] Rendering PRESENTATION.pdf via Headless Chrome...")
    cmd = [
        "google-chrome",
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={PDF_PATH}",
        HTML_PATH
    ]
    subprocess.run(cmd, check=True)
    print(f"Generated Presentation PDF: {PDF_PATH}")

def sync_distribution():
    print("[Sync] Syncing PRESENTATION files to public/ and dist/ ...")
    os.makedirs(os.path.join(ROOT_DIR, "public"), exist_ok=True)
    os.makedirs(os.path.join(ROOT_DIR, "dist"), exist_ok=True)

    for fname in ["PRESENTATION.html", "PRESENTATION.pdf"]:
        src = os.path.join(ROOT_DIR, fname)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(ROOT_DIR, "public", fname))
            shutil.copy2(src, os.path.join(ROOT_DIR, "dist", fname))
    print("[Sync] Completed.")

if __name__ == "__main__":
    build_presentation_html()
    render_pdf_with_chrome()
    sync_distribution()
    print("All presentation artifacts generated successfully!")
