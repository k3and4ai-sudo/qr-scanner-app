import React, { useState } from 'react';
import { 
  BookOpen, FileText, Download, ExternalLink, ShieldCheck, 
  Camera, Sparkles, History, AlertTriangle, Check, Smartphone, Zap, FolderOpen,
  FileSpreadsheet, FileJson, Trash2, Edit3, HelpCircle, ArrowRight, PlayCircle
} from 'lucide-react';

export default function UserManual() {
  const [activeSubTab, setActiveSubTab] = useState('guide'); // 'guide' | 'trouble'

  // ナビゲーション項目へのスムーズスクロール関数
  const scrollToSection = (id) => {
    setActiveSubTab('guide');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* マニュアルヘッダーカード */}
      <div className="card" style={{ borderLeft: '4px solid #fbbf24', background: 'rgba(15, 23, 42, 0.9)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', color: '#fbbf24', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={24} color="#fbbf24" /> QR Master Studio 取扱説明書 (ユーザーマニュアル)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>
              画面上部に並ぶナビゲーションボタンの配置順に、ジャンプ先画面と各関連機能を詳しく解説します。
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

      {/* 上部ナビゲーションボタン対応クイックリファレンス (クリックで該当記述へジャンプ) */}
      <div className="card" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>
            ▼ 上部ナビゲーションボタンの構成一覧（クリックすると該当説明にジャンプします）:
          </div>
          <span style={{ fontSize: '11px', color: '#38bdf8' }}>👆 各ボタンを押すと該当箇所へ移動</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
          
          {/* 1. QRスキャナー */}
          <button
            onClick={() => scrollToSection('section-scan')}
            style={{
              background: 'rgba(0, 255, 102, 0.08)',
              border: '1.5px solid rgba(0, 255, 102, 0.35)',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}
            className="hover-card-btn"
          >
            <div style={{ color: '#00FF66', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>1. [上段左] QRスキャナー</span>
              <ArrowRight size={13} />
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px' }}>起動時の初期画面・カメラ解読・安全診断</div>
          </button>

          {/* 2. ファイル読み込み */}
          <button
            onClick={() => scrollToSection('section-file')}
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1.5px solid rgba(6, 182, 212, 0.35)',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}
            className="hover-card-btn"
          >
            <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>2. [上段右] ファイル読み込み</span>
              <ArrowRight size={13} />
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px' }}>写真・スクショ・D&amp;D・クリップボード貼付</div>
          </button>

          {/* 3. QR作成 */}
          <button
            onClick={() => scrollToSection('section-generate')}
            style={{
              background: 'rgba(168, 85, 247, 0.08)',
              border: '1.5px solid rgba(168, 85, 247, 0.35)',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}
            className="hover-card-btn"
          >
            <div style={{ color: '#a855f7', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>3. [下段左] QR作成</span>
              <ArrowRight size={13} />
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px' }}>URL/Wi-Fi/名刺生成・構文解説モーダル</div>
          </button>

          {/* 4. 履歴 */}
          <button
            onClick={() => scrollToSection('section-history')}
            style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}
            className="hover-card-btn"
          >
            <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>4. [下段中央] 履歴</span>
              <ArrowRight size={13} />
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px' }}>メモ記録・CSV/JSON出力・ゴミ箱</div>
          </button>

          {/* 5. 取説 */}
          <button
            onClick={() => scrollToSection('section-manual')}
            style={{
              background: 'rgba(251, 191, 36, 0.08)',
              border: '1.5px solid rgba(251, 191, 36, 0.35)',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}
            className="hover-card-btn"
          >
            <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>5. [下段右] 取説</span>
              <ArrowRight size={13} />
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px' }}>本マニュアル・HTML/PDF閲覧・FAQ</div>
          </button>

          {/* 6. ホーム画面に追加 */}
          <button
            onClick={() => scrollToSection('section-pwa')}
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1.5px solid rgba(59, 130, 246, 0.35)',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}
            className="hover-card-btn"
          >
            <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>📲 ホーム画面に追加</span>
              <ArrowRight size={13} />
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px' }}>PWAインストール・完全オフライン起動</div>
          </button>

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
          🚀 ボタン別 使い方・関連機能ガイド
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ① QRスキャナー */}
          <div id="section-scan" className="card" style={{ background: 'rgba(0, 255, 102, 0.03)', border: '1.5px solid rgba(0, 255, 102, 0.3)', scrollMarginTop: '80px' }}>
            <h4 style={{ fontSize: '17px', color: '#00FF66', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={22} /> 1. QRスキャナー (上段左ボタン)
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.7' }}>
              上部ナビゲーションの <strong>「QRスキャナー」</strong> ボタンをクリックすると、カメラ映像によるリアルタイムQR解読画面へジャンプします。
            </div>

            {/* 💡 起動時の基本動作ハイライト */}
            <div style={{
              marginTop: '12px',
              background: 'linear-gradient(135deg, rgba(0, 255, 102, 0.12) 0%, rgba(56, 189, 248, 0.12) 100%)',
              border: '1.5px solid #00FF66',
              borderRadius: '10px',
              padding: '14px 16px'
            }}>
              <div style={{ color: '#00FF66', fontWeight: 800, fontSize: '14.5px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <PlayCircle size={18} color="#00FF66" /> 🌟 アプリ起動時の基本動作フロー（スキャンからリンク先を開くまで）
              </div>
              <ol style={{ paddingLeft: '20px', color: '#f8fafc', fontSize: '13.5px', lineHeight: '1.8', margin: 0 }}>
                <li><strong>起動時の初期状態</strong>: アプリ起動時は、初期状態で<strong>「QRスキャナー (上段左ボタン)」</strong>が選択された状態でスタートします。</li>
                <li><strong>スキャンの開始</strong>: 画面中央にある大きな緑色の <strong>「QRスキャナーを起動」</strong> ボタンを押すと、カメラモーダルが開き、リアルタイムでQRコードのスキャンが即座に開始されます。</li>
                <li><strong>結果のデコード表示</strong>: QRコードがカメラ枠内に入るとミリ秒単位で解読され、スキャン結果カードが表示されます。</li>
                <li><strong>URLリンクを開く</strong>: スキャンした内容が Web サイトのリンクの場合、水色の <strong>「URLを開く」</strong> ボタンが表示されます。このボタンを押すと、目的のリンク先ページが別タブで開きます。<br />
                  <span style={{ color: '#f59e0b', fontSize: '12.5px' }}>
                    ※ 安全スコアが100点満点以外のURLの場合、誤アクセス防止のため直前に確認ダイアログが表示されます。
                  </span>
                </li>
              </ol>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #00FF66' }}>
                <div style={{ fontWeight: 800, color: '#00FF66', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 ⚡ 自動露出最適化 (Auto Exposure) ＆ 白飛び復元エンジン
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  PC画面のギラつきや直射日光による白飛び、暗所環境に対し、デフォルトで選択されている <strong>`⚡ 自動露出 (Auto)`</strong> が環境光の輝度をリアルタイム測定し、物理露光補正 (`-2.0 EV` 〜 `+2.0 EV`) を動的に適用して確実に解読します。
                  手動で「標準」「暗く」「明るく」「ハイコントラスト」に切り替えることも可能です。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 🛡️ URL安全性自動判定 ＆ 100点未満ジャンプ警告確認ゲート
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  スキャンした内容が URL の場合、8項目の脅威検知アルゴリズム（HTTPS暗号化、数値IP接続、Punycode文字偽装、高リスクTLD、危険拡張子、フィッシングキーワード、多重サブドメイン、正規ドメイン検証）により <strong>0〜100点の安全スコア</strong> を自動算出します。<br />
                  <strong style={{ color: '#f59e0b' }}>⚠️ 安全確認ゲート:</strong> 
                  安全スコアが<strong>完全満点（100点）以外のすべてのURL</strong>に対して、画面遷移する直前に<strong>警告確認モーダルが自動起動</strong>します。検出理由とスコアを確認した上で、「Google Safe Browsing で事前調査」「リスクを承知の上でアクセス」「キャンセル」を判断できます。
                </div>
              </div>
            </div>
          </div>

          {/* ② ファイル読み込み */}
          <div id="section-file" className="card" style={{ background: 'rgba(6, 182, 212, 0.03)', border: '1.5px solid rgba(6, 182, 212, 0.3)', scrollMarginTop: '80px' }}>
            <h4 style={{ fontSize: '17px', color: '#06b6d4', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderOpen size={22} /> 2. ファイル読み込み (上段右ボタン)
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.7' }}>
              上部ナビゲーションの <strong>「ファイル読み込み」</strong> ボタンをクリックすると、画像ファイルからのQRコード解読画面へジャンプします。
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
                <div style={{ fontWeight: 800, color: '#06b6d4', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 スマホのアルバム・スクリーンショットから直接解読
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  スマートフォン内の写真アルバム、フォルダー、保存したスクリーンショットから画像ファイルを選択するだけで、瞬時にQRコードを解読します。
                  メールの添付画像や LINE のトーク画面で受信した画像、電子チラシに印字されたQRコードも手軽にスキャンできます。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
                <div style={{ fontWeight: 800, color: '#06b6d4', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 PCでのドラッグ＆ドロップ ＆ クリップボード貼り付け (Ctrl + V)
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  パソコン画面では、破線枠内へ画像ファイルを直接ドラッグ＆ドロップするか、Webページ上の画像をコピーして <code>Ctrl + V</code>（Mac は <code>Cmd + V</code>）を押すだけで、ファイルを保存することなく即座に解読されます。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
                <div style={{ fontWeight: 800, color: '#06b6d4', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 共通の結果カード ＆ 水色の「URLを開く」ボタン
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  ファイル解読後も「QRスキャナー」と同一の洗練された結果カードが表示され、1クリックコピーや水色の「URLを開く」ボタン、100点未満ジャンプ警告確認ゲートが作動します。
                </div>
              </div>
            </div>
          </div>

          {/* ③ QR作成 */}
          <div id="section-generate" className="card" style={{ background: 'rgba(168, 85, 247, 0.03)', border: '1.5px solid rgba(168, 85, 247, 0.3)', scrollMarginTop: '80px' }}>
            <h4 style={{ fontSize: '17px', color: '#a855f7', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={22} /> 3. QR作成 (下段左ボタン)
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.7' }}>
              上部ナビゲーションの <strong>「QR作成」</strong> ボタンをクリックすると、独自のQRコードを自由に生成・保存できるツール画面へジャンプします。
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #a855f7' }}>
                <div style={{ fontWeight: 800, color: '#a855f7', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 4つのデータ種別に対応（URL / テキスト / Wi-Fi / 名刺）
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  Webサイトの URL、任意のメモ・メッセージ、店舗や自宅の Wi-Fi 接続設定、vCard 名刺連絡先データの4種類から選んで、高精度QRコードをリアルタイム生成します。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #a855f7' }}>
                <div style={{ fontWeight: 800, color: '#a855f7', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 💡 Wi-Fi ＆ vCard テンプレート構文解説 ＆ 自動入力支援モーダル
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  Wi-Fi または 名刺（vCard）を選択すると、<strong>「💡 入力方法・キーワード解説」</strong> ボタンが表示されます。
                  ポップアップ内で <code>WIFI:S:SSID;T:WPA;P:password;;</code> や <code>BEGIN:VCARD...</code> などの構文キーワードの意味を詳細に解説。専用入力フォームに項目を入力して「反映する」を押すだけで、正しい規格準拠の文字列がワンクリックで自動作成されます。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #a855f7' }}>
                <div style={{ fontWeight: 800, color: '#a855f7', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 カラーカスタマイズ ＆ 高解像度 PNG ダウンロード
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  QRコードの前景色と背景色をカラーピッカーから自由にカスタマイズ可能。印刷物やPOP、Web素材に最適な高画質 PNG 画像としてワンクリック保存できます。
                </div>
              </div>
            </div>
          </div>

          {/* ④ 履歴 */}
          <div id="section-history" className="card" style={{ background: 'rgba(56, 189, 248, 0.03)', border: '1.5px solid rgba(56, 189, 248, 0.3)', scrollMarginTop: '80px' }}>
            <h4 style={{ fontSize: '17px', color: '#38bdf8', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={22} /> 4. 履歴 (下段中央ボタン)
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.7' }}>
              上部ナビゲーションの <strong>「履歴」</strong> ボタンをクリックすると、過去にスキャンしたQRコードの一覧管理・メモ編集・エクスポート画面へジャンプします。
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 タイトル＆コメント（メモ）のインライン編集・保存
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  各スキャン結果に、用途や補足事項を「タイトル」「コメント（メモ）」として記録できます。
                  スマートフォンでも文字がキーボードに隠れないよう、上下幅の広いテキストエリア（<code>minHeight: 100px</code>）と見やすいフォントを採用しています。
                  スキャンした日時も秒単位（<code>YYYY/MM/DD HH:mm:ss</code>）で正確に記録されます。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #00FF66' }}>
                <div style={{ fontWeight: 800, color: '#00FF66', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 📥 CSV出力（UTF-8 BOM付き・Excel文字化け完全防止）＆ JSON出力
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  ツールバーの <strong>「CSV出力」</strong> ボタンを押すと、スキャン履歴一覧がワンクリックで CSV ダウンロードされます。
                  <strong>UTF-8 BOM (`\uFEFF`)</strong> を自動付与しているため、Windows 版および Mac 版の Microsoft Excel、Google スプレッドシートなどでダブルクリックして開くだけで日本語が一切文字化けしません。
                  システム連携向けには構造化メタデータを保持した <strong>「JSON出力」</strong> も利用可能です。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 ⚠️ 100点未満URLのジャンプ確認ゲート（履歴内でも作動）
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  履歴一覧の水色「開く」ボタンを押した際も、安全スコアが100点満点以外のURLには警告確認ダイアログが表示されます。過去のスキャンであっても安全確認を行ってからアクセスできます。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 🗑️ ゴミ箱機能（一時退避・復元・完全削除・一括クリア）
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  不要になったスキャン記録は「ゴミ箱」へ安全に一時退避されます。
                  「ゴミ箱」サブタブに切り替えることで、個別の「元に戻す（復元）」「完全に削除」や、「ゴミ箱を空にする」一括消去が可能です。
                </div>
              </div>
            </div>
          </div>

          {/* ⑤ 取説 */}
          <div id="section-manual" className="card" style={{ background: 'rgba(251, 191, 36, 0.03)', border: '1.5px solid rgba(251, 191, 36, 0.3)', scrollMarginTop: '80px' }}>
            <h4 style={{ fontSize: '17px', color: '#fbbf24', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={22} /> 5. 取説 (下段右ボタン - 本画面)
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.7' }}>
              上部ナビゲーションの <strong>「取説」</strong> ボタンをクリックすると、本取扱説明書（ユーザーマニュアル）画面へジャンプします。
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #fbbf24' }}>
                <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 操作手引 ＆ トラブルシューティングの閲覧
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  本アプリの全機能の使い方ガイドと、カメラ許可・LINE WebView 動作・Excel文字化け防止・安全スコア確認などのよくある質問（FAQ）をいつでも参照できます。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #fbbf24' }}>
                <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 HTML別枠表示 ＆ PDF版ダウンロード
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  上部の「HTMLで別枠表示」から独立したブラウザタブでマニュアル全容を表示でき、「PDF版ダウンロード」から印刷・配布に適した PDF ドキュメントを端末に保存できます。
                </div>
              </div>
            </div>
          </div>

          {/* ⑥ PWA機能 (ホーム画面に追加) */}
          <div id="section-pwa" className="card" style={{ background: 'rgba(59, 130, 246, 0.03)', border: '1.5px solid rgba(59, 130, 246, 0.3)', scrollMarginTop: '80px' }}>
            <h4 style={{ fontSize: '17px', color: '#60a5fa', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={22} /> 📲 ホーム画面に追加 (ヘッダー右上ボタン - PWA機能)
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.7' }}>
              画面最上部・ヘッダー右上の <strong>「📲 ホーム画面に追加」</strong> ボタンをクリックすると、お使いの端末（スマートフォン・PC）へ本アプリをネイティブアプリのようにインストールできます。
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #60a5fa' }}>
                <div style={{ fontWeight: 800, color: '#60a5fa', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 「📲 ホーム画面に追加」ボタンの操作方法
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  ・<strong>Android (Chrome) / PC (Chrome, Edge)</strong>: ヘッダーのボタンを押すと「アプリをインストールしますか？」という公式ダイアログが出ます。「インストール」を選ぶとホーム画面に専用アイコンが配置されます。<br />
                  ・<strong>iPhone / iPad (Safari)</strong>: Safari 画面下部の「共有 (四角から矢印)」ボタンを押し、「ホーム画面に追加」をタップすることで同様にインストールされます。<br />
                  ・<strong>インストール済みの場合</strong>: ヘッダーのボタンが「✅ PWA起動中」バッジに変化します。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #60a5fa' }}>
                <div style={{ fontWeight: 800, color: '#60a5fa', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 メリット 1: アドレスバーのない快適な全画面ネイティブ動作
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  ブラウザのURL欄やタブバーが非表示になり、App Store / Google Play で入手した公式アプリとまったく同じフルスクリーン環境でスキャナーを操作できます。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #60a5fa' }}>
                <div style={{ fontWeight: 800, color: '#60a5fa', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 メリット 2: 完全オフライン動作 (地下や機内モードでも0秒起動)
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  Service Worker（<code>sw.js</code>）によるオフラインキャッシュ技術により、地下街、山間部、通信障害時、あるいは機内モード中であっても、電波を一切消費することなく瞬時に0秒起動して利用できます。
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #60a5fa' }}>
                <div style={{ fontWeight: 800, color: '#60a5fa', fontSize: '13.5px', marginBottom: '4px' }}>
                  🔹 メリット 3: 新バージョン自動検知トーストバナー
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  アプリの新機能が本番サーバーに公開されると、画面下部に「🔔 新バージョンがあります [今すぐ更新]」トーストバナーがスライドイン表示され、ワンタップで即時更新できます。
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* サブタブ 2: トラブルシューティング */}
      {activeSubTab === 'trouble' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="card" style={{ borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)' }}>
            <h4 style={{ color: '#ef4444', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} /> Q. 「カメラの起動に失敗しました」または「HTTPS接続が必要です」と表示される場合
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <strong>原因</strong>: スマホ等のブラウザではセキュリティ制限（Secure Context）により、<code>http://192.168.x.x</code> のような IP アドレス直接接続でのカメラ利用がブロックされます。<br />
              <strong>解決方法</strong>: 
              本アプリの公式本番 HTTPS URL (<code>https://k3and4ai-sudo.github.io/qr-scanner-app/</code>) またはローカル開発の HTTPS URL (<code>https://localhost:3000/</code>) からアクセスしてください。
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #06C755', background: 'rgba(6, 199, 85, 0.05)' }}>
            <h4 style={{ color: '#06C755', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} /> Q. LINE アプリ内ブラウザ（LINE WebView）でカメラが動かない場合
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <strong>原因</strong>: LINE アプリ内部の WebView 仕様により Web カメラがブロックされることがあります。<br />
              <strong>解決方法</strong>: 画面上の「🌐 他のブラウザ（Chrome / Safari）で開く」ボタンを押すか、画面右上のメニュー「ブラウザで開く」を選択してください。
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #38bdf8', background: 'rgba(56, 189, 248, 0.05)' }}>
            <h4 style={{ color: '#38bdf8', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18} /> Q. エクスポートした CSV を Excel で開くと文字化けしませんか？
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <strong>回答</strong>: 文字化けしません。本アプリの CSV 出力機能は <strong>UTF-8 BOM (`\uFEFF`)</strong> を自動付与しているため、Windows 版および Mac 版の Microsoft Excel、Google スプレッドシートなどでダブルクリックして開くだけで日本語が正常に表示されます。
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #fbbf24', background: 'rgba(251, 191, 36, 0.05)' }}>
            <h4 style={{ color: '#fbbf24', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} /> Q. スキャンしたURLにすぐジャンプせず警告が出るのはなぜですか？
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <strong>回答</strong>: 本アプリではセキュリティ強化のため、<strong>安全スコアが完全満点（100点）以外のすべてのURL</strong>について、アクセス前に確認ダイアログを表示する安全ゲートを設けています。HTTP通信や短縮URL、不審なドメインでないかをご確認の上、「リスクを承知の上でアクセス」を押すことで安全に閲覧できます。
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
