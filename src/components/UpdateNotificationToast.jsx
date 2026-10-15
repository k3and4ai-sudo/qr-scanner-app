import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, X } from 'lucide-react';
import { applyUpdate } from '../registerServiceWorker';

export function UpdateNotificationToast({ waitingWorker }) {
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (waitingWorker) {
      setVisible(true);
    }
  }, [waitingWorker]);

  if (!visible) return null;

  const handleUpdate = () => {
    setUpdating(true);
    applyUpdate(waitingWorker);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)',
      maxWidth: '430px',
      zIndex: 9999,
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 13, 22, 0.98) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid #00FF66',
        borderRadius: '14px',
        padding: '12px 14px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 255, 102, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        {/* 左側: アイコン & メッセージ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{
            background: 'rgba(0, 255, 102, 0.15)',
            borderRadius: '50%',
            padding: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00FF66',
            flexShrink: 0
          }}>
            <Bell size={18} className="animate-pulse" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              新バージョンがあります
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              最新機能と改善が利用可能です
            </div>
          </div>
        </div>

        {/* 右側: 更新ボタン & 閉じるボタン */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={handleUpdate}
            disabled={updating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 12px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#000000',
              background: '#00FF66',
              border: 'none',
              borderRadius: '8px',
              cursor: updating ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 10px rgba(0, 255, 102, 0.4)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <RefreshCw size={13} className={updating ? 'animate-spin' : ''} />
            <span>{updating ? '更新中...' : '今すぐ更新'}</span>
          </button>

          <button
            onClick={() => setVisible(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px'
            }}
            title="後で更新"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 20px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
