#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QR Master Studio - インタラクティブ・プレゼンテーションスライド生成スクリプト
全14スライド：QRスキャナー・露出補正・安全診断・ファイル読み込み・QR作成・履歴・取説・PWAを網羅
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
      padding: 38px 50px 30px 50px;
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
      margin-bottom: 18px;
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
      font-size: 27px;
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
      padding: 18px 22px;
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

    /* 表紙スライド */
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

    /* 比較テーブル */
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

    /* ナビゲーション紹介グリッド */
    .nav-grid-box {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }}

    .nav-grid-card {{
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      padding: 14px 16px;
    }}

    .nav-grid-card h4 {{
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }}

    .nav-grid-card p {{
      font-size: 12px;
      color: var(--text-sub);
      line-height: 1.45;
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
      width: 140px;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      overflow: hidden;
      margin: 0 6px;
    }}

    .progress-fill {{
      height: 100%;
      background: var(--primary-gradient);
      width: 7%;
      transition: width 0.3s ease;
    }}

    /* スピーカーノート・ドロワー */
    #speaker-notes-drawer {{
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      width: 400px;
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
      gap: 16px;
      margin-top: 20px;
    }}

    .overview-thumb {{
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px;
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
      margin-bottom: 5px;
      letter-spacing: 0.05em;
    }}

    .overview-title {{
      font-size: 13px;
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
          スキャン・ファイル読取・QR作成・履歴管理・マニュアルを一体化した、次世代QRコードプラットフォーム。
        </p>
        <div class="hero-pills">
          <div class="hero-pill">📷 カメラ瞬時スキャン</div>
          <div class="hero-pill">🖼️ 画像・スクショ読取</div>
          <div class="hero-pill">🎨 自由なQR作成</div>
          <div class="hero-pill">📥 文字化けゼロ CSV出力</div>
          <div class="hero-pill">📖 内蔵取扱説明書</div>
        </div>
        <div style="font-size: 13px; color: var(--text-muted);">
          キーボードの [→] または [スペース] でスライドを進めます ｜ [S] で発表台本表示 ｜ [O] でスライド一覧
        </div>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 1】表紙 (Title Slide)</h4>
        <p>「みなさん、こんにちは。本日はブラウザだけでミリ秒起動し、カメラ読み取りだけでなくファイル解析・QRコード生成・Excel連携・オフラインマニュアルまでを網羅した『QR Master Studio』の全貌をご紹介します。」</p>
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
              <h4>3. アプリインストールの手間 ＆ 機能の断片化</h4>
              <p>アプリのダウンロードが億劫、起動時に広告表示。さらに「読み取り」「ファイル解析」「QR作成」が別々のアプリに分かれている不便さ。</p>
            </div>
          </div>
        </div>
        <div class="card">
          <h4 style="font-size: 15px; color: var(--accent-amber); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>📊 従来アプリの現状</span>
          </h4>
          <p style="font-size: 13px; color: var(--text-sub); line-height: 1.6; margin-bottom: 16px;">
            従来の多くの無料QRアプリは、起動時に全画面広告が挟まり、カメラ撮影したURLをノーチェックで開いてしまいます。またファイル読み込みや履歴管理、QR生成がバラバラでした。
          </p>
          <div style="background: rgba(245, 158, 11, 0.08); border-left: 3px solid var(--accent-amber); padding: 10px 14px; border-radius: 4px; font-size: 12px; color: #fbbf24;">
            <strong>現場の声:</strong> 「スキャンだけでなく、画像のQRも読みたい」「履歴をCSVでExcelに出したい」「安全性を確認したい」
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 02 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 2】背景と課題</h4>
        <p>「QRコードは生活やビジネスに欠かせないインフラになりましたが、現場では依然として多くの課題が存在します。白飛びや暗所での読取失敗、QR詐欺のリスク、そして何よりスキャン・作成・履歴がバラバラで業務に活かせないという不満です。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 3 ==================== -->
    <div class="slide" data-slide="3">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">APP OVERVIEW</span>
          <h2 class="slide-title">全機能が1つに集約<span class="gradient-text">2段グリッドナビゲーション</span></h2>
          <p class="slide-subtitle">用途に合わせて迷わず使える、洗練された5大主要機能</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body full-width">
        <div class="nav-grid-box" style="grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div class="nav-grid-card" style="border-top: 3px solid #10b981;">
            <h4><span style="color:#10b981;">📷</span> QRスキャナー</h4>
            <p>カメラで即座にリアルタイム読み取り。自動露出補正(Auto-EV)、暗所でのバックライト自動点灯、8項目URL安全診断を搭載。</p>
          </div>
          <div class="nav-grid-card" style="border-top: 3px solid #38bdf8;">
            <h4><span style="color:#38bdf8;">🖼️</span> ファイル読み込み</h4>
            <p>端末の写真、PCからのドラッグ＆ドロップ、`Ctrl + V` 貼り付けに対応。大津の二値化で影やピンボケ画像も高精度復元。</p>
          </div>
          <div class="nav-grid-card" style="border-top: 3px solid #c084fc;">
            <h4><span style="color:#c084fc;">🎨</span> QR作成</h4>
            <p>URL、Wi-Fi接続、自由テキストからカスタムQRコードを瞬時生成。カラー変更、リアルタイムプレビュー、PNGダウンロード。</p>
          </div>
          <div class="nav-grid-card" style="border-top: 3px solid #f59e0b;">
            <h4><span style="color:#f59e0b;">📋</span> 履歴管理</h4>
            <p>スキャン結果を自動蓄積。タイトル・現場メモの編集、誤消去を防ぐゴミ箱復元、文字化けゼロBOM付きCSV/JSON出力。</p>
          </div>
          <div class="nav-grid-card" style="border-top: 3px solid #ec4899;">
            <h4><span style="color:#ec4899;">📖</span> 取扱説明書 (取説)</h4>
            <p>画面配置と完全一致の目次アンカージャンプ、スタンドアロンHTML閲覧、A4印刷用PDFダウンロード、トラブルシューティング。</p>
          </div>
          <div class="nav-grid-card" style="border-top: 3px solid #6366f1;">
            <h4><span style="color:#6366f1;">📲</span> ホーム画面追加 (PWA)</h4>
            <p>インストール不要でブラウザから即起動。Service Workerにより電波の届かない地下や機内でも完全オフライン動作。</p>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 03 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 3】全体構成</h4>
        <p>「アプリの画面上部には、親指で押しやすい2段のナビゲーションボタンが並んでいます。上段はメイン読取系の『QRスキャナー』と『ファイル読み込み』。下段は実務を支える『QR作成』『履歴』『取説』です。用途に応じてワンタップでスムーズに行き来できます。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 4 ==================== -->
    <div class="slide" data-slide="4">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">FEATURE 1: SCANNER</span>
          <h2 class="slide-title">【機能①】リアルタイム<span class="gradient-text">QRスキャナー</span></h2>
          <p class="slide-subtitle">最上部の特大起動ボタンと、GPU直結ミリ秒デコード</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon green">🎯</div>
            <div class="feature-content">
              <h4>最上部に配置された大きな「QRスキャナーを起動」ボタン</h4>
              <p>アプリ起動後、最初に視線が届くカード上部に配置。迷わず1タップでカメラプレビューが開始されます。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div class="feature-content">
              <h4>ブラウザ標準 BarcodeDetector API 搭載</h4>
              <p>スマートフォンのGPUハードウェアアクセラレーションを直接利用し、フレーム毎のミリ秒高速認識を実現。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🚀</div>
            <div class="feature-content">
              <h4>カメラ切り替え ＆ 手動バックライトトグル</h4>
              <p>複数カメラ（背面・超広角・インカメラ）のワンタップ切り替えと、右上のフローティングライトボタンを常設。</p>
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
        <span>Slide 04 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 4】QRスキャナー</h4>
        <p>「まずはメイン機能の『QRスキャナー』です。最新のUI改善により、カード最上部に特大の緑ボタンを配置。タップするとカメラが即座に起動し、Web BarcodeDetectorの圧倒的な速さでQRコードを瞬時にデコードします。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 5 ==================== -->
    <div class="slide" data-slide="5">
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
              <p>カメラ中心フレームの明度（0〜255）を毎秒動的にサンプリング。PC画面の強い光や暗所を瞬時に察知。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon green">💡</div>
            <div class="feature-content">
              <h4>暗所でのバックライト（トーチ）自動点灯</h4>
              <p>周囲が暗い場合、背面のLEDトーチを自動点灯。PC画面用にはホワイト発光フォールバックも完備。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon amber">🎛️</div>
            <div class="feature-content">
              <h4>物理露光 EV値コントロール ＆ 4大プリセット</h4>
              <p>白飛び時は `-2.0 EV` まで自動減光。「標準」「暗く(液晶画面用)」「明るく」「ハイコントラスト」もワンタップ切替。</p>
            </div>
          </div>
        </div>
        <div class="card">
          <h4 style="font-size: 15px; color: var(--primary); margin-bottom: 12px;">🔬 露出補正のビフォー・アフター</h4>
          <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12.5px;">
            <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 10px 12px; border-radius: 6px;">
              <strong style="color: #f87171;">❌ 従来（補正なし）:</strong><br>
              PCモニタの白飛びによりQRコードの境界が消失し、何度カメラをかざしても認識しない。
            </div>
            <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; padding: 10px 12px; border-radius: 6px;">
              <strong style="color: #34d399;">⭕ 本アプリ (Auto-EV ＆ バックライト):</strong><br>
              強い光量を即座に減光、暗がりではトーチが自動点灯。常に最適なコントラストで一発解読。
            </div>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 05 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 5】露出最適化</h4>
        <p>「PC画面やタブレットのQRコードを読み取ろうとして白飛びした経験はありませんか？本アプリのAuto Exposure機能は、光量をリアルタイムで絞り込みます。さらに夜間や暗所ではスマホのトーチが自動で点灯し、快適なスキャン環境を自動生成します。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 6 ==================== -->
    <div class="slide" data-slide="6">
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
        <span>Slide 06 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 6】安全診断</h4>
        <p>「読み取った瞬間に8項目でURLを安全性診断します。ポイントは、安全スコアが完全100点満点以外のすべてのURLに対して、直前警告確認モーダルが起動する点です。誤タップによる危険サイトへのアクセスを確実に防ぎます。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 7 ==================== -->
    <div class="slide" data-slide="7">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">FEATURE 2: FILE SCANNER</span>
          <h2 class="slide-title">【機能②】画像・スクショ即時解析<span class="gradient-text">ファイル読み込み</span></h2>
          <p class="slide-subtitle">端末内の保存画像、D&D、クリップボード貼り付けを瞬時解読</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon green">📁</div>
            <div class="feature-content">
              <h4>多彩な3大インポート方式</h4>
              <p>①「画像ファイルを選択」で写真アルバムから選択、② PCからのドラッグ＆ドロップ、③ `Ctrl + V` クリップボード画像貼り付け。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🧬</div>
            <div class="feature-content">
              <h4>大津の適応二値化（Otsu Thresholding）搭載</h4>
              <p>影が落ちていたり、薄暗い写真、解像度の低いスクリーンショットでも、統計的二値化処理で明暗境界を復元し確実にデコード。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🔄</div>
            <div class="feature-content">
              <h4>即座に安全診断 ＆ 履歴保存</h4>
              <p>ファイルから読み取った結果も、カメラ同様に8項目安全診断と履歴への自動追加が行われます。</p>
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
        <span>Slide 07 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 7】ファイル読み込み</h4>
        <p>「2つ目の機能は『ファイル読み込み』です。カメラを向けられない場面でも、スマホに保存されたスクショやLINEで送られてきた画像をワンタップで読み取れます。PCではCtrl+Vで画像を貼り付けるだけで即座にデコードされます。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 8 ==================== -->
    <div class="slide" data-slide="8">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">FEATURE 3: QR GENERATOR</span>
          <h2 class="slide-title">【機能③】自由なQR生成<span class="gradient-text">QR作成</span></h2>
          <p class="slide-subtitle">URL・Wi-Fi・自由テキストを美麗にスタイリング ＆ 高解像度保存</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon purple">🎨</div>
            <div class="feature-content">
              <h4>3大コンテンツタイプ対応</h4>
              <p>Webサイトへの誘導（URL）、来客用やオフィスの自動接続用（Wi-Fi SSID/パスワード）、自由なテキストやメモのQR化。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon green">✨</div>
            <div class="feature-content">
              <h4>カラーカスタマイズ ＆ リアルタイムプレビュー</h4>
              <p>前景色（QRコードの色）と背景色をカラーピッカーで自由指定。入力と同時にプレビューがリアルタイムに更新。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📥</div>
            <div class="feature-content">
              <h4>ワンクリック高解像度 PNG ダウンロード</h4>
              <p>印刷やプレゼン資料、ポスターにそのまま貼り付けられる高品質な PNG 画像としてワンタップで端末に保存。</p>
            </div>
          </div>
        </div>
        <div class="screenshot-frame">
          <div class="device-mockup">
            <img src="{img_gen}" alt="QR作成画面">
          </div>
          <div class="mockup-caption">▲ 実機画面: QR作成画面</div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 08 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 8】QR作成</h4>
        <p>「3つ目の主要機能は『QR作成』です。読み取りだけでなく発行まで本アプリ1つで完結します。URLやWi-Fi情報を入力し、ブランドカラーに合わせて配色を変更、高精細なPNG画像として即座にダウンロード可能です。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 9 ==================== -->
    <div class="slide" data-slide="9">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">FEATURE 4: SCAN HISTORY</span>
          <h2 class="slide-title">【機能④】現場の資産に変える<span class="gradient-text">履歴管理</span></h2>
          <p class="slide-subtitle">メモのインライン編集・安全スコア別バッジ・誤消去を防ぐゴミ箱機能</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon green">📝</div>
            <div class="feature-content">
              <h4>タイトル ＆ 現場メモのインライン編集</h4>
              <p>「第2倉庫 サーバー機材」「来場者A様 名刺」など、スキャン直後に自由なタイトルとメモを即座に記録・永続保存。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🛡️</div>
            <div class="feature-content">
              <h4>安全スコア別カラーバッジ ＆ 日時記録</h4>
              <p>各スキャンの安全スコア（100点/満点未満）がひと目で判別可能。秒単位のタイムスタンプを自動保持。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon amber">🗑️</div>
            <div class="feature-content">
              <h4>安心のゴミ箱機能（一時退避・復元対応）</h4>
              <p>削除したスキャンはゴミ箱タブへ一時退避。誤って消去した場合も個別復元や一括クリアが可能。</p>
            </div>
          </div>
        </div>
        <div class="screenshot-frame">
          <div class="device-mockup">
            <img src="{img_history}" alt="履歴管理画面">
          </div>
          <div class="mockup-caption">▲ 実機画面: 履歴管理画面</div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 09 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 9】履歴管理</h4>
        <p>「4つ目の機能は『履歴管理』です。スキャンした結果は時系列で自動保存され、その場でメモやタイトルを追記できます。誤って削除してもゴミ箱から復元できるため、大切な業務データを失う心配がありません。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 10 ==================== -->
    <div class="slide" data-slide="10">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">DATA EXPORT</span>
          <h2 class="slide-title">業務直結<span class="gradient-text">文字化けゼロ BOM付きCSV ＆ JSON</span></h2>
          <p class="slide-subtitle">Excel / スプレッドシートへワンクリック出力。棚卸しや受付業務に即投入可能</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon green">📥</div>
            <div class="feature-content">
              <h4>UTF-8 BOM (`\\uFEFF`) 付き CSV 出力</h4>
              <p>Windows / Mac 版 Microsoft Excel や Google スプレッドシートで直接ダブルクリックして開いても、日本語メモやタイトルが一切文字化けしない完全仕様。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚙️</div>
            <div class="feature-content">
              <h4>構造化 JSON エクスポート</h4>
              <p>Wi-Fi設定や名刺の解析メタデータ（`parsedData`）、安全スコア、リスク要因を含むJSONを出力し、外部基幹システムやデータベースへ連携可能。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">📊</div>
            <div class="feature-content">
              <h4>棚卸し・設備点検・来場者受付に最適</h4>
              <p>機器シリアル番号の読み取りや参加者受付リストをCSV出力し、そのまま日報や管理表に貼り付け可能。</p>
            </div>
          </div>
        </div>
        <div class="card">
          <h4 style="font-size: 15px; color: var(--primary); margin-bottom: 12px;">📋 CSV出力データ構造</h4>
          <table class="compare-table">
            <thead>
              <tr>
                <th>列名</th>
                <th>データ例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ID / 日時</td>
                <td>2026-10-16 14:00:15</td>
              </tr>
              <tr>
                <td>タイトル</td>
                <td>第2倉庫 ネットワーク機器</td>
              </tr>
              <tr>
                <td>スキャン内容</td>
                <td>https://internal.company.local/...</td>
              </tr>
              <tr>
                <td>安全スコア</td>
                <td>100点 (安全)</td>
              </tr>
              <tr>
                <td>メモ</td>
                <td>ラックA-03、定期点検済み</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 10 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 10】CSV・JSONエクスポート</h4>
        <p>「履歴機能の最大の強みがこのエクスポートです。『CSV出力』を押せば、Excelで開いても絶対に文字化けしないBOM付きCSVが即座に手に入ります。棚卸しや点検、イベント受付の現場業務でそのまま活用できます。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 11 ==================== -->
    <div class="slide" data-slide="11">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">FEATURE 5: USER MANUAL</span>
          <h2 class="slide-title">【機能⑤】迷わせない<span class="gradient-text">取扱説明書 (取説)</span></h2>
          <p class="slide-subtitle">UI完全連動の目次ジャンプ・スタンドアロンHTML・A4印刷用PDFダウンロード</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body">
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon green">📖</div>
            <div class="feature-content">
              <h4>アプリ内蔵の目次アンカージャンプ</h4>
              <p>アプリ上部のボタン名と完全に一致した目次テーブルから、知りたい機能へワンタップでスムーズにスクロール。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📑</div>
            <div class="feature-content">
              <h4>画像インライン埋め込みスタンドアロン HTML</h4>
              <p>画面キャプチャ全6枚をBase64埋め込み。単独ファイルとして配布してもリンク切れが一切起きないマニュアルを提供。</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🖨️</div>
            <div class="feature-content">
              <h4>A4印刷対応 高品質 PDF ダウンロード</h4>
              <p>社内配布や現場マニュアルとして印刷できる全14ページの公式PDFをワンクリックでダウンロード。</p>
            </div>
          </div>
        </div>
        <div class="screenshot-frame">
          <div class="device-mockup">
            <img src="{img_manual}" alt="取扱説明書画面">
          </div>
          <div class="mockup-caption">▲ 実機画面: 取扱説明書画面</div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 11 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 11】取扱説明書</h4>
        <p>「5つ目の機能は『取説』です。操作に迷ったときもアプリ内ですぐにマニュアルを確認できます。さらにスタンドアロンのHTMLや全14ページの印刷用PDFもダウンロードでき、組織内での導入教育にも最適です。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 12 ==================== -->
    <div class="slide" data-slide="12">
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
              <p>電波の届かない地下施設、コンテナ倉庫、機内モードでも0秒で高速起動し、全スキャン・生成・取説機能が動作。</p>
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
        <div class="card">
          <h4 style="font-size: 15px; color: var(--primary); margin-bottom: 12px;">📱 PWAのメリット</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12.5px; color: var(--text-sub);">
            <div>✔ アプリストアのダウンロード待ち・審査待ちが不要</div>
            <div>✔ 余計な権限要求なし、プライバシーを厳格保護</div>
            <div>✔ 端末ストレージをほぼ圧迫しない超軽量設計（約1MB）</div>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 12 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 12】PWA技術</h4>
        <p>「PWA技術を活用しているため、アプリストアからのダウンロードは不要。ホーム画面に追加すれば0秒で起動し、地下や機内など圏外でも全機能が完全に動作します。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 13 ==================== -->
    <div class="slide" data-slide="13">
      <div class="slide-header">
        <div class="header-left">
          <span class="slide-badge">COMPREHENSIVE MATRIX</span>
          <h2 class="slide-title">従来アプリ vs QR Master Studio<span class="gradient-text">徹底比較</span></h2>
          <p class="slide-subtitle">圧倒的な機能網羅性と現場最適化の実績</p>
        </div>
        <div class="header-logo">QR Master Studio</div>
      </div>
      <div class="slide-body full-width">
        <div class="card" style="padding: 14px 20px;">
          <table class="compare-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th>評価項目</th>
                <th>一般的な無料QRリーダー</th>
                <th>標準カメラ機能</th>
                <th>⚡ QR Master Studio (本アプリ)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>起動速度・広告</strong></td>
                <td>全画面広告で数秒待たされる</td>
                <td>標準起動</td>
                <td class="highlight">0秒即時起動（広告ゼロ・PWA）</td>
              </tr>
              <tr>
                <td><strong>白飛び・液晶反射対策</strong></td>
                <td>❌ 読取不可</td>
                <td>△ 露出補正が難しい</td>
                <td class="highlight">⭕ 自動露出最適化 (Auto-EV -2.0〜+2.0)</td>
              </tr>
              <tr>
                <td><strong>暗所・夜間スキャン</strong></td>
                <td>△ 手動ライト点灯が必要</td>
                <td>△ ノイズに弱い</td>
                <td class="highlight">⭕ バックライト自動点灯 ＆ 大津二値化</td>
              </tr>
              <tr>
                <td><strong>詐欺・フィッシング防止</strong></td>
                <td>❌ 直接開いてしまう</td>
                <td>❌ 直接開く</td>
                <td class="highlight">⭕ 8項目安全診断 ＆ 100点未満警告ゲート</td>
              </tr>
              <tr>
                <td><strong>ファイル読み込み</strong></td>
                <td>△ 一部アプリのみ</td>
                <td>❌ カメラ撮影のみ</td>
                <td class="highlight">⭕ 写真選択・D&D・Ctrl+V貼付</td>
              </tr>
              <tr>
                <td><strong>QRコード作成</strong></td>
                <td>❌ 別アプリが必要</td>
                <td>❌ 非対応</td>
                <td class="highlight">⭕ URL/Wi-Fi/テキスト・配色変更・PNG保存</td>
              </tr>
              <tr>
                <td><strong>履歴・Excel連携</strong></td>
                <td>❌ 閲覧のみ・制限あり</td>
                <td>❌ 履歴が残らない</td>
                <td class="highlight">⭕ メモ編集 ＆ 文字化けゼロBOM付きCSV</td>
              </tr>
              <tr>
                <td><strong>取扱説明書 ＆ オフライン</strong></td>
                <td>❌ 圏外では停止</td>
                <td>⭕ カメラのみ</td>
                <td class="highlight">⭕ 内蔵取説・HTML/PDF配布・完全オフライン</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 13 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 13】徹底比較</h4>
        <p>「こちらの比較表の通り、単なるリーダーにとどまらず、露出補正、安全診断、ファイル読取、QR作成、文字化けゼロCSV、オフライン取説まで、現場で求められるすべての機能をワンストップで網羅しています。」</p>
      </div>
    </div>

    <!-- ==================== SLIDE 14 ==================== -->
    <div class="slide" data-slide="14">
      <div class="hero-slide">
        <div class="hero-badge">
          <span>🎯 SUMMARY & ACCESS</span>
        </div>
        <h2 class="hero-title" style="font-size: 42px; margin-bottom: 14px;">
          これからのQR体験を、あなたの手に。<br>
          <span class="gradient-text">QR Master Studio</span>
        </h2>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; max-width: 1040px; margin-bottom: 22px;">
          <div class="card" style="text-align: left; padding: 14px 16px;">
            <div style="font-size: 22px; margin-bottom: 4px;">⚡</div>
            <h4 style="font-size: 14px; color: #fff; margin-bottom: 3px;">圧倒的な速さ</h4>
            <p style="font-size: 11.5px; color: var(--text-sub);">GPU加速 × 自動露出補正 × バックライトで瞬時にデコード。</p>
          </div>
          <div class="card" style="text-align: left; padding: 14px 16px;">
            <div style="font-size: 22px; margin-bottom: 4px;">🛡️</div>
            <h4 style="font-size: 14px; color: var(--accent-green); margin-bottom: 3px;">最高峰の安心</h4>
            <p style="font-size: 11.5px; color: var(--text-sub);">8項目セキュリティ診断と警告確認ゲートでQR詐欺を未然に遮断。</p>
          </div>
          <div class="card" style="text-align: left; padding: 14px 16px;">
            <div style="font-size: 22px; margin-bottom: 4px;">💼</div>
            <h4 style="font-size: 14px; color: var(--primary); margin-bottom: 3px;">業務直結の機能</h4>
            <p style="font-size: 11.5px; color: var(--text-sub);">ファイル読込、自由なQR作成、文字化けゼロCSV出力。</p>
          </div>
          <div class="card" style="text-align: left; padding: 14px 16px;">
            <div style="font-size: 22px; margin-bottom: 4px;">📖</div>
            <h4 style="font-size: 14px; color: var(--accent-purple); margin-bottom: 3px;">取説 ＆ オフライン</h4>
            <p style="font-size: 11.5px; color: var(--text-sub);">電波圏外でも全機能稼働。内蔵取説とPDFダウンロード。</p>
          </div>
        </div>
        <div style="font-size: 13.5px; color: var(--primary); font-weight: 700; letter-spacing: 0.05em; background: rgba(56, 189, 248, 0.1); padding: 8px 26px; border-radius: 9999px; border: 1px solid rgba(56, 189, 248, 0.3);">
          🌐 今すぐアクセス: https://k3and4ai-sudo.github.io/qr-scanner-app/
        </div>
      </div>
      <div class="slide-footer">
        <span>Slide 14 / 14</span>
        <span>QR Master Studio Presentation</span>
      </div>
      <div class="speaker-notes" style="display:none;">
        <h4>【Slide 14】まとめ</h4>
        <p>「速い、安全、そして多機能。QR Master Studio は現場のあらゆるニーズを満たすQRコードの新しいスタンダードです。登録不要・完全無料ですぐにお使いいただけます。ご清聴ありがとうございました。」</p>
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
    <span id="slide-indicator" style="font-size: 12px; font-weight: 700; min-width: 50px; text-align: center;">01 / 14</span>
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
      <h3 style="font-size: 22px; font-weight: 800; color: #fff;">📋 スライド一覧 (全14スライド)</h3>
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
            title = titleEl.innerText.replace(/\\n/g, ' ').substring(0, 38);
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
