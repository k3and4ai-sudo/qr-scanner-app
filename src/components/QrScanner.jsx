import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { 
  QrCode, Camera, AlertTriangle, RefreshCw, Upload, Zap, X, 
  FileText, Smartphone, Check, Video, VideoOff, Layers 
} from 'lucide-react';
import StatusLamp from './StatusLamp';
import ResultCard from './ResultCard';
import { playSuccessSound } from '../utils/sound';
import { saveScanToHistory } from '../utils/storage';

export default function QrScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle' | 'scanning' | 'success'
  const [showMockModal, setShowMockModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isScanLaunching, setIsScanLaunching] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // カメラ切り替え用デバイスリスト & 選択デバイス
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const lastScanTimeRef = useRef(0);
  const barcodeDetectorRef = useRef(null);
  const scanAttemptsCountRef = useRef(0);

  // BarcodeDetector API & カメラデバイス一覧の取得
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        barcodeDetectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch (e) {
        barcodeDetectorRef.current = null;
      }
    }
    updateCameraDevices();
    return () => stopWebcam();
  }, []);

  // 利用可能なカメラデバイスの一覧を取得
  const updateCameraDevices = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      }
    } catch (e) {
      console.error("Camera devices enumeration error:", e);
    }
  };

  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ time, msg, type }, ...prev]);
  };

  // スキャン開始ハンドラー
  const handleScan = () => {
    if (isScanLaunching) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }

    setIsScanLaunching(true);
    addLog('QRコードスキャナーモーダルを起動中...', 'info');

    if (!scanResult) setScanStatus('idle');
    setShowMockModal(true);
    setIsScanLaunching(false);
    updateCameraDevices();
  };

  // スキャン成功解析・データ構造化 & 履歴保存
  const processScanResult = (rawValue) => {
    if (!rawValue) return;

    setScanStatus('success');

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 40, 100]);
    }
    playSuccessSound();

    let resultType = 'text';
    let parsedData = null;

    if (rawValue.startsWith('http://') || rawValue.startsWith('https://')) {
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
    } else if (rawValue.startsWith('COUPON') || rawValue.startsWith('MEM') || rawValue.includes('DISCOUNT')) {
      resultType = 'badge';
    }

    const resObj = {
      rawValue,
      value: rawValue,
      type: resultType,
      parsedData,
      timestamp: new Date().toLocaleTimeString()
    };

    setScanResult(resObj);
    saveScanToHistory(resObj);
  };

  // カメラ起動 (指定デバイスID対応)
  const startWebcam = async (overrideDeviceId) => {
    setCameraError(null);
    const targetDeviceId = overrideDeviceId || selectedDeviceId;

    try {
      addLog('カメラへのアクセスを要求中 (getUserMedia)...', 'info');
      
      const videoConstraints = targetDeviceId ? {
        deviceId: { exact: targetDeviceId },
        width: { ideal: 1280, max: 1920 }, 
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30 }
      } : {
        facingMode: { ideal: 'environment' }, 
        width: { ideal: 1280, max: 1920 }, 
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30 }
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints
      });

      // カメラ名ラベルの更新
      updateCameraDevices();

      const track = stream.getVideoTracks()[0];
      if (track && typeof track.applyConstraints === 'function') {
        try {
          const caps = track.getCapabilities ? track.getCapabilities() : {};
          if (caps.focusMode && caps.focusMode.includes('continuous')) {
            await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
            addLog('📷 カメラ連続オートフォーカス (continuous focusMode) を有効化しました。', 'info');
          }
        } catch (e) {}
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      setScanStatus('scanning');

      if (barcodeDetectorRef.current) {
        addLog('⚡【超高速モード】BarcodeDetector (GPUハードウェア加速) でデコードを開始します。', 'success');
      } else {
        addLog('🟢 カメラ起動成功: jsQR 高速シングルパス解析を開始しました。', 'success');
      }
      
      requestAnimationFrame(tickScan);
    } catch (err) {
      console.error("Camera access error:", err);
      let errText = 'カメラの起動に失敗しました。';
      if (err.name === 'NotAllowedError') {
        errText = 'カメラのアクセス権限が拒否されました。ブラウザ設定で許可してください。';
      } else if (err.name === 'NotFoundError') {
        errText = '利用可能なカメラが見つかりませんでした。';
      }
      setCameraError(errText);
      setIsCameraActive(false);
      if (!scanResult) setScanStatus('idle');
      addLog(`❌ カメラ起動エラー: ${errText}`, 'error');
    }
  };

  // カメラ停止
  const stopWebcam = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    if (!scanResult) setScanStatus('idle');
  };

  // 解析ループ
  const tickScan = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      if (barcodeDetectorRef.current) {
        try {
          const barcodes = await barcodeDetectorRef.current.detect(video);
          if (barcodes && barcodes.length > 0) {
            const rawVal = barcodes[0].rawValue;
            if (rawVal) {
              addLog(`⚡ [BarcodeDetector (GPU加速)] 瞬時解読成功: "${rawVal}"`, 'success');
              stopWebcam();
              setShowMockModal(false);
              processScanResult(rawVal);
              return;
            }
          }
        } catch (err) {}
      }

      if (canvas) {
        const now = Date.now();
        if (now - lastScanTimeRef.current >= 40) {
          lastScanTimeRef.current = now;
          scanAttemptsCountRef.current += 1;

          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          const maxDim = 500;
          let targetWidth = video.videoWidth;
          let targetHeight = video.videoHeight;
          if (targetWidth > maxDim || targetHeight > maxDim) {
            if (targetWidth > targetHeight) {
              targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
              targetWidth = maxDim;
            } else {
              targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
              targetHeight = maxDim;
            }
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const inversionOption = scanAttemptsCountRef.current % 5 === 0 ? 'attemptBoth' : 'dontInvert';
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: inversionOption });

          if (code && code.data) {
            addLog(`🎯 カメラ(jsQR) 解読成功: "${code.data}"`, 'success');
            stopWebcam();
            setShowMockModal(false);
            processScanResult(code.data);
            return;
          }
        }
      }
    }

    if (streamRef.current) {
      animationFrameRef.current = requestAnimationFrame(tickScan);
    }
  };

  const handleCloseModal = () => {
    stopWebcam();
    setShowMockModal(false);
    if (!scanResult) setScanStatus('idle');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* グリッドレイアウト: カメラコントロール & 結果表示 (メイン初期画面にはステータスランプ非表示) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* 左側: スキャンコントロール */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="#00FF66" /> スキャンテスト実行
          </h4>

          <div style={{ background: 'rgba(0, 255, 102, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0, 255, 102, 0.2)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.6' }}>
              「スキャン開始」をクリックすると、カメラモーダルが起動しリアルタイムQRコード解読を開始します。
            </div>

            <button 
              className="btn btn-success" 
              onClick={handleScan}
              disabled={isScanLaunching}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <QrCode size={22} /> QRスキャナーを起動
            </button>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>⚡ 超高速デコード技術</div>
            <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>BarcodeDetector API:</strong> GPUアクセラレーションによるミリ秒単位検知</li>
              <li><strong>シングルパス解析:</strong> フレーム解読コストを半減し25FPSで動作</li>
            </ul>
          </div>
        </div>

        {/* 右側: 解読結果カード */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="#00FF66" /> スキャン結果
          </h4>

          {scanResult ? (
            <ResultCard scanResult={scanResult} />
          ) : (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '40px 20px', borderRadius: '12px', border: '1px dashed rgba(255, 255, 255, 0.1)', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <QrCode size={44} color="rgba(255, 255, 255, 0.2)" />
              <div style={{ fontSize: '14px' }}>まだスキャンが実行されていません。<br />左側のボタンからスキャンを開始してください。</div>
            </div>
          )}
        </div>

      </div>

      {/* カメラモーダル Overlay */}
      {showMockModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(0, 255, 102, 0.3)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            
            {/* モーダルヘッダー (タイトル: QRスキャナー) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00FF66', fontWeight: 800, fontSize: '16px' }}>
                <Video size={20} /> QRスキャナー
              </div>
              <button 
                onClick={handleCloseModal}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* 🟢 モーダル内ステータスランプ */}
            <StatusLamp status={scanStatus} />

            {/* 複数カメラ切り替えドロップダウンリスト */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={15} color="#00FF66" /> カメラデバイスの選択 (切り替え):
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedDeviceId(newId);
                  if (isCameraActive) {
                    stopWebcam();
                    startWebcam(newId);
                  }
                }}
                style={{
                  width: '100%',
                  background: '#090d16',
                  color: '#00FF66',
                  border: '1.5px solid rgba(0, 255, 102, 0.4)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {devices.length === 0 ? (
                  <option value="">デフォルトカメラ (環境カメラ / インカメラ)</option>
                ) : (
                  devices.map((device, idx) => (
                    <option key={device.deviceId || idx} value={device.deviceId}>
                      📷 {device.label || `カメラ ${idx + 1} (${device.deviceId.substring(0, 8)}...)`}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* リアルビデオプレビュー枠 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{
                position: 'relative',
                height: '240px',
                background: '#020617',
                borderRadius: '14px',
                border: `2px solid ${isCameraActive ? (scanStatus === 'success' ? '#00FF66' : '#f59e0b') : 'rgba(255, 255, 255, 0.2)'}`,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <video 
                  ref={videoRef} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: isCameraActive ? 'block' : 'none'
                  }} 
                />

                {!isCameraActive && (
                  <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '20px' }}>
                    <Camera size={44} color="#00FF66" style={{ marginBottom: '8px', opacity: 0.8 }} />
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                      カメラで QR コードをスキャン
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '14px' }}>
                      手元にある本物の QR コードをカメラにかざすと即座に解読します
                    </div>
                    <button 
                      className="btn btn-success"
                      onClick={() => startWebcam()}
                      style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Video size={16} /> カメラを起動してスキャンを開始
                    </button>
                  </div>
                )}

                {isCameraActive && (
                  <>
                    <div style={{ position: 'absolute', top: 30, left: 30, width: 28, height: 28, borderTop: '3px solid #00FF66', borderLeft: '3px solid #00FF66' }}></div>
                    <div style={{ position: 'absolute', top: 30, right: 30, width: 28, height: 28, borderTop: '3px solid #00FF66', borderRight: '3px solid #00FF66' }}></div>
                    <div style={{ position: 'absolute', bottom: 30, left: 30, width: 28, height: 28, borderBottom: '3px solid #00FF66', borderLeft: '3px solid #00FF66' }}></div>
                    <div style={{ position: 'absolute', bottom: 30, right: 30, width: 28, height: 28, borderBottom: '3px solid #00FF66', borderRight: '3px solid #00FF66' }}></div>

                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #00FF66, #4ade80, #00FF66, transparent)',
                      boxShadow: '0 0 14px #00FF66',
                      animation: 'scanLine 1.8s infinite ease-in-out'
                    }}></div>
                  </>
                )}
              </div>

              {isCameraActive && (
                <button
                  className="btn btn-secondary"
                  onClick={stopWebcam}
                  style={{ padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                >
                  <VideoOff size={14} /> カメラを停止する
                </button>
              )}

              {cameraError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '8px', color: '#ef4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> {cameraError}
                </div>
              )}

            </div>

            <button 
              className="btn btn-secondary" 
              onClick={handleCloseModal}
              style={{ width: '100%', padding: '10px', fontSize: '13px', fontWeight: 600 }}
            >
              カメラを閉じる
            </button>

          </div>
        </div>
      )}

      {/* 診断ログ */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            <Layers size={16} color="#38bdf8" /> Diagnostics Log Console
          </h4>
          <button className="btn btn-secondary" onClick={() => setLogs([])} style={{ padding: '4px 10px', fontSize: '11px' }}>
            クリア
          </button>
        </div>
        <div style={{ background: '#090d16', padding: '12px', borderRadius: '8px', maxHeight: '140px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {logs.length === 0 ? (
            <span style={{ color: '#64748b' }}>ログはまだありません。スキャンを実行するとイベントが記録されます。</span>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ color: log.type === 'error' ? '#ef4444' : log.type === 'warning' ? '#f59e0b' : log.type === 'success' ? '#00FF66' : '#38bdf8' }}>
                <span style={{ color: '#64748b', marginRight: '8px' }}>[{log.time}]</span>
                {log.msg}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
