import React, { useState } from 'react';
import { CheckCircle2, Copy, ExternalLink, FileText, Sparkles, Check } from 'lucide-react';

export default function ResultCard({ scanResult }) {
  const [copied, setCopied] = useState(false);

  if (!scanResult) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: '#04140c',
      padding: '20px',
      borderRadius: '16px',
      border: '2.5px solid #00FF66',
      boxShadow: '0 0 30px rgba(0, 255, 102, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{
          background: 'rgba(0, 255, 102, 0.18)',
          color: '#00FF66',
          border: '1.5px solid #00FF66',
          fontSize: '14px',
          fontWeight: 800,
          padding: '6px 14px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CheckCircle2 size={18} color="#00FF66" />
          {scanResult.type.toUpperCase()} デコード成功
        </span>
        <span style={{ fontSize: '12px', color: '#a7f3d0', fontWeight: 600 }}>⏱️ 読み込み時刻: {scanResult.timestamp}</span>
      </div>

      {/* 超大文字フォント読み取り結果表示エリア */}
      <div>
        <div style={{ fontSize: '13px', color: '#6ee7b7', fontWeight: 700, marginBottom: '6px' }}>▼ 読み込みデータ (デコード結果):</div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.65)',
          padding: '16px 18px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '22px', // 大文字フォント
          fontWeight: 800,  // 超太字
          color: '#00FF66', // 明るい緑
          wordBreak: 'break-all',
          lineHeight: '1.45',
          border: '1.5px solid rgba(0, 255, 102, 0.4)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,255,102,0.15)'
        }}>
          {scanResult.rawValue || scanResult.value}
        </div>
      </div>

      {scanResult.type === 'url' && scanResult.parsedData && (
        <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '13px' }}>
          <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>🔗 URL パラメータ構造</div>
          <div><span style={{ color: '#94a3b8' }}>ホスト名:</span> <strong>{scanResult.parsedData.hostname}</strong></div>
          <div><span style={{ color: '#94a3b8' }}>パス:</span> {scanResult.parsedData.pathname}</div>
          {scanResult.parsedData.params && (
            <div style={{ marginTop: '6px' }}>
              <span style={{ color: '#94a3b8' }}>クエリパラメータ:</span>
              <pre style={{ margin: '4px 0 0 0', color: '#38bdf8', fontSize: '12px' }}>
                {JSON.stringify(scanResult.parsedData.params, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {scanResult.type === 'json' && scanResult.parsedData && (
        <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '13px' }}>
          <div style={{ fontWeight: 700, color: '#a855f7', marginBottom: '4px' }}>🧱 解析済み JSON パイロード</div>
          <pre style={{ margin: 0, color: '#a855f7', fontSize: '12px', overflowX: 'auto' }}>
            {JSON.stringify(scanResult.parsedData, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button 
          className="btn btn-secondary"
          onClick={() => handleCopy(scanResult.rawValue || scanResult.value)}
          style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {copied ? <Check size={16} color="#00FF66" /> : <Copy size={16} />}
          {copied ? 'コピー完了' : 'コードをコピー'}
        </button>

        {scanResult.type === 'url' && (
          <a 
            href={scanResult.rawValue || scanResult.value} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-primary"
            style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#38bdf8' }}
          >
            <ExternalLink size={16} /> URL を開く
          </a>
        )}
      </div>

    </div>
  );
}
