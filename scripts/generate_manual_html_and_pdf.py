#!/usr/bin/env python3
import os
import re
import base64
import subprocess
import markdown

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD_PATH = os.path.join(ROOT_DIR, "USER_MANUAL.md")
HTML_PATH = os.path.join(ROOT_DIR, "USER_MANUAL.html")
PDF_PATH = os.path.join(ROOT_DIR, "USER_MANUAL.pdf")

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def embed_images_as_base64(md_content):
    def replace_img(match):
        alt = match.group(1)
        rel_path = match.group(2)
        full_path = os.path.join(ROOT_DIR, rel_path)
        if os.path.exists(full_path):
            with open(full_path, "rb") as img_f:
                b64_data = base64.b64encode(img_f.read()).decode("utf-8")
                mime = "image/png" if full_path.endswith(".png") else "image/jpeg"
                return f'<div class="manual-screenshot-container"><img class="manual-screenshot" src="data:{mime};base64,{b64_data}" alt="{alt}" /></div>'
        return match.group(0)

    # Markdown image regex: ![alt](path)
    pattern = r'!\[(.*?)\]\((.*?)\)'
    return re.sub(pattern, replace_img, md_content)

def format_github_alerts(text):
    # Convert GitHub-style alerts > [!TIP], > [!WARNING], > [!IMPORTANT], > [!NOTE]
    alert_types = {
        'TIP': ('💡 ヒント', '#059669', 'rgba(16, 185, 129, 0.1)', 'border-left: 4px solid #10b981;'),
        'WARNING': ('⚠️ 注意・トラブル解決', '#d97706', 'rgba(245, 158, 11, 0.1)', 'border-left: 4px solid #f59e0b;'),
        'IMPORTANT': ('❗ 重要事項', '#dc2626', 'rgba(239, 68, 68, 0.1)', 'border-left: 4px solid #ef4444;'),
        'NOTE': ('ℹ️ 補足情報', '#0284c7', 'rgba(14, 165, 233, 0.1)', 'border-left: 4px solid #0ea5e9;')
    }

    lines = text.split('\n')
    output = []
    in_alert = False
    current_alert = None
    alert_lines = []

    for line in lines:
        match = re.match(r'^>\s*\[!(TIP|WARNING|IMPORTANT|NOTE)\]', line)
        if match:
            if in_alert:
                output.append(_render_alert(current_alert, alert_lines, alert_types))
                alert_lines = []
            in_alert = True
            current_alert = match.group(1)
            continue

        if in_alert:
            if line.startswith('>'):
                content = re.sub(r'^>\s?', '', line)
                alert_lines.append(content)
            else:
                output.append(_render_alert(current_alert, alert_lines, alert_types))
                in_alert = False
                current_alert = None
                alert_lines = []
                output.append(line)
        else:
            output.append(line)

    if in_alert:
        output.append(_render_alert(current_alert, alert_lines, alert_types))

    return '\n'.join(output)

def _render_alert(alert_type, lines, alert_types):
    title, color, bg, border = alert_types.get(alert_type, ('お知らせ', '#333', '#eee', 'border-left: 4px solid #333;'))
    content_html = markdown.markdown('\n'.join(lines), extensions=['tables', 'fenced_code'])
    return f'''
<div class="alert-box" style="margin: 16px 0; padding: 14px 18px; border-radius: 8px; background-color: {bg}; {border}">
  <div style="font-weight: 800; color: {color}; margin-bottom: 8px; font-size: 14.5px;">{title}</div>
  <div style="color: #1e293b; font-size: 13.5px; line-height: 1.65;">
    {content_html}
  </div>
</div>
'''

def build_html():
    print("[1/3] Reading USER_MANUAL.md and embedding screenshots...")
    raw_md = read_file(MD_PATH)
    
    # 1. 画像の Base64 埋め込み
    md_with_b64 = embed_images_as_base64(raw_md)
    
    # 2. GitHub アラートボックスの変換
    md_with_alerts = format_github_alerts(md_with_b64)
    
    # 3. Markdown を HTML に変換
    body_html = markdown.markdown(
        md_with_alerts,
        extensions=['tables', 'fenced_code', 'nl2br', 'attr_list']
    )
    
    # 4. スタンドアロン HTML テンプレート組み立て
    full_html = f'''<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Master Studio - 取扱説明書 (ユーザーマニュアル)</title>
  <style>
    @page {{
      size: A4;
      margin: 15mm 12mm;
    }}
    html {{
      scroll-behavior: smooth;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
      line-height: 1.7;
      color: #0f172a;
      background-color: #ffffff;
      max-width: 860px;
      margin: 0 auto;
      padding: 30px 24px;
    }}
    h1 {{
      color: #059669;
      border-bottom: 3px solid #10b981;
      padding-bottom: 8px;
      margin-top: 0;
      font-size: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    h2 {{
      color: #0284c7;
      border-bottom: 2px solid #38bdf8;
      padding-bottom: 6px;
      margin-top: 2em;
      font-size: 19px;
    }}
    h3 {{
      color: #0f172a;
      margin-top: 1.8em;
      font-size: 16px;
      border-left: 4px solid #38bdf8;
      padding-left: 10px;
      scroll-margin-top: 20px;
    }}
    h4 {{
      color: #334155;
      margin-top: 1.2em;
      font-size: 14.5px;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 13.5px;
    }}
    th, td {{
      border: 1px solid #cbd5e1;
      padding: 9px 12px;
      text-align: left;
    }}
    th {{
      background-color: #f1f5f9;
      font-weight: bold;
    }}
    code {{
      background-color: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px;
      color: #0f172a;
      border: 1px solid #e2e8f0;
    }}
    pre {{
      background-color: #0f172a;
      color: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 12.5px;
    }}
    pre code {{
      background-color: transparent;
      color: inherit;
      border: none;
      padding: 0;
    }}
    ul, ol {{
      padding-left: 24px;
      margin: 8px 0;
    }}
    li {{
      margin-bottom: 6px;
    }}
    hr {{
      border: 0;
      height: 1px;
      background: #e2e8f0;
      margin: 28px 0;
    }}
    a {{
      color: #0284c7;
      text-decoration: underline;
    }}
    a:hover {{
      color: #0369a1;
    }}
    em {{
      color: #64748b;
      font-size: 12.5px;
    }}
    
    /* スクリーンショット画像のセンタリング＆美麗スタイル */
    .manual-screenshot-container {{
      display: flex;
      justify-content: center;
      margin: 14px 0 6px 0;
      page-break-inside: avoid;
    }}
    .manual-screenshot {{
      max-width: 320px;
      width: 100%;
      height: auto;
      border-radius: 14px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      background-color: #050811;
    }}
    
    .alert-box {{
      page-break-inside: avoid;
    }}

    @media print {{
      body {{
        padding: 0;
        max-width: 100%;
        color: #000;
        background: transparent;
      }}
      .manual-screenshot {{
        max-width: 270px;
        box-shadow: none;
        border: 1px solid #94a3b8;
      }}
      h2, h3 {{
        page-break-after: avoid;
      }}
      table, .alert-box, .manual-screenshot-container {{
        page-break-inside: avoid;
      }}
    }}
  </style>
</head>
<body>
{body_html}
</body>
</html>
'''
    write_file(HTML_PATH, full_html)
    print(f"Generated standalone HTML: {HTML_PATH}")

def build_pdf():
    print("[2/3] Rendering PDF via Headless Chrome...")
    cmd = [
        "google-chrome",
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={PDF_PATH}",
        HTML_PATH
    ]
    subprocess.run(cmd, check=True)
    print(f"Generated PDF: {PDF_PATH}")

def sync_distribution():
    print("[3/3] Syncing files to public/ and dist/ ...")
    os.makedirs(os.path.join(ROOT_DIR, "public"), exist_ok=True)
    os.makedirs(os.path.join(ROOT_DIR, "dist"), exist_ok=True)
    
    import shutil
    for fname in ["USER_MANUAL.html", "USER_MANUAL.pdf", "USER_MANUAL.md"]:
        src = os.path.join(ROOT_DIR, fname)
        shutil.copy2(src, os.path.join(ROOT_DIR, "public", fname))
        shutil.copy2(src, os.path.join(ROOT_DIR, "dist", fname))
    print("Sync complete.")

if __name__ == "__main__":
    build_html()
    build_pdf()
    sync_distribution()
    print("All tasks completed successfully!")
