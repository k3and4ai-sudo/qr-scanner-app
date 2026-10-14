import React from 'react';
import { QrCode, Sparkles, History, BookOpen, FolderOpen } from 'lucide-react';
import { PwaInstallButton } from './PwaInstallButton';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '6px 8px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        
        {/* 上部: アプリタイトル・ロゴ & PWAインストールボタン */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #00FF66 0%, #06C755 100%)',
              borderRadius: '6px',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0, 255, 102, 0.4)'
            }}>
              <QrCode size={16} color="#000" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                QR Master Studio
              </div>
              <div style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 600 }}>
                GPU 加速 Web QR ツール
              </div>
            </div>
          </div>

          {/* PWA インストールボタン */}
          <div>
            <PwaInstallButton />
          </div>
        </div>

        {/* 二段表示ナビゲーションボタンエリア (2 Rows Grid) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* 上段: メイン読取系 (QRスキャナー ＆ ファイル読み込み - 2列) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '3px 4px',
            borderRadius: '9px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {/* 1. QRスキャナー */}
            <button
              className="btn nav-tab-btn"
              onClick={() => setActiveTab('scan')}
              style={{
                padding: '7px 4px',
                fontSize: '12px',
                fontWeight: 800,
                borderRadius: '7px',
                background: activeTab === 'scan' ? '#00FF66' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'scan' ? '#000' : '#e2e8f0',
                border: `1.5px solid ${activeTab === 'scan' ? '#00FF66' : 'rgba(255, 255, 255, 0.12)'}`,
                boxShadow: activeTab === 'scan' ? '0 0 12px rgba(0, 255, 102, 0.45)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <QrCode size={14} /> QRスキャナー
            </button>

            {/* 2. ファイル読み込み */}
            <button
              className="btn nav-tab-btn"
              onClick={() => setActiveTab('file')}
              style={{
                padding: '7px 4px',
                fontSize: '12px',
                fontWeight: 800,
                borderRadius: '7px',
                background: activeTab === 'file' ? '#06b6d4' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'file' ? '#000' : '#e2e8f0',
                border: `1.5px solid ${activeTab === 'file' ? '#06b6d4' : 'rgba(255, 255, 255, 0.12)'}`,
                boxShadow: activeTab === 'file' ? '0 0 12px rgba(6, 182, 212, 0.45)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <FolderOpen size={14} /> ファイル読み込み
            </button>
          </div>

          {/* 下段: サブ機能系 (QR作成・履歴・取説 - 3列) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '3px 4px',
            borderRadius: '9px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {/* 3. QR作成 */}
            <button
              className="btn nav-tab-btn"
              onClick={() => setActiveTab('generate')}
              style={{
                padding: '7px 2px',
                fontSize: '11.5px',
                fontWeight: 800,
                borderRadius: '7px',
                background: activeTab === 'generate' ? '#a855f7' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'generate' ? '#fff' : '#e2e8f0',
                border: `1.5px solid ${activeTab === 'generate' ? '#a855f7' : 'rgba(255, 255, 255, 0.12)'}`,
                boxShadow: activeTab === 'generate' ? '0 0 12px rgba(168, 85, 247, 0.45)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={13} /> QR作成
            </button>

            {/* 4. 履歴 */}
            <button
              className="btn nav-tab-btn"
              onClick={() => setActiveTab('history')}
              style={{
                padding: '7px 2px',
                fontSize: '11.5px',
                fontWeight: 800,
                borderRadius: '7px',
                background: activeTab === 'history' ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'history' ? '#000' : '#e2e8f0',
                border: `1.5px solid ${activeTab === 'history' ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)'}`,
                boxShadow: activeTab === 'history' ? '0 0 12px rgba(56, 189, 248, 0.45)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <History size={13} /> 履歴
            </button>

            {/* 5. 取説 */}
            <button
              className="btn nav-tab-btn"
              onClick={() => setActiveTab('manual')}
              style={{
                padding: '7px 2px',
                fontSize: '11.5px',
                fontWeight: 800,
                borderRadius: '7px',
                background: activeTab === 'manual' ? '#fbbf24' : 'rgba(255, 255, 255, 0.06)',
                color: activeTab === 'manual' ? '#000' : '#e2e8f0',
                border: `1.5px solid ${activeTab === 'manual' ? '#fbbf24' : 'rgba(255, 255, 255, 0.12)'}`,
                boxShadow: activeTab === 'manual' ? '0 0 12px rgba(251, 191, 36, 0.45)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <BookOpen size={13} /> 取説
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}


