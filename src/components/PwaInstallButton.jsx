import React from 'react';
import { Download, Smartphone, CheckCircle } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';

export function PwaInstallButton() {
  const { isInstallable, isInstalled, installApp } = usePwaInstall();

  if (isInstalled) {
    return (
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          fontSize: '0.75rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(0, 255, 102, 0.1)',
          border: '1px solid rgba(0, 255, 102, 0.3)',
          color: '#00FF66',
          fontWeight: 600
        }}
        title="PWAとしてインストール済みです"
      >
        <CheckCircle size={13} />
        <span>PWA起動中</span>
      </div>
    );
  }

  return (
    <button
      onClick={installApp}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: '#ffffff',
        background: 'linear-gradient(135deg, rgba(0, 255, 102, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)',
        border: '1px solid rgba(0, 255, 102, 0.4)',
        borderRadius: '8px',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(0, 255, 102, 0.15)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#00FF66';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 255, 102, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.4)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 255, 102, 0.15)';
      }}
      title="端末のホーム画面にアプリを追加します"
    >
      <Download size={14} color="#00FF66" />
      <span>ホーム画面に追加</span>
    </button>
  );
}
