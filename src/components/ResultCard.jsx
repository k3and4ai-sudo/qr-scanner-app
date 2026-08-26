import React, { useState } from 'react';
import { 
  CheckCircle2, Copy, ExternalLink, Check, RefreshCw, 
  ShieldCheck, ShieldAlert, ShieldX, ChevronDown, ChevronUp, AlertTriangle, X
} from 'lucide-react';
import { checkUrlSafety } from '../utils/urlSafety';

export default function ResultCard({ scanResult, onRescan, onClear, onShowLogs }) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  if (!scanResult) return null;

  const rawText = scanResult.rawValue || scanResult.value || '';
  const isUrl = scanResult.type === 'url' || rawText.startsWith('http://') || rawText.startsWith('https://');
  const safetyReport = isUrl ? checkUrlSafety(rawText) : null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenUrlClick = (e) => {
    if (safetyReport && (safetyReport.status === 'warning' || safetyReport.status === 'danger')) {
      e.preventDefault();
      setShowWarningModal(true);
    }
  };

  const confirmOpenUrl = () => {
    setShowWarningModal(false);
    window.open(rawText, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      background: '#04140c',
      padding: '14px',
      borderRadius: '14px',
      border: `2px solid ${safetyReport ? safetyReport.color : '#00FF66'}`,
      boxShadow: `0 0 24px ${safetyReport ? `${safetyReport.color}40` : 'rgba(0, 255, 102, 0.25)'}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      animation: 'fadeIn 0.3s ease-out',
      position: 'relative'
    }}>
      
      {/* 画面上部ステータスバー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{
          background: 'rgba(0, 255, 102, 0.18)',
          color: '#00FF66',
          border: '1.5px solid #00FF66',
          fontSize: '12px',
          fontWeight: 800,
          padding: '4px 10px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CheckCircle2 size={16} color="#00FF66" />
          {scanResult.type.toUpperCase()} デコード成功
        </span>
        <span style={{ fontSize: '11px', color: '#a7f3d0', fontWeight: 600 }}>⏱️ {scanResult.timestamp}</span>
      </div>

      {/* 読み取りデータ表示エリア */}
      <div>
        <div style={{ fontSize: '12px', color: '#6ee7b7', fontWeight: 700, marginBottom: '4px' }}>▼ 読み込みデータ (デコード結果):</div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.65)',
          padding: '12px 14px',
          borderRadius: '10px',
          fontFamily: 'monospace',
          fontSize: '16px',
          fontWeight: 800,
          color: '#00FF66',
          wordBreak: 'break-all',
          lineHeight: '1.4',
          border: '1.5px solid rgba(0, 255, 102, 0.4)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,255,102,0.15)'
        }}>
          {rawText}
        </div>
      </div>

      {/* 🛡️ URL 安全性スコア・脅威診断エリア */}
      {safetyReport && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: '12px',
          border: `1.5px solid ${safetyReport.color}`,
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {safetyReport.status === 'safe' && <ShieldCheck size={22} color="#00FF66" />}
              {safetyReport.status === 'warning' && <ShieldAlert size={22} color="#f59e0b" />}
              {safetyReport.status === 'danger' && <ShieldX size={22} color="#ef4444" />}
              <span style={{ fontSize: '15px', fontWeight: 800, color: safetyReport.color }}>
                {safetyReport.label}
              </span>
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: 800,
              background: 'rgba(0,0,0,0.5)',
              padding: '4px 10px',
              borderRadius: '6px',
              color: safetyReport.color,
              border: `1px solid ${safetyReport.color}`
            }}>
              安全スコア: {safetyReport.score} / 100
            </div>
          </div>

          {/* スコアプログレスバー */}
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${safetyReport.score}%`,
              height: '100%',
              background: safetyReport.color,
              transition: 'width 0.5s ease-out'
            }} />
          </div>

          <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>
            {safetyReport.summary}
          </div>

          {/* 診断アコーディオン切り替えボタン */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38bdf8',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
              marginTop: '2px'
            }}
          >
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showDetails ? 'セキュリティ診断項目を閉じる' : '詳細なセキュリティ診断項目を見る'}
          </button>

          {/* Diagnostics Log Console リンク */}
          {onShowLogs && (
            <button
              onClick={onShowLogs}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0,
                marginTop: '2px'
              }}
            >
              <ChevronDown size={16} /> Diagnostics Log Consoleを見る
            </button>
          )}

          {/* 詳細チェックアコーディオン */}
          {showDetails && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px', paddingTop: '10px', borderTop: '1px dashed rgba(255,255,255,0.15)' }}>
              {safetyReport.checks.map((chk, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span>{chk.safe ? '✅' : (chk.risk === 'high' ? '🔴' : '🟡')}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: chk.safe ? '#00FF66' : (chk.risk === 'high' ? '#ef4444' : '#f59e0b') }}>
                      {chk.title}
                    </div>
                    <div style={{ color: '#94a3b8', marginTop: '2px' }}>{chk.detail}</div>
                  </div>
                </div>
              ))}

              {/* 外部セキュリティ分析サービス連携 */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                  🔍 外部セキュリティデータベースでスキャン確認:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {safetyReport.securityLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ExternalLink size={12} /> {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL パラメータ構造 */}
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

      {/* アクションボタン群 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => handleCopy(rawText)}
            style={{ flex: 1, padding: '11px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            {copied ? <Check size={16} color="#00FF66" /> : <Copy size={16} />}
            {copied ? 'コピー完了' : 'コードをコピー'}
          </button>

          {isUrl && (
            <a 
              href={rawText} 
              target="_blank" 
              rel="noreferrer"
              onClick={handleOpenUrlClick}
              className="btn btn-primary"
              style={{ 
                flex: 1, 
                padding: '11px', 
                fontSize: '13px', 
                fontWeight: 700, 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '6px', 
                background: safetyReport && safetyReport.status === 'danger' ? '#ef4444' : (safetyReport && safetyReport.status === 'warning' ? '#f59e0b' : '#38bdf8') 
              }}
            >
              <ExternalLink size={16} /> 
              {safetyReport && safetyReport.status === 'danger' ? '⚠️ 危険なURLを開く' : (safetyReport && safetyReport.status === 'warning' ? '⚠️ 注意してURLを開く' : 'URL を開く')}
            </a>
          )}
        </div>

        {onRescan && (
          <button 
            className="btn btn-success"
            onClick={onRescan}
            style={{ width: '100%', padding: '13px', fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}
          >
            <RefreshCw size={18} /> もう一度スキャン
          </button>
        )}
      </div>

      {/* ⚠️ 安全警告インタラプトモーダル */}

      {showWarningModal && safetyReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: `2px solid ${safetyReport.color}`,
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: `0 0 40px ${safetyReport.color}50`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: safetyReport.color, fontSize: '18px', fontWeight: 800 }}>
                <AlertTriangle size={24} /> 安全警告: URLの確認
              </div>
              <button 
                onClick={() => setShowWarningModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#f8fafc', wordBreak: 'break-all', fontFamily: 'monospace' }}>
              {rawText}
            </div>

            <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
              このURLには不審な要素が含まれています:
              <ul style={{ margin: '8px 0 0 20px', padding: 0, color: safetyReport.color }}>
                {safetyReport.checks.filter(c => !c.safe).map((c, i) => (
                  <li key={i}>{c.title}: {c.detail}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <a
                href={safetyReport.securityLinks[0].url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ textAlign: 'center', textDecoration: 'none', padding: '12px', fontSize: '13px', fontWeight: 700 }}
              >
                🔍 Google Safe Browsing で安全性を事前に調べる
              </a>

              <button
                className="btn btn-danger"
                onClick={confirmOpenUrl}
                style={{ padding: '12px', fontSize: '13px', fontWeight: 700, background: safetyReport.color, borderColor: safetyReport.color }}
              >
                ⚠️ リスクを承知の上でアクセスする
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setShowWarningModal(false)}
                style={{ padding: '10px', fontSize: '13px' }}
              >
                キャンセルして開かない
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
