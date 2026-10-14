import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderOpen, Upload, Image as ImageIcon, AlertCircle, 
  RotateCcw, Sparkles, CheckCircle2, ShieldCheck, FileText
} from 'lucide-react';
import jsQR from 'jsqr';
import ResultCard from './ResultCard';
import { playSuccessSound } from '../utils/sound';
import { saveScanToHistory } from '../utils/storage';

export default function FileScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // クリップボードからの画像貼り付け (Ctrl+V / Paste) にも対応
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ファイル選択ハンドラー
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // 同じファイルを再選択できるようにリセット
    e.target.value = '';
  };

  // ドラッグ＆ドロップ
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // 画像ファイルの解析メインルーチン
  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('画像ファイル（JPEG, PNG, WEBP, GIF等）を選択してください。');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setScanResult(null);
    setErrorMessage(null);
    setIsAnalyzing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        let rawValue = null;

        // 1. ネイティブ BarcodeDetector API が利用可能な場合は最優先で試行 (GPUハードウェア加速)
        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
          try {
            const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
            const barcodes = await detector.detect(img);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              rawValue = barcodes[0].rawValue;
            }
          } catch (e) {
            console.warn('BarcodeDetector error on file, falling back to jsQR:', e);
          }
        }

        // 2. BarcodeDetector で未検出の場合、Canvas + jsQR による高精度マルチパス解析
        if (!rawValue) {
          rawValue = decodeWithJsQR(img);
        }

        if (rawValue) {
          handleDecodeSuccess(rawValue);
        } else {
          setErrorMessage('画像から QR コードを検出できませんでした。QR コードがはっきりと写っている画像（明るさ・ピントが良好なもの）をお試しください。');
        }
      } catch (err) {
        console.error('File scan error:', err);
        setErrorMessage('画像の読み込み中にエラーが発生しました。別の画像ファイルをお試しください。');
      } finally {
        setIsAnalyzing(false);
      }
    };

    img.onerror = () => {
      setIsAnalyzing(false);
      setErrorMessage('画像の読み込みに失敗しました。ファイルが破損していないかご確認ください。');
    };

    img.src = objectUrl;
  };

  // jsQR を用いたマルチ解像度・適応二値化解析
  const decodeWithJsQR = (img) => {
    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    // 高解像度スマホ写真向けにスケーリングリストを用意（オリジナル、1600px縮小、1000px縮小）
    const scales = [1.0];
    const maxDim = Math.max(img.width, img.height);
    if (maxDim > 1600) scales.push(1600 / maxDim);
    if (maxDim > 1000) scales.push(1000 / maxDim);

    for (const scale of scales) {
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);

      // パス 1: 標準シングルパス (通常明度 + 両反転試行)
      let code = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
      if (code && code.data) {
        return code.data;
      }

      // パス 2: 大津の適応二値化フィルター（白飛びや薄いQRコードの復元）
      const binarizedData = new Uint8ClampedArray(imageData.data.length);
      let sumLuminance = 0;
      const totalPixels = w * h;

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        sumLuminance += lum;
      }
      const avgLuminance = sumLuminance / totalPixels;

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const bin = lum > avgLuminance ? 255 : 0;
        binarizedData[i] = bin;
        binarizedData[i + 1] = bin;
        binarizedData[i + 2] = bin;
        binarizedData[i + 3] = 255;
      }

      code = jsQR(binarizedData, w, h, { inversionAttempts: 'attemptBoth' });
      if (code && code.data) {
        return code.data;
      }
    }

    return null;
  };

  // 解読成功時の処理
  const handleDecodeSuccess = (rawValue) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 40, 100]);
    }
    playSuccessSound();

    let resultType = 'text';
    let parsedData = null;

    if (rawValue.startsWith('http://') || rawValue.startsWith('https://') || rawValue.startsWith('line://')) {
      resultType = 'url';
      try {
        const urlObj = new URL(rawValue);
        const params = {};
        urlObj.searchParams.forEach((v, k) => { params[k] = v; });
        parsedData = {
          hostname: urlObj.hostname,
          pathname: urlObj.pathname,
          params: Object.keys(params).length > 0 ? params : null
        };
      } catch (e) {
        parsedData = null;
      }
    } else if (rawValue.startsWith('{') && rawValue.endsWith('}')) {
      try {
        parsedData = JSON.parse(rawValue);
        resultType = 'json';
      } catch (e) {
        resultType = 'text';
      }
    }

    const resObj = {
      value: rawValue,
      rawValue: rawValue,
      type: resultType,
      timestamp: new Date().toLocaleTimeString(),
      parsedData
    };

    setScanResult(resObj);
    saveScanToHistory({
      value: rawValue,
      type: resultType,
      parsedData
    });
  };

  const handleReset = () => {
    setScanResult(null);
    setSelectedFile(null);
    setErrorMessage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '30px' }}>
      {/* 隠しキャンバス（画像解析用） */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* ファイル選択入力 (ネイティブ) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: 'none' }}
      />

      {/* 画面ヘッダーカード */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
            padding: '6px',
            borderRadius: '8px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.4)'
          }}>
            <FolderOpen size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              画像ファイルから QR 読取
            </h2>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              スマホ内のフォルダ・アルバム・スクショから QR コードを解析
            </div>
          </div>
        </div>
      </div>

      {/* 解析結果表示カード (スキャン成功時) */}
      {scanResult && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <ResultCard
            scanResult={scanResult}
            onRescan={handleReset}
            onClear={handleReset}
          />
        </div>
      )}

      {/* エラーメッセージ表示 */}
      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1.5px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '12px',
          padding: '12px 14px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
          color: '#fca5a5',
          fontSize: '12.5px',
          lineHeight: '1.5',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: '#fee2e2', marginBottom: '2px' }}>
              QR コードが見つかりませんでした
            </div>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* ファイル選択・ドロップエリア */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          background: isDragOver ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.75)',
          border: isDragOver ? '2px dashed #06b6d4' : '2px dashed rgba(6, 182, 212, 0.45)',
          borderRadius: '16px',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          boxShadow: isDragOver ? '0 0 20px rgba(6, 182, 212, 0.25)' : 'none'
        }}
      >
        <div style={{
          background: 'rgba(6, 182, 212, 0.18)',
          padding: '14px',
          borderRadius: '50%',
          color: '#06b6d4',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 0 16px rgba(6, 182, 212, 0.2)'
        }}>
          <Upload size={28} />
        </div>

        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
            ここをタップして画像を選択
          </div>
          <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
            スマートフォン内の写真、フォルダ、アルバム、スクショ対応
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
            ※JPEG / PNG / WEBP / GIF / クリップボード貼り付け(Ctrl+V)対応
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          style={{
            marginTop: '4px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
            border: 'none',
            fontSize: '13px',
            fontWeight: 800,
            padding: '10px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 14px rgba(6, 182, 212, 0.4)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          <FolderOpen size={16} /> 端末の画像フォルダーを開く
        </button>
      </div>

      {/* 選択画像のプレビューとステータス表示 */}
      {previewUrl && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '14px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ImageIcon size={14} color="#06b6d4" /> 選択中画像プレビュー:
            </span>
            {selectedFile && (
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            )}
          </div>

          <div style={{
            position: 'relative',
            maxHeight: '240px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#020617',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <img
              src={previewUrl}
              alt="QRコード選択画像"
              style={{
                maxWidth: '100%',
                maxHeight: '240px',
                objectFit: 'contain'
              }}
            />

            {isAnalyzing && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#06b6d4',
                fontWeight: 800,
                fontSize: '13px'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  border: '3px solid rgba(6, 182, 212, 0.3)',
                  borderTopColor: '#06b6d4',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <div>QR コードを高速解析中...</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              style={{
                flex: 1,
                fontSize: '12px',
                padding: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} /> 別の画像を選ぶ
            </button>
          </div>
        </div>
      )}

      {/* ガイド・使い方のヒント */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        padding: '12px 14px',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        fontSize: '11.5px',
        color: '#94a3b8',
        lineHeight: '1.6'
      }}>
        <div style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          💡 ファイル読み込みの活用シーン
        </div>
        <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <li>メールやLINEで受信したQRコードのスクリーンショット</li>
          <li>Webサイトや電子チラシから端末に保存したQRコード画像</li>
          <li>LINE 友だち追加 QR 画像（読み取り後に「LINEで開く」ですぐに追加可能）</li>
        </ul>
      </div>
    </div>
  );
}
