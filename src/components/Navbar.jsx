import React from 'react';
import { QrCode, Sparkles, History, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 16px'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* 上部: アプリタイトル・ロゴ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <QrCode size={24} color="#000" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                QR Master Studio
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                GPU ハードウェア加速 Web QR ツール
              </div>
            </div>
          </div>
        </div>

        {/* 2行2列の特大ナビゲーションボタンエリア (2 Rows x 2 Columns Grid) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '8px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* 1. QRスキャナー */}
          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('scan')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: 800,
              borderRadius: '12px',
              background: activeTab === 'scan' ? '#00FF66' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'scan' ? '#000' : '#e2e8f0',
              border: `1.5px solid ${activeTab === 'scan' ? '#00FF66' : 'rgba(255, 255, 255, 0.12)'}`,
              boxShadow: activeTab === 'scan' ? '0 0 18px rgba(0, 255, 102, 0.45)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <QrCode size={20} /> QRスキャナー
          </button>

          {/* 2. QRコード作成 */}
          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('generate')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: 800,
              borderRadius: '12px',
              background: activeTab === 'generate' ? '#a855f7' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'generate' ? '#fff' : '#e2e8f0',
              border: `1.5px solid ${activeTab === 'generate' ? '#a855f7' : 'rgba(255, 255, 255, 0.12)'}`,
              boxShadow: activeTab === 'generate' ? '0 0 18px rgba(168, 85, 247, 0.45)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={20} /> QRコード作成
          </button>

          {/* 3. 履歴 */}
          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('history')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: 800,
              borderRadius: '12px',
              background: activeTab === 'history' ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'history' ? '#000' : '#e2e8f0',
              border: `1.5px solid ${activeTab === 'history' ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)'}`,
              boxShadow: activeTab === 'history' ? '0 0 18px rgba(56, 189, 248, 0.45)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <History size={20} /> 履歴
          </button>

          {/* 4. 取説 */}
          <button
            className="btn nav-tab-btn"
            onClick={() => setActiveTab('manual')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: 800,
              borderRadius: '12px',
              background: activeTab === 'manual' ? '#fbbf24' : 'rgba(255, 255, 255, 0.06)',
              color: activeTab === 'manual' ? '#000' : '#e2e8f0',
              border: `1.5px solid ${activeTab === 'manual' ? '#fbbf24' : 'rgba(255, 255, 255, 0.12)'}`,
              boxShadow: activeTab === 'manual' ? '0 0 18px rgba(251, 191, 36, 0.45)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={20} /> 取説
          </button>
        </div>

      </div>
    </header>
  );
}
