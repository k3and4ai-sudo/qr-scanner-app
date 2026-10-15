/**
 * スキャン履歴エクスポートユーティリティ (CSV / JSON)
 * Excelの日本語文字化け防止用 UTF-8 BOM 付き CSV 生成および整形 JSON 出力
 */

// CSV 特殊文字のエスケープ処理
function escapeCsvValue(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

// 日時文字列からファイル名用サフィックスを生成 (YYYYMMDD_HHmmss)
function getTimestampSuffix() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${y}${m}${d}_${h}${min}${s}`;
}

/**
 * 履歴データをCSV形式でダウンロード
 * @param {Array} items - エクスポート対象の履歴配列
 * @param {string} customFilename - 任意のファイル名
 */
export function exportToCsv(items, customFilename) {
  if (!items || items.length === 0) {
    alert('エクスポート対象の履歴データがありません。');
    return false;
  }

  const headers = [
    'ID',
    'スキャン日時',
    'タイトル',
    'コメント',
    'データ種別',
    '内容 / URL',
    '安全スコア',
    '安全評価',
    '状態'
  ];

  const rows = items.map(item => {
    const safetyScore = item.safety ? item.safety.score : (item.type === 'url' || (item.value && item.value.startsWith('http')) ? '未測定' : '対象外');
    const safetyLabel = item.safety ? item.safety.label : (item.type === 'url' || (item.value && item.value.startsWith('http')) ? '要確認' : 'テキスト');
    const status = item.isTrash ? 'ゴミ箱' : '通常保存';

    return [
      escapeCsvValue(item.id),
      escapeCsvValue(item.scanDateTime || item.timestamp || ''),
      escapeCsvValue(item.title || ''),
      escapeCsvValue(item.comment || ''),
      escapeCsvValue(item.type || 'text'),
      escapeCsvValue(item.value || ''),
      escapeCsvValue(safetyScore),
      escapeCsvValue(safetyLabel),
      escapeCsvValue(status)
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) を付与して Excel 等での日本語文字化けを完全防止
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = customFilename || `qr_scan_history_${getTimestampSuffix()}.csv`;

  triggerDownload(blob, filename);
  return true;
}

/**
 * 履歴データをJSON形式でダウンロード
 * @param {Array} items - エクスポート対象の履歴配列
 * @param {string} customFilename - 任意のファイル名
 */
export function exportToJson(items, customFilename) {
  if (!items || items.length === 0) {
    alert('エクスポート対象の履歴データがありません。');
    return false;
  }

  const jsonContent = JSON.stringify(items, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const filename = customFilename || `qr_scan_history_${getTimestampSuffix()}.json`;

  triggerDownload(blob, filename);
  return true;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
