const STORAGE_KEY = 'qr_master_scan_history';

export const getScanHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveScanToHistory = (item) => {
  try {
    const history = getScanHistory();
    // 重複防止 (直前と同じかつ1分以内ならスキップ)
    if (history.length > 0 && history[0].value === item.value && (Date.now() - history[0].timestampMs < 60000)) {
      return history;
    }
    const newItem = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      value: item.value,
      type: item.type || 'text',
      parsedData: item.parsedData || null,
      timestamp: new Date().toLocaleTimeString(),
      timestampMs: Date.now()
    };
    const updated = [newItem, ...history].slice(0, 50); // 最大50件保存
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const clearScanHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return [];
};

const CAMERA_PREF_KEY = 'qr_master_preferred_camera_id';

export const getPreferredCameraId = () => {
  try {
    return localStorage.getItem(CAMERA_PREF_KEY) || '';
  } catch (e) {
    return '';
  }
};

export const savePreferredCameraId = (deviceId) => {
  try {
    if (deviceId) {
      localStorage.setItem(CAMERA_PREF_KEY, deviceId);
    }
  } catch (e) {}
};

