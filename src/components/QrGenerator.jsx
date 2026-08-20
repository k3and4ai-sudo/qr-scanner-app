import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Sparkles, Download, Copy, Check, RefreshCw, Palette } from 'lucide-react';

export default function QrGenerator() {
  const [text, setText] = useState('https://github.com');
  const [fgColor, setFgColor] = useState('#00FF66');
  const [bgColor, setBgColor] = useState('#090d16');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    generateQRCode();
  }, [text, fgColor, bgColor]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text || ' ', {
        width: 300,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor
        }
      });
    } catch (err) {
      console.error("QR Code generation error:", err);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-code-${Date.now()}.png`;
    a.click();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: '🌐 GitHub', value: 'https://github.com' },
    { label: '📱 LINE 公式', value: 'https://line.me' },
    { label: '📶 Wi-Fi 接続', value: 'WIFI:T:WPA;S:MyHomeWiFi;P:SecretPassword;;' },
    { label: '👤 vCard 名刺', value: 'BEGIN:VCARD\nVERSION:3.0\nN:山田;太郎\nTEL:090-1234-5678\nEND:VCARD' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ borderLeft: '4px solid #a855f7' }}>
        <h3 style={{ fontSize: '18px', color: '#a855f7', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={22} color="#a855f7" /> カスタム QR コード作成ツール
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px', lineHeight: '1.6' }}>
          URL、テキスト、Wi-Fi接続情報、名刺データなどから瞬時に高解像度 QR コードを生成し、PNG 画像としてダウンロードできます。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* 左側: 生成フォーム */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 700 }}>
            📝 QRコード化するデータ
          </h4>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              URL または 入力テキスト:
            </label>
            <textarea 
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '12px',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* サンプルプリセット */}
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>ワンタップ テンプレート:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  className="btn btn-secondary"
                  onClick={() => setText(p.value)}
                  style={{ padding: '6px 10px', fontSize: '11px' }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* カラーカスタマイズ */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
            <h5 style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={16} color="#a855f7" /> カラー カスタマイズ
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>QRコード色:</label>
                <input 
                  type="color" 
                  value={fgColor} 
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{ width: '100%', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>背景色:</label>
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: '100%', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* 右側: QRコード プレビュー & ダウンロード */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}>
          <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 700 }}>
            🖼️ リアルタイム プレビュー
          </h4>

          <div style={{
            background: bgColor,
            padding: '16px',
            borderRadius: '16px',
            border: '2px solid rgba(168, 85, 247, 0.4)',
            boxShadow: '0 0 25px rgba(168, 85, 247, 0.2)'
          }}>
            <canvas ref={canvasRef} style={{ borderRadius: '8px', display: 'block' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
            <button 
              className="btn btn-primary"
              onClick={handleDownload}
              style={{ flex: 1, padding: '12px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' }}
            >
              <Download size={16} /> PNG 保存
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleCopyText}
              style={{ padding: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {copied ? <Check size={16} color="#00FF66" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
