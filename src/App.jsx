import React, { useState } from 'react';
import Navbar from './components/Navbar';
import QrScanner from './components/QrScanner';
import QrGenerator from './components/QrGenerator';
import ScanHistory from './components/ScanHistory';
import UserManual from './components/UserManual';

export default function App() {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'generate' | 'history' | 'manual'

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
        </div>
      </div>
    </div>
  );
}

