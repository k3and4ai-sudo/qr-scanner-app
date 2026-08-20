import React, { useState } from 'react';
import Navbar from './components/Navbar';
import QrScanner from './components/QrScanner';
import QrGenerator from './components/QrGenerator';
import ScanHistory from './components/ScanHistory';

export default function App() {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan', 'generate', 'history'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container" style={{ flex: 1 }}>
        {activeTab === 'scan' && <QrScanner />}
        {activeTab === 'generate' && <QrGenerator />}
        {activeTab === 'history' && <ScanHistory />}
      </main>

      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '20px 16px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <div>
          <strong>QR Master Studio</strong> &copy; {new Date().getFullYear()} - Open Source PWA Project
        </div>
        <div style={{ marginTop: '4px' }}>
          Powered by Web BarcodeDetector API &amp; jsQR Dual Engine
        </div>
      </footer>
    </div>
  );
}
