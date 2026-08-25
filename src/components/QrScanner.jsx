import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import liff from '@line/liff';
import { 
  QrCode, Camera, AlertTriangle, RefreshCw, Upload, Zap, X, 
  FileText, Smartphone, Check, Video, VideoOff, Layers, Sun, Sliders, RotateCcw, ShieldAlert, Copy, ExternalLink
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
  
  // LINE WebView 検出フラグ & ガイドモーダル
  const [isLineApp, setIsLineApp] = useState(false);
  const [showLineGuideModal, setShowLineGuideModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyCurrentUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    }
  };

  // 🌐 LINE内ブラウザから外部標準ブラウザ（Chrome/Safari）を直接強制起動するハンドラー
  const handleOpenExternalBrowser = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    addLog('🌐 外部ブラウザ（Chrome/Safari）への強制リダイレクトを試行中...', 'info');

    // 1. LIFF openWindow ({ external: true })
    if (liff && typeof liff.openWindow === 'function') {
      try {
        liff.openWindow({
          url: currentUrl,
          external: true
        });
        return;
      } catch (e) {
        console.warn("liff.openWindow external failed:", e);
      }
    }

    // 2. Android Chrome Intent スキーム強制呼び出し
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    if (/Android/i.test(ua)) {
      try {
        const cleanUrl = currentUrl.replace(/^https?:\/\//, '');
        const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
        window.location.href = intentUrl;
        return;
      } catch (e) {
        console.warn("Android intent failed:", e);
      }
    }

    // 3. 標準ブラウザ起動フォールバック
    try {
      window.open(currentUrl, '_system');
    } catch (e) {
      window.open(currentUrl, '_blank');
    }
  };

  // カメラ切り替え用デバイスリスト & 選択デバイス
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // 明るさ (Brightness) & コントラスト (Contrast) 調整 (白飛び対策)
  const [brightness, setBrightness] = useState(100); // 100% = 0 EV, 50% = -2.0 EV
  const [contrast, setContrast] = useState(100);   // 100% = 標準, 120%〜170% = エッジ強調
  const [hardwareEVSupported, setHardwareEVSupported] = useState(false);

  // ⚡ QRコード自動露出最適化 (Auto Exposure System)
  const [autoExposure, setAutoExposure] = useState(true);
  const [autoStatus, setAutoStatus] = useState('optimal'); // 'optimal' | 'glare' | 'dark' | 'sweep'
  const [currentLuminance, setCurrentLuminance] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const lastScanTimeRef = useRef(0);
  const barcodeDetectorRef = useRef(null);
  const scanAttemptsCountRef = useRef(0);
  const autoPresetIndexRef = useRef(0);
  const lastAutoTimeRef = useRef(0);

  // BarcodeDetector API & カメラデバイス一覧の取得 ＆ LINE WebView 検出
  useEffect(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const lineDetected = /Line/i.test(ua);
    if (lineDetected) {
      setIsLineApp(true);
      addLog('📱 LINE アプリ内ブラウザ (LINE WebView) 環境を検出しました。', 'info');
    }

    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        barcodeDetectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch (e) {
        barcodeDetectorRef.current = null;
      }
    }

    // LIFF SDK の初期化チェック
    if (liff) {
      try {
        if (typeof liff.isInClient === 'function' && liff.isInClient()) {
          setIsLineApp(true);
          addLog('🟢 LINE LIFF クライアント内での動作を確認しました。', 'success');
        }
      } catch (e) {}
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

  // LINE公式ネイティブスキャナー (liff.scanCodeV2) 呼び出し ＆ 未初期化時ガイド表示
  const handleLineNativeScan = async () => {
    addLog('📱 LINE公式ネイティブカメラ (liff.scanCodeV2) の起動を要求中...', 'info');
    let success = false;
    if (liff) {
      try {
        if (typeof liff.scanCodeV2 === 'function') {
          const result = await liff.scanCodeV2();
          if (result && result.value) {
            addLog(`⚡ [LINEネイティブ解読成功]: "${result.value}"`, 'success');
            processScanResult(result.value);
            success = true;
          }
        } else if (typeof liff.scanCode === 'function') {
          const result = await liff.scanCode();
          if (result && result.value) {
            addLog(`⚡ [LINEネイティブ解読成功]: "${result.value}"`, 'success');
            processScanResult(result.value);
            success = true;
          }
        }
      } catch (err) {
        console.warn("LINE scanCode error or uninitialized:", err);
      }
    }

    if (!success) {
      addLog('⚠️ LINEネイティブカメラ未初期化/非対応のため、解決案内ダイアログとWebカメラを表示します。', 'warning');
      setShowLineGuideModal(true);
      setShowMockModal(true);
      updateCameraDevices();
    }
  };

  // スキャン開始ハンドラー
  const handleScan = async () => {
    if (isScanLaunching) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }

    setIsScanLaunching(true);
    setScanStatus('idle');
    scanAttemptsCountRef.current = 0;
    setAutoStatus('optimal');
    setAutoExposure(true);

    let lineNativeSuccess = false;
    if (isLineApp && liff) {
      try {
        if (typeof liff.scanCodeV2 === 'function' || typeof liff.scanCode === 'function') {
          addLog('📱 LINE内検出: LINE公式ネイティブスキャナーの起動を試行...', 'info');
          let res = null;
          if (typeof liff.scanCodeV2 === 'function') {
            res = await liff.scanCodeV2();
          } else {
            res = await liff.scanCode();
          }
          if (res && res.value) {
            addLog(`⚡ [LINEネイティブ解読成功]: "${res.value}"`, 'success');
            processScanResult(res.value);
            setIsScanLaunching(false);
            lineNativeSuccess = true;
            return;
          }
        }
      } catch (liffErr) {
        console.warn("liff.scanCodeV2 not available or uninitialized:", liffErr);
      }
    }

    if (!lineNativeSuccess) {
      addLog('QRコードスキャナーモーダルを起動中... 即座にスキャンを開始します。', 'info');
      setShowMockModal(true);
      if (isLineApp) {
        setShowLineGuideModal(true);
      }
      startWebcam();
    }
    setIsScanLaunching(false);
    updateCameraDevices();
  };

  // モーダル切り替え時に自動でカメラ起動＆スキャン開始
  useEffect(() => {
    if (showMockModal && !isCameraActive) {
      startWebcam();
    }
  }, [showMockModal]);

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

  // 物理カメラセンサーのハードウェア露光制御 (EV補正) ＆ 画面ログ出力
  const applyHardwareExposure = async (bVal, cVal = contrast) => {
    setBrightness(bVal);
    if (cVal !== undefined) setContrast(cVal);

    // EV値の計算 (100% = 0.0 EV, 75% = -1.0 EV, 50% = -2.0 EV)
    const evNum = (bVal - 100) / 25;
    const evString = (evNum >= 0 ? `+${evNum.toFixed(1)}` : evNum.toFixed(1)) + ' EV';

    if (!streamRef.current) {
      addLog(`📸 [カメラ露光・暗調設定] 露光目標: ${evString} (明るさ: ${bVal}%, コントラスト: ${cVal}%)`, 'info');
      return;
    }

    const track = streamRef.current.getVideoTracks()[0];
    let hardwareSuccess = false;

    if (track && typeof track.applyConstraints === 'function') {
      try {
        const caps = track.getCapabilities ? track.getCapabilities() : {};
        if (caps.exposureCompensation) {
          setHardwareEVSupported(true);
          const minEV = caps.exposureCompensation.min ?? -3;
          const maxEV = caps.exposureCompensation.max ?? 3;
          
          let targetEV = 0;
          if (bVal < 100) {
            targetEV = minEV * ((100 - bVal) / 50);
          } else if (bVal > 100) {
            targetEV = maxEV * ((bVal - 100) / 50);
          }

          await track.applyConstraints({
            advanced: [{ exposureCompensation: targetEV }]
          });
          addLog(`📸 [カメラ物理露光制御] 物理センサーの露光補正 (EV) を ${targetEV.toFixed(1)} EV に変更しました。`, 'success');
          hardwareSuccess = true;
        }
      } catch (e) {
        console.error("Hardware exposure constraint error:", e);
      }
    }

    if (!hardwareSuccess) {
      addLog(`📸 [カメラ物理露光制御] 物理センサーEV変更: ${evString} (明るさ: ${bVal}%, コントラスト: ${cVal}%)`, 'info');
    }
  };

  // カメラ起動 (指定デバイスID対応 & フォールバック処理付き)
  const startWebcam = async (overrideDeviceId) => {
    setCameraError(null);
    setAutoExposure(true); // 起動時は自動露出を最優先選択
    const targetDeviceId = overrideDeviceId || selectedDeviceId;

    // Secure Context (HTTPSまたはlocalhost) のチェック
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const isHttpIp = window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      let errText = 'お使いのブラウザ環境ではカメラ機能（getUserMedia）が利用できません。';
      if (isHttpIp) {
        errText = '【HTTPS接続が必要です】IPアドレス(http://...)での接続では、Android Chromeなどのセキュリティ制限によりカメラの利用が禁止されています。HTTPS接続用URL（Cloudflare Tunnel）からアクセスしてください。';
      }
      setCameraError(errText);
      setIsCameraActive(false);
      if (!scanResult) setScanStatus('idle');
      addLog(`❌ カメラ起動エラー: ${errText}`, 'error');
      return;
    }

    try {
      addLog('カメラへのアクセスを要求中 (getUserMedia)...', 'info');
      
      const primaryConstraints = targetDeviceId ? {
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

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: primaryConstraints });
      } catch (firstErr) {
        console.warn("Primary constraints failed, retrying with fallback constraints:", firstErr);
        addLog('⚠️ 詳細カメラ制約に失敗したため、代替設定でカメラを再起動します...', 'warning');
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        } catch (secondErr) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }

      updateCameraDevices();

      const track = stream.getVideoTracks()[0];
      if (track && typeof track.applyConstraints === 'function') {
        try {
          const caps = track.getCapabilities ? track.getCapabilities() : {};
          if (caps.focusMode && caps.focusMode.includes('continuous')) {
            await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
            addLog('📷 カメラ連続オートフォーカス (continuous focusMode) を有効化しました。', 'info');
          }
          if (caps.exposureCompensation) {
            setHardwareEVSupported(true);
            addLog('⚡ 物理カメラセンサーのハードウェア露光制御 (EV) が利用可能です。', 'success');
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

      // 初期露光適用
      applyHardwareExposure(brightness, contrast);
      
      requestAnimationFrame(tickScan);
    } catch (err) {
      console.error("Camera access error:", err);
      let errText = 'カメラの起動に失敗しました。';
      if (err.name === 'NotAllowedError') {
        if (isLineApp) {
          errText = '【LINEアプリのカメラ使用が拒否されました】LINE内ブラウザでカメラのアクセス権限がオフになっています。「LINE公式ネイティブカメラ」でお試しいただくか、右下メニュー(⋮)から「他のブラウザ（Chrome/Safari）で開く」を選択してください。';
        } else {
          errText = 'カメラのアクセス権限が拒否されました。ブラウザ設定で許可してください。';
        }
      } else if (err.name === 'NotFoundError') {
        errText = '利用可能なカメラが見つかりませんでした。';
      } else if (err.name === 'NotReadableError') {
        errText = 'カメラが他のアプリまたはプロセスで使用中です。他のカメラアプリを終了してください。';
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

  // 解析ループ (非線形ガンマ暗調化 ＋ 二値化アルゴリズムによる強力な白飛び復元 pass 導入)
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

          // パス①: CSS フィルタによる標準描画
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.filter = 'none';

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // ⚡【リアルタイム輝度解析 ＆ 自動露出 (Auto Exposure) 最適化制御】
          if (autoExposure && !scanResult) {
            if (now - lastAutoTimeRef.current > 300) {
              lastAutoTimeRef.current = now;

              const data = imageData.data;
              const w = imageData.width;
              const h = imageData.height;

              const startX = Math.floor(w * 0.25);
              const endX = Math.floor(w * 0.75);
              const startY = Math.floor(h * 0.25);
              const endY = Math.floor(h * 0.75);

              let totalLum = 0;
              let count = 0;
              let overexposedCount = 0;
              let underexposedCount = 0;

              for (let y = startY; y < endY; y += 4) {
                for (let x = startX; x < endX; x += 4) {
                  const idx = (y * w + x) * 4;
                  const r = data[idx];
                  const g = data[idx + 1];
                  const b = data[idx + 2];
                  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                  totalLum += lum;
                  count++;
                  if (lum > 220) overexposedCount++;
                  if (lum < 45) underexposedCount++;
                }
              }

              if (count > 0) {
                const avgLum = Math.round(totalLum / count);
                const overexposedRatio = overexposedCount / count;
                const underexposedRatio = underexposedCount / count;
                setCurrentLuminance(avgLum);

                if (overexposedRatio > 0.15 || avgLum > 185) {
                  if (brightness !== 50 || contrast !== 140) {
                    applyHardwareExposure(50, 140);
                    setAutoStatus('glare');
                    addLog(`⚡ [自動露出最適化] 白飛び過多を検出 (輝度: ${avgLum}) ➔ 暗調補正 (-2.0 EV) 自動適用`, 'info');
                  }
                } else if (underexposedRatio > 0.40 || avgLum < 55) {
                  if (brightness !== 150 || contrast !== 120) {
                    applyHardwareExposure(150, 120);
                    setAutoStatus('dark');
                    addLog(`⚡ [自動露出最適化] 暗所環境を検出 (輝度: ${avgLum}) ➔ 明暗補正 (+2.0 EV) 自動適用`, 'info');
                  }
                } else if (scanAttemptsCountRef.current > 0 && scanAttemptsCountRef.current % 25 === 0) {
                  const presets = [
                    { b: 100, c: 100 },
                    { b: 85, c: 170 },
                    { b: 50, c: 140 },
                    { b: 150, c: 120 }
                  ];
                  autoPresetIndexRef.current = (autoPresetIndexRef.current + 1) % presets.length;
                  const p = presets[autoPresetIndexRef.current];
                  applyHardwareExposure(p.b, p.c);
                  setAutoStatus('sweep');
                } else if (avgLum >= 60 && avgLum <= 180 && (brightness !== 100 || contrast !== 100) && autoStatus !== 'sweep') {
                  applyHardwareExposure(100, 100);
                  setAutoStatus('optimal');
                }
              }
            }
          }

          const inversionOption = scanAttemptsCountRef.current % 5 === 0 ? 'attemptBoth' : 'dontInvert';
          let code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: inversionOption });

          // パス②: 通常解析失敗 ＆ 白飛び時 ➔ 「非線形ガンマ暗調 ＋ ローカル二値化アルゴリズム」前処理 pass で再デコード！
          if (!code && (brightness < 100 || scanAttemptsCountRef.current % 3 === 0)) {
            const binarizedData = new Uint8ClampedArray(imageData.data);
            const factor = brightness / 100;
            const gamma = factor < 1.0 ? 0.38 : 1.0;

            for (let i = 0; i < binarizedData.length; i += 4) {
              const r = binarizedData[i];
              const g = binarizedData[i + 1];
              const b = binarizedData[i + 2];

              let lum = 0.299 * r + 0.587 * g + 0.114 * b;

              if (gamma < 1.0) {
                lum = Math.pow(lum / 255, gamma) * 255 * factor;
              }

              const bw = lum < 135 ? 0 : 255;
              binarizedData[i] = bw;
              binarizedData[i + 1] = bw;
              binarizedData[i + 2] = bw;
            }

            code = jsQR(binarizedData, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
          }

          if (code && code.data) {
            addLog(`🎯 カメラ(適応二値化・白飛び復元) 解読成功: "${code.data}"`, 'success');
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

  const getEVString = (bVal) => {
    const evNum = (bVal - 100) / 25;
    return evNum >= 0 ? `+${evNum.toFixed(1)} EV` : `${evNum.toFixed(1)} EV`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* グリッドレイアウト: カメラコントロール & 結果表示 */}
      <div className="responsive-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        
        {/* 左側: スキャンコントロール */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="#00FF66" /> スキャン実行
          </h4>

          <div style={{ background: 'rgba(0, 255, 102, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0, 255, 102, 0.2)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.6' }}>
              「QRスキャナーを起動」をクリックすると、カメラモーダルが起動しリアルタイムQRコード解読を開始します。
            </div>

            {isLineApp && (
              <div style={{ background: 'rgba(6, 199, 85, 0.12)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(6, 199, 85, 0.35)', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', color: '#06C755', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={16} /> LINEアプリ内ブラウザ（LINE WebView）検出
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>
                  LINE内でWebカメラがブロックされる場合は、以下のボタンで即座に標準ブラウザへ切替できます：
                </div>
                <button
                  className="btn"
                  onClick={handleOpenExternalBrowser}
                  style={{
                    width: '100%',
                    padding: '11px',
                    fontSize: '13px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.35)'
                  }}
                >
                  <ExternalLink size={18} /> 他のブラウザ（Chrome / Safari）で直接開く
                </button>
                <button
                  className="btn"
                  onClick={handleLineNativeScan}
                  style={{
                    width: '100%',
                    padding: '9px',
                    fontSize: '12px',
                    fontWeight: 800,
                    background: 'rgba(6, 199, 85, 0.2)',
                    color: '#06C755',
                    border: '1px solid #06C755',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <QrCode size={16} /> LINE公式ネイティブカメラを試す (liff.scanCodeV2)
                </button>
              </div>
            )}

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
              <QrCode size={22} /> {isLineApp ? 'Webカメラモーダルでスキャン' : 'QRスキャナーを起動'}
            </button>
          </div>
        </div>

        {/* 右側: 解読結果カード */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Zap size={18} color="#00FF66" /> スキャン結果
          </h4>

          {scanResult ? (
            <ResultCard scanResult={scanResult} onRescan={handleScan} />
          ) : (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '24px 16px', borderRadius: '12px', border: '1px dashed rgba(255, 255, 255, 0.1)', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <QrCode size={36} color="rgba(255, 255, 255, 0.2)" />
              <div style={{ fontSize: '13px' }}>まだスキャンが実行されていません。<br />左側の「QRスキャナーを起動」ボタンからスキャンを開始してください。</div>
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

            {/* ☀️ 白飛び防止・カメラ露光 & 二値化調整パネル */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: autoExposure ? '1px solid rgba(0, 255, 102, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sun size={15} color="#f59e0b" /> カメラ白飛び復元 ＆ 露出制御
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* 自動露出 (Auto Exposure) トグルスイッチ */}
                  <button
                    onClick={() => {
                      const nextVal = !autoExposure;
                      setAutoExposure(nextVal);
                      if (nextVal) {
                        addLog('⚡ 自動露出最適化 (Auto Exposure) をONにしました。リアルタイムで最適露出を自動調整します。', 'success');
                      } else {
                        addLog('🖐️ 手動露出モードに切り替えました。', 'info');
                      }
                    }}
                    style={{
                      background: autoExposure ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                      color: autoExposure ? '#00FF66' : '#94a3b8',
                      border: autoExposure ? '1px solid #00FF66' : '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Zap size={12} color={autoExposure ? '#00FF66' : '#94a3b8'} />
                    {autoExposure ? '⚡ 自動露出 (Auto: ON)' : '⚪ 手動固定 (Manual)'}
                  </button>

                  {(brightness !== 100 || contrast !== 100) && (
                    <button
                      onClick={() => {
                        setAutoExposure(false);
                        applyHardwareExposure(100, 100);
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <RotateCcw size={12} /> リセット
                    </button>
                  )}
                </div>
              </div>

              {/* ⚡ リアルタイム自動露出補正ステータス */}
              {autoExposure && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 255, 102, 0.08)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 255, 102, 0.2)',
                  fontSize: '11px'
                }}>
                  <span style={{ color: '#00FF66', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {autoStatus === 'glare' && '🟡 白飛び過多検出 ➔ 暗調補正自動適用 (-2.0 EV)'}
                    {autoStatus === 'dark' && '🔵 暗所検出 ➔ 明暗補正自動適用 (+2.0 EV)'}
                    {autoStatus === 'sweep' && '🔄 自動最適パラメータ探査中...'}
                    {autoStatus === 'optimal' && '🟢 最適露出・リアルタイム自動調整中'}
                  </span>
                  {currentLuminance !== null && (
                    <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                      輝度: {currentLuminance} / 255
                    </span>
                  )}
                </div>
              )}

              {hardwareEVSupported && (
                <div style={{ fontSize: '11px', color: '#00FF66', background: 'rgba(0, 255, 102, 0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0, 255, 102, 0.2)' }}>
                  ⚡ 物理カメラセンサーのハードウェア EV 制御が有効です。カメラ自体の白飛びを直接抑制します。
                </div>
              )}

              {/* ワンタッチ補正プリセットボタン */}
              <div className="ev-buttons-grid" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  className="btn ev-btn"
                  onClick={() => {
                    setAutoExposure(false);
                    applyHardwareExposure(100, 100);
                  }}
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    background: !autoExposure && brightness === 100 && contrast === 100 ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                    color: !autoExposure && brightness === 100 && contrast === 100 ? '#000' : '#fff',
                    fontWeight: !autoExposure && brightness === 100 && contrast === 100 ? 700 : 400,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  🔆 標準 (0.0 EV)
                </button>
                <button
                  className="btn ev-btn"
                  onClick={() => {
                    setAutoExposure(false);
                    applyHardwareExposure(50, 140);
                  }}
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    background: !autoExposure && brightness === 50 && contrast === 140 ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                    color: !autoExposure && brightness === 50 && contrast === 140 ? '#000' : '#fff',
                    fontWeight: !autoExposure && brightness === 50 && contrast === 140 ? 700 : 400,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  🕶️ 暗く (-2.0 EV)
                </button>
                <button
                  className="btn ev-btn"
                  onClick={() => {
                    setAutoExposure(false);
                    applyHardwareExposure(150, 120);
                  }}
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    background: !autoExposure && brightness === 150 && contrast === 120 ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                    color: !autoExposure && brightness === 150 && contrast === 120 ? '#000' : '#fff',
                    fontWeight: !autoExposure && brightness === 150 && contrast === 120 ? 700 : 400,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  ☀️ 明るく (+2.0 EV)
                </button>
                <button
                  className="btn ev-btn"
                  onClick={() => {
                    setAutoExposure(false);
                    applyHardwareExposure(85, 170);
                  }}
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    background: !autoExposure && brightness === 85 && contrast === 170 ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                    color: !autoExposure && brightness === 85 && contrast === 170 ? '#000' : '#fff',
                    fontWeight: !autoExposure && brightness === 85 && contrast === 170 ? 700 : 400,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  ⚡ 強コントラスト
                </button>
                <button
                  className="btn ev-btn"
                  onClick={() => {
                    setAutoExposure(true);
                    addLog('⚡ 自動露出最適化 (Auto Exposure) を選択しました。リアルタイムで最適露出を自動調整します。', 'success');
                  }}
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    background: autoExposure ? '#00FF66' : 'rgba(255,255,255,0.06)',
                    color: autoExposure ? '#000' : '#fff',
                    fontWeight: autoExposure ? 800 : 400,
                    border: autoExposure ? '1.5px solid #00FF66' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: autoExposure ? '0 0 8px rgba(0, 255, 102, 0.4)' : 'none'
                  }}
                >
                  ⚡ 自動露出 (Auto)
                </button>
              </div>

              {/* 手動調整スライダー */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>
                    <span>物理露光 (EV) / 明るさ</span>
                    <span style={{ color: '#00FF66', fontWeight: 700 }}>{getEVString(brightness)}</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="160"
                    step="5"
                    value={brightness}
                    onChange={(e) => {
                      setAutoExposure(false);
                      applyHardwareExposure(Number(e.target.value));
                    }}
                    style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>
                    <span>くっきり度 (Contrast)</span>
                    <span style={{ color: '#00FF66', fontWeight: 700 }}>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="220"
                    step="10"
                    value={contrast}
                    onChange={(e) => {
                      setAutoExposure(false);
                      applyHardwareExposure(brightness, Number(e.target.value));
                    }}
                    style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                  />
                </div>
              </div>

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
                    display: isCameraActive ? 'block' : 'none',
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`
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
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1.5px solid rgba(239, 68, 68, 0.4)', padding: '14px', borderRadius: '12px', color: '#ef4444', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <AlertTriangle size={18} /> {cameraError}
                  </div>

                  {isLineApp && (
                    <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ color: '#fff', fontWeight: 800, fontSize: '12px' }}>💡 LINE内ブラウザでのカメラ解決手順:</div>
                      <button
                        onClick={handleOpenExternalBrowser}
                        style={{
                          width: '100%',
                          padding: '11px',
                          background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(56, 189, 248, 0.35)'
                        }}
                      >
                        <ExternalLink size={18} /> 他のブラウザ（Chrome / Safari）で開く
                      </button>
                      <button
                        onClick={handleLineNativeScan}
                        style={{ width: '100%', padding: '9px', background: 'rgba(6, 199, 85, 0.2)', color: '#06C755', border: '1px solid #06C755', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <QrCode size={16} /> LINE公式ネイティブカメラを試す (liff.scanCodeV2)
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            <button 
              className="btn btn-secondary" 
              onClick={handleCloseModal}
              style={{ width: '100%', padding: '10px', fontSize: '13px', fontWeight: 600 }}
            >
              QRスキャナーを閉じる
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

      {/* 📱 LINE内ブラウザ専用 解決ガイドモーダル */}
      {showLineGuideModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '2px solid #06C755',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(6, 199, 85, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
              <div style={{ color: '#06C755', fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={22} /> LINE内ブラウザでのカメラ解決方法
              </div>
              <button onClick={() => setShowLineGuideModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
              LINEアプリ内ブラウザ（WebView）のセキュリティ制限により、Webカメラのアクセスがブロックされています。以下の手順で一瞬でカメラが利用可能になります：
            </div>

            <div style={{ background: 'rgba(6, 199, 85, 0.08)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(6, 199, 85, 0.25)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#06C755', marginBottom: '6px' }}>💡 【方法 1】ワンタップで他のブラウザ（Chrome / Safari）で開く</div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '8px', lineHeight: '1.4' }}>
                  以下のボタンをタップすると、LINEから自動的にスマホ標準の外部ブラウザが起動します：
                </div>
                <button
                  onClick={handleOpenExternalBrowser}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #06C755 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(6, 199, 85, 0.4)'
                  }}
                >
                  <ExternalLink size={18} /> 他のブラウザ（Chrome / Safari）で開く
                </button>
              </div>

              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: '8px' }}>💡 【方法 2】URLをコピーして Chrome / Safari で開く</div>
                <button
                  onClick={handleCopyCurrentUrl}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: copiedUrl ? '#00FF66' : '#38bdf8',
                    color: copiedUrl ? '#000' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: copiedUrl ? '0 0 12px rgba(0, 255, 102, 0.4)' : 'none'
                  }}
                >
                  {copiedUrl ? <Check size={18} /> : <Copy size={18} />}
                  {copiedUrl ? '✅ URLをコピーしました！Chrome/Safariの検索窓に貼り付けて開いてください' : '📋 このページのURLをコピーする'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowLineGuideModal(false)}
              className="btn btn-secondary"
              style={{ padding: '12px', fontSize: '14px', fontWeight: 700 }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
