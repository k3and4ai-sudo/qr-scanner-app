import React, { useState } from 'react';
import { 
  BookOpen, FileText, Download, ExternalLink, ShieldCheck, 
  Camera, Sparkles, History, AlertTriangle, Check, Smartphone, Zap
} from 'lucide-react';

export default function UserManual() {
  const [activeSubTab, setActiveSubTab] = useState('guide'); // 'guide' | 'trouble'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* マニュアルヘッダーカード */}
      <div className="card" style={{ borderLeft: '4px solid #fbbf24', background: 'rgba(15, 23, 42, 0.9)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', color: '#fbbf24', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={24} color="#fbbf24" /> QR Master Studio 取扱説明書 (ユーザーマニュアル)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px', marginBotton: 0 }}>
              Web API ハードウェア加速 (`BarcodeDetector`) ＆ URL安全性自動判定機能を備えた超高速QRツールの操作ガイドです。
            </p>
          </div>

          {/* マニュアルダウンロード＆スタンドアロン閲覧ボタン */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a 
              href="./USER_MANUAL.html" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
            >
              <ExternalLink size={15} /> HTMLで別枠表示
            </a>
            <a 
              href="./USER_MANUAL.pdf" 
              download="QR_Master_Studio_User_Manual.pdf"
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            >
              <Download size={15} /> PDF版ダウンロード
            </a>
          </div>
        </div>
      </div>

      {/* セクションナビゲーション */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('guide')}
          className="btn"
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 700,
            background: activeSubTab === 'guide' ? '#fbbf24' : 'rgba(255, 255, 255, 0.05)',
            color: activeSubTab === 'guide' ? '#000' : '#94a3b8',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          🚀 主な機能と使い方ガイド
        </button>
        <button
          onClick={() => setActiveSubTab('trouble')}
          className="btn"
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 700,
            background: activeSubTab === 'trouble' ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
            color: activeSubTab === 'trouble' ? '#fff' : '#94a3b8',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          🛠️ トラブルシューティング & FAQ
        </button>
      </div>

      {/* サブタブ 1: 機能ガイド */}
      {activeSubTab === 'guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. スキャン機能 */}
          <div className="card" style={{ background: 'rgba(0, 255, 102, 0.03)', border: '1px solid rgba(0, 255, 102, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#00FF66', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={20} /> 1. 📷 QRコードスキャン ＆ ワンタップ即時起動
            </h4>
            <ol style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li>上部またはメイン画面の **「QRスキャナーを起動」** ボタンをクリックします。</li>
              <li>ボタンを押した瞬間に画面がモーダルへ切り替わり、**Webカメラが自動起動してミリ秒単位のスキャンが即座に開始**されます。</li>
              <li>白飛び環境や暗所では、**`⚡ 自動露出 (Auto)`** が環境光を自動識別し露光補正 (`-2.0 EV` / `+2.0 EV`) を即座に適用します。</li>
            </ol>
          </div>

          {/* 2. URL安全性診断機能 */}
          <div className="card" style={{ background: 'rgba(56, 189, 248, 0.03)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#38bdf8', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} /> 2. 🛡️ URL 安全性自動判定 ＆ 危険警告システム
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li><strong>8つの自動セキュリティ診断</strong>: HTTPS暗号化・数値IP接続・Punycode文字偽装・高リスクTLD・危険拡張子・フィッシング語句等を自動判定。</li>
              <li><strong>安全度スコアバッジ</strong>: 🟢 安全 (90-100点) / 🟡 注意 (60-89点) / 🔴 危険 (0-59点) を視覚的に表示。</li>
              <li><strong>外部調査ツール連携</strong>: Google Safe Browsing / VirusTotal / urlscan.io / Norton Safe Web で1タップ詳細照会。</li>
              <li><strong>⚠️ 安全警告モーダル</strong>: 注意・危険URLを開こうとした際、誤アクセスを防止する警告ポップアップが自動起動。</li>
            </ul>
          </div>

          {/* 3. 生成機能 */}
          <div className="card" style={{ background: 'rgba(168, 85, 247, 0.03)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#a855f7', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} /> 3. 🎨 QRコード生成・作成ツール
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li>URL / テキスト / Wi-Fi自動接続情報 / vCard名刺データをワンタッチで高精度QRコードへ変換。</li>
              <li>コードの色・背景色を自由に変更でき、高画質 PNG 画像として保存できます。</li>
            </ul>
          </div>

          {/* 4. 履歴機能 */}
          <div className="card" style={{ background: 'rgba(251, 191, 36, 0.03)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#fbbf24', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} /> 4. 📜 スキャン履歴 ＆ 安全度タグ管理
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li>スキャンしたデータはブラウザの LocalStorage に自動保存され、過去の安全度スコアバッジも一覧表示されます。</li>
              <li>履歴内検索および1タップクリップボードコピーに対応しています。</li>
            </ul>
          </div>

        </div>
      )}

      {/* サブタブ 2: トラブルシューティング */}
      {activeSubTab === 'trouble' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="card" style={{ borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)' }}>
            <h4 style={{ color: '#ef4444', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} /> Q. 「カメラの起動に失敗しました」と表示される場合
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <strong>原因</strong>: スマホ等のブラウザではセキュリティ制限（Secure Context）により、`http://192.168.x.x` のような IP アドレス直接接続でのカメラ利用がブロックされます。<br />
              <strong>解決方法</strong>: 本アプリの HTTPS 接続 URL (`https://xxxx.trycloudflare.com`) からアクセスしてください。
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #06C755', background: 'rgba(6, 199, 85, 0.05)' }}>
            <h4 style={{ color: '#06C755', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} /> Q. LINE アプリ内ブラウザ（LINE WebView）でカメラが動かない場合
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <strong>原因</strong>: LINE アプリ内部の WebView 仕様により Web カメラがブロックされることがあります。<br />
              <strong>解決方法</strong>: 画面上の「🌐 他のブラウザ（Chrome / Safari）で開く」ボタンを押すか、右上の「ブラウザで開く」を選択してください。
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
