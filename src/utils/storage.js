import { checkUrlSafety } from './urlSafety';

const STORAGE_KEY = 'qr_master_scan_history';

// 日時フォーマット YYYY/MM/DD HH:mm:ss
const formatFullDateTime = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}/${m}/${d} ${h}:${min}:${s}`;
};

// スキャン内容に応じた自動デフォルトタイトルの生成
const generateDefaultTitle = (value, type, parsedData) => {
  if (type === 'url' || value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const url = new URL(value);
      if (url.hostname.includes('line.me')) return '📱 LINE 公式・友だち追加';
      return `🌐 ${url.hostname}`;
    } catch (e) {
      return '🌐 Web サイトリンク';
    }
  }
  if (value.startsWith('WIFI:') || type === 'wifi') {
    const ssidMatch = value.match(/S:([^;]+)/);
    const ssid = ssidMatch ? ssidMatch[1] : (parsedData?.ssid || '設定');
    return `📶 Wi-Fi 接続 (${ssid})`;
  }
  if (value.startsWith('BEGIN:VCARD') || type === 'vcard') {
    const nameMatch = value.match(/N:([^;\n]+)/) || value.match(/FN:([^\n]+)/);
    const name = nameMatch ? nameMatch[1].replace(/;/g, ' ') : (parsedData?.name || '');
    return name ? `👤 名刺 (${name})` : '👤 vCard 連絡先データ';
  }
  // テキストの場合、先頭25文字
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > 25 ? clean.substring(0, 25) + '...' : clean;
};

// 履歴の取得 (デフォルトはゴミ箱以外)
export const getScanHistory = (includeTrash = false) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    // 既存データの互換性対応
    const normalized = list.map(item => ({
      ...item,
      title: item.title !== undefined ? item.title : generateDefaultTitle(item.value, item.type, item.parsedData),
      comment: item.comment || '',
      scanDateTime: item.scanDateTime || (item.timestampMs ? formatFullDateTime(new Date(item.timestampMs)) : formatFullDateTime()),
      isTrash: !!item.isTrash,
      safety: item.safety || (item.type === 'url' || item.value.startsWith('http') ? checkUrlSafety(item.value) : null)
    }));
    return includeTrash ? normalized : normalized.filter(item => !item.isTrash);
  } catch (e) {
    return [];
  }
};

// ゴミ箱のアイテムのみ取得
export const getTrashHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list
      .map(item => ({
        ...item,
        title: item.title !== undefined ? item.title : generateDefaultTitle(item.value, item.type, item.parsedData),
        comment: item.comment || '',
        scanDateTime: item.scanDateTime || (item.timestampMs ? formatFullDateTime(new Date(item.timestampMs)) : formatFullDateTime()),
        isTrash: !!item.isTrash,
        safety: item.safety || (item.type === 'url' || item.value.startsWith('http') ? checkUrlSafety(item.value) : null)
      }))
      .filter(item => !!item.isTrash);
  } catch (e) {
    return [];
  }
};

// スキャン結果を履歴に保存
export const saveScanToHistory = (item) => {
  try {
    const history = getScanHistory(true); // 全件取得
    const now = new Date();

    // 直近と同じ値かつ1分以内の重複登録を防止
    if (history.length > 0 && history[0].value === item.value && !history[0].isTrash && (Date.now() - history[0].timestampMs < 60000)) {
      return history.filter(i => !i.isTrash);
    }

    const isUrl = item.type === 'url' || item.value.startsWith('http://') || item.value.startsWith('https://');
    const safety = isUrl ? checkUrlSafety(item.value) : null;

    const newItem = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      title: item.title || generateDefaultTitle(item.value, item.type || 'text', item.parsedData),
      comment: item.comment || '',
      value: item.value,
      type: item.type || 'text',
      parsedData: item.parsedData || null,
      scanDateTime: formatFullDateTime(now),
      timestamp: now.toLocaleTimeString(),
      timestampMs: now.getTime(),
      safety,
      isTrash: false
    };

    const updated = [newItem, ...history].slice(0, 100); // 最大100件保存
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.filter(i => !i.isTrash);
  } catch (e) {
    console.error("Save scan history failed:", e);
    return [];
  }
};

// アイテムのメタデータ（タイトル・コメント）更新
export const updateHistoryItem = (id, updates = {}) => {
  try {
    const list = getScanHistory(true);
    const updated = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: updates.title !== undefined ? updates.title : item.title,
          comment: updates.comment !== undefined ? updates.comment : item.comment
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

// ゴミ箱へ移動
export const moveToTrash = (id) => {
  try {
    const list = getScanHistory(true);
    const updated = list.map(item => item.id === id ? { ...item, isTrash: true, trashedAt: Date.now() } : item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

// ゴミ箱から復元
export const restoreFromTrash = (id) => {
  try {
    const list = getScanHistory(true);
    const updated = list.map(item => item.id === id ? { ...item, isTrash: false, trashedAt: null } : item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

// 個別完全削除
export const permanentlyDelete = (id) => {
  try {
    const list = getScanHistory(true);
    const updated = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

// ゴミ箱を一括クリア
export const emptyTrash = () => {
  try {
    const list = getScanHistory(true);
    const updated = list.filter(item => !item.isTrash);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

// 履歴全体をクリア
export const clearScanHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return [];
};

// カメラ優先設定
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
