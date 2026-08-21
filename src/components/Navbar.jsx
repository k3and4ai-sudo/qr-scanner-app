import React from 'react';
import { QrCode, Sparkles, History, Github } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container nav-header-inner" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* ロゴ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00FF66 0%, #06C755 100%)',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 255, 102, 0.4)'
          }}>
            <QrCode size={22} color="#000" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              QR Master Studio
            </div>
            <div className="nav-title-sub" style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
              GPU ハードウェア加速 Web QR ツール
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="nav-tabs-wrapper" style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('scan')}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'scan' ? '#00FF66' : 'transparent',
              color: activeTab === 'scan' ? '#000' : '#94a3b8',
              boxShadow: activeTab === 'scan' ? '0 0 12px rgba(0,255,102,0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <QrCode size={16} /> QRスキャナー
          </button>

          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('generate')}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'generate' ? '#a855f7' : 'transparent',
              color: activeTab === 'generate' ? '#fff' : '#94a3b8',
              boxShadow: activeTab === 'generate' ? '0 0 12px rgba(168,85,247,0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} /> QRコード作成
          </button>

          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('history')}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'history' ? '#38bdf8' : 'transparent',
              color: activeTab === 'history' ? '#000' : '#94a3b8',
              boxShadow: activeTab === 'history' ? '0 0 12px rgba(56,189,248,0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <History size={16} /> 履歴
          </button>
        </div>

      </div>
    </header>
  );
}
