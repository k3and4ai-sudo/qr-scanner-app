import React, { useState } from 'react';
import { 
  BookOpen, FileText, Download, ExternalLink, ShieldCheck, 
  Camera, Sparkles, History, AlertTriangle, Check, Smartphone, Zap, FolderOpen,
  FileSpreadsheet, FileJson, Trash2, Edit3, HelpCircle
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
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>
              Web API ハードウェア加速 (`BarcodeDetector`) ＆ URL安全性自動判定機能を備えた超高速 PWA QRツールの操作ガイドです。
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
              <li>上部ナビゲーションの <strong>「QRスキャナー」</strong> ボタンをクリックします。</li>
              <li>画面がスキャナーに切り替わり、<strong>Webカメラが自動起動してミリ秒単位のスキャンが即座に開始</strong>されます。</li>
              <li>PC画面のギラつきや直射光による白飛び、あるいは暗所では、<strong>`⚡ 自動露出 (Auto)`</strong> が環境光を自動識別し、最適な露出補正 (`-2.0 EV` 〜 `+2.0 EV`) をリアルタイムに動的適用します。</li>
              <li>手動で露出を変更したい場合は、露出コントロールボタン（「標準」「暗く」「明るく」「ハイコントラスト」）で自由に切り替えられます。</li>
            </ol>
          </div>

          {/* 2. 画像ファイル読み込み機能 */}
          <div className="card" style={{ background: 'rgba(6, 182, 212, 0.03)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#06b6d4', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderOpen size={20} /> 2. 📁 画像ファイルからの QR 読み込み
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li>スマートフォン内のアルバム・写真ライブラリ・スクリーンショットから画像ファイルを選んで直接 QR コードを高速解読します。</li>
              <li>受信したメールや LINE のトーク画像、保存した電子チラシ・クーポンの QR コードも簡単にスキャンできます。</li>
              <li>PC 環境では画像のドラッグ＆ドロップや、クリップボードからの画像貼り付け (Ctrl+V) にも完全対応しています。</li>
            </ul>
          </div>

          {/* 3. URL安全性診断機能 & 警告確認ゲート */}
          <div className="card" style={{ background: 'rgba(56, 189, 248, 0.03)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#38bdf8', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} /> 3. 🛡️ URL 安全性自動判定 ＆ 100点未満ジャンプ警告確認ゲート
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li><strong>8項目の包括的セキュリティ診断</strong>: HTTPS暗号化・数値IP接続・Punycode文字偽装・高リスクTLD・危険拡張子・フィッシング語句・多重サブドメイン等を自動判定。</li>
              <li><strong>厳格な安全スコア分類</strong>:
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  <li>🟢 <strong>安全 (100点満点)</strong>: 不審な脅威パターンが一切なく、信頼性が確認された正規リンク。</li>
                  <li>🟡 <strong>要確認・注意 (60〜99点)</strong>: HTTP通信や不審TLD、クエリパラメータ等が含まれるURL。</li>
                  <li>🔴 <strong>危険・高リスク (0〜59点)</strong>: 不審なパターンや実行可能スクリプト、フィッシング疑いが検出されたURL。</li>
                </ul>
              </li>
              <li><strong>⚠️ 100点満点以外のアクセス警告確認ゲート</strong>:
                安全スコアが100点満点以外のURLを開く場合、結果画面・履歴一覧のいずれにおいても<strong>直前の警告確認モーダルが自動起動</strong>します。検出された理由やスコアを確認し、「Google Safe Browsing で事前調査」「リスクを承知でアクセス」「キャンセル」を明示的に選択できます。
              </li>
              <li><strong>外部調査ツール連携</strong>: Google Safe Browsing / VirusTotal / urlscan.io / Norton Safe Web でワンタップ詳細照会が可能です。</li>
            </ul>
          </div>

          {/* 4. 生成機能 & テンプレート解説 */}
          <div className="card" style={{ background: 'rgba(168, 85, 247, 0.03)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#a855f7', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} /> 4. 🎨 QRコード作成ツール ＆ テンプレート解説モーダル
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li>URL / 自由テキスト / Wi-Fi自動接続情報 / vCard名刺連絡先データをワンタッチで高精度QRコードへ変換。</li>
              <li><strong>💡 Wi-Fi ＆ vCard 入力支援・構文解説モーダル</strong>:
                Wi-Fi (`WIFI:S:...`) や 名刺 (`BEGIN:VCARD...`) 選択時に「解説・入力支援」ボタンを押すと、各パラメータの意味をわかりやすく解説したポップアップを表示。専用フォームに入力するだけで正しいQRコード文字列をワンクリックで自動生成して反映できます。
              </li>
              <li>コード色・背景色の自由カスタマイズおよび高画質 PNG 画像ダウンロードに対応。</li>
            </ul>
          </div>

          {/* 5. 履歴機能 & エクスポート & ゴミ箱 */}
          <div className="card" style={{ background: 'rgba(251, 191, 36, 0.03)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#fbbf24', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} /> 5. 📜 スキャン履歴管理・メモ・CSV/JSON出力・ゴミ箱
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li><strong>タイトル＆メモのインライン記録</strong>: 各スキャンデータに任意のタイトルとメモ・コメントを追記・編集・保存可能（スマホでも入力しやすい広幅テキストエリア搭載）。</li>
              <li><strong>秒単位の詳細日時記録</strong>: いつスキャンしたかを `YYYY/MM/DD HH:mm:ss` で正確に記録。</li>
              <li><strong>📥 CSV出力（Excel文字化け完全防止）</strong>:
                <strong>UTF-8 BOM付き (`\uFEFF`)</strong> で出力するため、Microsoft Excel（Windows/Mac）や各種表計算ソフトでそのまま開いても日本語が絶対に文字化けしません。
              </li>
              <li><strong>📥 JSON出力</strong>: 解析メタデータや安全診断結果を含む構造化データをそのままファイル保存可能。</li>
              <li><strong>🗑️ ゴミ箱機能</strong>: 不要になったスキャン結果を一時退避。ゴミ箱タブから「元に戻す」「完全に削除」「ゴミ箱を空にする」が行えます。</li>
            </ul>
          </div>

          {/* 6. PWA機能 & オフライン対応 */}
          <div className="card" style={{ background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#38bdf8', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={20} /> 6. 📲 PWA（ホーム画面追加）＆ 完全オフライン動作
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li><strong>ホーム画面への追加</strong>: ヘッダーの「📲 ホーム画面に追加」ボタンから、ネイティブアプリのように端末のホーム画面へインストール可能。</li>
              <li><strong>完全オフライン動作 (0秒起動)</strong>: Service Worker により、地下や飛行機内などの電波が届かない場所でもアプリが即座に起動します。</li>
              <li><strong>新バージョン自動検知トースト</strong>: アプリの新機能が配信されると、画面下部に「🔔 新バージョンがあります [今すぐ更新]」トーストバナーがスライド表示され、ワンタップで即時更新できます。</li>
            </ul>
          </div>

          {/* 7. 超高速デコード技術 & 白飛び復元エンジン */}
          <div className="card" style={{ background: 'rgba(236, 72, 153, 0.03)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
            <h4 style={{ fontSize: '16px', color: '#ec4899', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} /> 7. ⚡ 超高速デコード技術 ＆ 白飛び復元エンジン
            </h4>
            <ul style={{ paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              <li><strong>BarcodeDetector API (GPU加速)</strong>: ブラウザ標準のハードウェアアクセラレーションを活用し、ミリ秒単位で超高速なQRコード検知・解読を行います。</li>
              <li><strong>大津適応二値化フォールバック</strong>: `BarcodeDetector` 非対応端末でも、最適化済み `jsQR` と独自画像処理により高精度に解読を完遂します。</li>
              <li><strong>白飛び復元エンジン</strong>: PC画面のギラつきや直射光による露出オーバー（白飛び）に対し、物理EV露光制御 (`-2.0 EV` 〜 `+2.0 EV`) と階調補正を組み合わせてリアルタイム復元します。</li>
            </ul>
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
              <strong>原因</strong>: スマホ等のブラウザではセキュリティ制限（Secure Context）により、`http://192.168.x.x` のような IP アドレス直接接続でのカメラ利用がブロックされます。<br />
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
