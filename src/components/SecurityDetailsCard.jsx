import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { checkUrlSafety } from '../utils/urlSafety';

export default function SecurityDetailsCard({ scanResult, onBack }) {
  if (!scanResult) return null;

  const rawText = scanResult.rawValue || scanResult.value || '';
  const safetyReport = scanResult.type === 'url' || rawText.startsWith('http') 
    ? checkUrlSafety(rawText) 
    : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px' }}>
      
      {/* 画面ヘッダー: タイトル & 戻るボタン */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <ShieldCheck size={20} color="#38bdf8" /> 詳細セキュリティ診断
        </h4>
        <button 
          className="btn btn-primary" 
          onClick={onBack} 
          style={{ padding: '5px 10px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={14} /> スキャン結果に戻る
        </button>
      </div>

      {/* 対象URL表示 */}
      <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>診断対象データ:</div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#00FF66', wordBreak: 'break-all', fontFamily: 'monospace' }}>
          {rawText}
        </div>
      </div>

      {safetyReport ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* 安全性スコア概要 */}
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

            <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: '1.4' }}>
              {safetyReport.summary}
            </div>
          </div>

          {/* 🔍 詳細診断項目リスト */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> セキュリティ検証チェック結果
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {safetyReport.checks.map((chk, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <span style={{ fontSize: '14px', lineHeight: 1 }}>{chk.safe ? '✅' : (chk.risk === 'high' ? '🔴' : '🟡')}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: chk.safe ? '#00FF66' : (chk.risk === 'high' ? '#ef4444' : '#f59e0b') }}>
                      {chk.title}
                    </div>
                    <div style={{ color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>{chk.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 外部セキュリティ分析サービス連携 */}
          <div style={{ marginTop: '4px', background: 'rgba(56, 189, 248, 0.06)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', marginBottom: '8px' }}>
              🔍 外部セキュリティデータベース照合:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {safetyReport.securityLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '6px',
                    padding: '6px 11px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flex: '1 1 calc(50% - 4px)',
                    justifyContent: 'center'
                  }}
                >
                  <ExternalLink size={13} /> {link.name}
                </a>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
          URL以外のテキストデータのためセキュリティ診断項目はありません。
        </div>
      )}

      {/* 下部 戻るボタン */}
      <button 
        className="btn btn-secondary" 
        onClick={onBack}
        style={{ width: '100%', padding: '11px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}
      >
        <ArrowLeft size={16} /> スキャン結果画面に戻る
      </button>

    </div>
  );
}
