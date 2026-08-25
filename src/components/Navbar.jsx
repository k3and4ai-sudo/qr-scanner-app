import React from 'react';
import { QrCode, Sparkles, History, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '8px 10px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* 上部: アプリタイトル・ロゴ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #00FF66 0%, #06C755 100%)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0, 255, 102, 0.4)'
            }}>
              <QrCode size={18} color="#000" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                QR Master Studio
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                GPU 加速 Web QR ツール
              </div>
            </div>
          </div>
        </div>

        {/* 2行2列の特大ナビゲーションボタンエリア (2 Rows x 2 Columns Grid) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* 1. QRスキャナー */}
          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('scan')}
            style={{
              padding: '9px 8px',
              fontSize: '14px',
              fontWeight: 800,
              borderRadius: '10px',
              background: activeTab === 'scan' ? '#00FF66' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'scan' ? '#000' : '#e2e8f0',
              border: `1.5px solid ${activeTab === 'scan' ? '#00FF66' : 'rgba(255, 255, 255, 0.12)'}`,
              boxShadow: activeTab === 'scan' ? '0 0 14px rgba(0, 255, 102, 0.45)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <QrCode size={17} /> QRスキャナー
          </button>

          {/* 2. QRコード作成 */}
          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('generate')}
            style={{
              padding: '9px 8px',
              fontSize: '14px',
              fontWeight: 800,
              borderRadius: '10px',
              background: activeTab === 'generate' ? '#a855f7' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'generate' ? '#fff' : '#e2e8f0',
              border: `1.5px solid ${activeTab === 'generate' ? '#a855f7' : 'rgba(255, 255, 255, 0.12)'}`,
              boxShadow: activeTab === 'generate' ? '0 0 14px rgba(168, 85, 247, 0.45)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={17} /> QRコード作成
          </button>

          {/* 3. 履歴 */}
          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('history')}
            style={{
              padding: '9px 8px',
              fontSize: '14px',
              fontWeight: 800,
              borderRadius: '10px',
              background: activeTab === 'history' ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'history' ? '#000' : '#e2e8f0',
              border: `1.5px solid ${activeTab === 'history' ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)'}`,
              boxShadow: activeTab === 'history' ? '0 0 14px rgba(56, 189, 248, 0.45)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <History size={17} /> 履歴
          </button>

          {/* 4. 取説 */}
          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('manual')}
            style={{
              padding: '9px 8px',
              fontSize: '14px',
              fontWeight: 800,
              borderRadius: '10px',
              background: activeTab === 'manual' ? '#fbbf24' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'manual' ? '#000' : '#e2e8f0',
              border: `1.5px solid ${activeTab === 'manual' ? '#fbbf24' : 'rgba(255, 255, 255, 0.12)'}`,
              boxShadow: activeTab === 'manual' ? '0 0 14px rgba(251, 191, 36, 0.45)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={17} /> 取説
          </button>
        </div>

      </div>
    </header>
  );
}

