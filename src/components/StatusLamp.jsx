import React from 'react';

/**
 * 🟢 QRコード読み込みステータスランプ (LED Lamp)
 * @param {'idle' | 'scanning' | 'success'} status
 */
export default function StatusLamp({ status = 'idle', style = {} }) {
  const isSuccess = status === 'success';
  const isScanning = status === 'scanning';

  return (
    <div style={{
      background: isSuccess 
        ? 'linear-gradient(135deg, rgba(6, 199, 85, 0.18) 0%, rgba(0, 255, 102, 0.1) 100%)' 
        : isScanning
        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(251, 191, 36, 0.1) 100%)'
        : 'rgba(255, 255, 255, 0.04)',
      border: `2px solid ${
        isSuccess ? '#00FF66' : isScanning ? '#f59e0b' : 'rgba(148, 163, 184, 0.4)'
      }`,
      borderRadius: '16px',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      boxShadow: isSuccess 
        ? '0 0 25px rgba(0, 255, 102, 0.3)' 
        : isScanning
        ? '0 0 16px rgba(245, 158, 11, 0.25)'
        : 'none',
      transition: 'all 0.3s ease',
      ...style
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* LED Lamp Circle (灰色 ➔ 黄色 ➔ 明るい緑) */}
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: isSuccess 
            ? '#00FF66' 
            : isScanning 
            ? '#f59e0b' 
            : '#64748b',
          boxShadow: isSuccess 
            ? '0 0 16px #00FF66, 0 0 32px #00FF66' 
            : isScanning 
            ? '0 0 14px #f59e0b' 
            : 'inset 0 2px 4px rgba(0,0,0,0.6)',
          border: `2px solid ${isSuccess ? '#ffffff' : 'transparent'}`,
          animation: isScanning ? 'pulse 0.9s infinite alternate' : isSuccess ? 'glowPulse 1.4s infinite' : 'none',
          transition: 'all 0.3s ease',
          flexShrink: 0
        }} />

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            QRコード読み込みステータスランプ
          </div>
          <div style={{
            fontSize: isSuccess ? '18px' : '15px',
            fontWeight: 800,
            color: isSuccess ? '#00FF66' : isScanning ? '#f59e0b' : '#94a3b8',
            marginTop: '2px'
          }}>
            {isSuccess && '🟢 QRコード読み込み完了！ (Scan Complete)'}
            {isScanning && '🟡 スキャン実行中... (カメラにQRコードをかざしてください)'}
            {!isSuccess && !isScanning && '⚪ 未読み込み (待機中)'}
          </div>
        </div>
      </div>

      <span style={{
        background: isSuccess ? '#00FF66' : isScanning ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
        color: isSuccess ? '#000' : isScanning ? '#000' : '#94a3b8',
        fontSize: '12px',
        fontWeight: 800,
        padding: '5px 14px',
        borderRadius: '20px',
        boxShadow: isSuccess ? '0 0 12px rgba(0,255,102,0.6)' : isScanning ? '0 0 10px rgba(245,158,11,0.5)' : 'none'
      }}>
        {isSuccess ? 'READ COMPLETE' : isScanning ? 'SCANNING...' : 'STANDBY'}
      </span>
    </div>
  );
}
