import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import QrScanner from './components/QrScanner';
import FileScanner from './components/FileScanner';
import QrGenerator from './components/QrGenerator';
import ScanHistory from './components/ScanHistory';
import UserManual from './components/UserManual';
import { UpdateNotificationToast } from './components/UpdateNotificationToast';
import { registerServiceWorker } from './registerServiceWorker';

const VALID_TABS = ['scan', 'file', 'generate', 'history', 'manual'];

function getInitialTab() {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '');
    if (VALID_TABS.includes(hash)) return hash;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (VALID_TABS.includes(tabParam)) return tabParam;
  }
  return 'scan';
}

export default function App() {
  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [waitingWorker, setWaitingWorker] = useState(null);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined' && window.location.hash !== `#${tab}`) {
      window.location.hash = `#${tab}`;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // デモ用サンプル履歴の自動投入 (URLに demo または manual_demo がある場合)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('demo') === '1' || params.get('manual_demo') === '1') {
        const STORAGE_KEY = 'qr_master_scan_history';
        const sampleHistory = [
          {
            id: 'demo-1',
            value: 'https://example.com/portal/guide',
            type: 'url',
            title: '🌐 公式ポータル案内・利用ガイド',
            comment: '業務ポータルの総合案内ページ',
            scanDateTime: '2026/10/15 14:30:15',
            timestampMs: Date.now() - 3600000,
            isTrash: false,
            safety: {
              score: 100,
              status: 'safe',
              reasons: ['HTTPS 暗号化通信が有効です', '信頼されたトップレベルドメイン (.com)', '不審なパラメータは検出されませんでした'],
              domain: 'example.com'
            }
          },
          {
            id: 'demo-2',
            value: 'http://test-insecure-portal.local/login',
            type: 'url',
            title: '⚠️ 社内検証環境 (非暗号化HTTP)',
            comment: 'SSL非対応のためアクセス時警告確認',
            scanDateTime: '2026/10/15 13:15:00',
            timestampMs: Date.now() - 7200000,
            isTrash: false,
            safety: {
              score: 60,
              status: 'warning',
              reasons: ['通信が暗号化されていない HTTP プロトコルです', 'パスワード等の盗聴リスクがあります'],
              domain: 'test-insecure-portal.local'
            }
          },
          {
            id: 'demo-3',
            value: 'WIFI:S:Office-Guest-5G;T:WPA;P:Guest2026Secure!;;',
            type: 'wifi',
            title: '📶 Wi-Fi 接続 (Office-Guest-5G)',
            comment: '来客用ゲストWi-Fi自動設定',
            scanDateTime: '2026/10/15 11:00:22',
            timestampMs: Date.now() - 15000000,
            isTrash: false,
            parsedData: { ssid: 'Office-Guest-5G', authType: 'WPA' }
          }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleHistory));
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Register service worker and listen for new updates
    registerServiceWorker({
      onUpdate: (worker) => {
        console.log('[App] New update available, displaying update banner');
        setWaitingWorker(worker);
      }
    });
  }, []);

  return (
    <div className="mobile-app-shell">
      <div className="mobile-phone-frame">
        {/* スマホ上部ノッチシミュレーション (PC画面表示時) */}
        <div className="phone-notch">
          <div className="phone-speaker"></div>
          <div className="phone-camera"></div>
        </div>

        <div className="mobile-screen-content">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="container" style={{ flex: 1 }}>
            {activeTab === 'scan' && <QrScanner />}
            {activeTab === 'file' && <FileScanner />}
            {activeTab === 'generate' && <QrGenerator />}
            {activeTab === 'history' && <ScanHistory />}
            {activeTab === 'manual' && <UserManual />}
          </main>

          <footer style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px 12px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#64748b',
            background: '#090d16'
          }}>
            <div>
              <strong>QR Master Studio</strong> &copy; {new Date().getFullYear()} - PWA Mobile
            </div>
            <div style={{ marginTop: '2px', fontSize: '10px' }}>
              Web BarcodeDetector &amp; jsQR Engine
            </div>
          </footer>

          {/* 新バージョン検知時の通知バナー */}
          <UpdateNotificationToast waitingWorker={waitingWorker} />
        </div>
      </div>
    </div>
  );
}
