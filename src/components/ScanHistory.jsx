import React, { useState, useEffect } from 'react';
import { History, Trash2, Copy, ExternalLink, Check, Search, FileText } from 'lucide-react';
import { getScanHistory, clearScanHistory } from '../utils/storage';

export default function ScanHistory({ onSelectScan }) {
  const [history, setHistory] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm('スキャン履歴をすべて削除しますか？')) {
      const updated = clearScanHistory();
      setHistory(updated);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHistory = history.filter(item => 
    item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ borderLeft: '4px solid #38bdf8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '18px', color: '#38bdf8', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={22} color="#38bdf8" /> スキャン履歴 ({history.length}件)
          </h3>
          {history.length > 0 && (
            <button 
              className="btn btn-secondary" 
              onClick={handleClear}
              style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={14} /> 履歴クリア
            </button>
          )}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
          過去にスキャンしたQRコードの履歴はブラウザの LocalStorage に自動保存されます。
        </p>
      </div>

      {history.length > 0 && (
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="履歴内を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '10px 12px 10px 36px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          <History size={40} color="rgba(255,255,255,0.2)" style={{ marginBottom: '10px' }} />
          <div>{history.length === 0 ? 'スキャン履歴はまだありません。' : '検索条件に一致する履歴が見つかりませんでした。'}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredHistory.map((item) => (
            <div key={item.id} className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(15, 23, 42, 0.85)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: item.type === 'url' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0, 255, 102, 0.2)',
                  color: item.type === 'url' ? '#38bdf8' : '#00FF66',
                  border: `1px solid ${item.type === 'url' ? '#38bdf8' : '#00FF66'}`,
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {item.type.toUpperCase()}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{item.timestamp}</span>
              </div>

              <div style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 700,
                color: '#fff',
                wordBreak: 'break-all',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '10px',
                borderRadius: '8px'
              }}>
                {item.value}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleCopy(item.id, item.value)}
                  style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {copiedId === item.id ? <Check size={14} color="#00FF66" /> : <Copy size={14} />}
                  {copiedId === item.id ? 'コピー完了' : 'コピー'}
                </button>
                {item.type === 'url' && (
                  <a 
                    href={item.value}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', background: '#38bdf8' }}
                  >
                    <ExternalLink size={14} /> 開く
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
