import React, { useState, useEffect } from 'react';
import { 
  History, Trash2, Copy, ExternalLink, Check, Search, 
  ShieldCheck, ShieldAlert, ShieldX, Edit3, Save, X, RotateCcw, AlertTriangle, Clock, MessageSquare,
  FileSpreadsheet, FileJson
} from 'lucide-react';
import { 
  getScanHistory, getTrashHistory, updateHistoryItem, 
  moveToTrash, restoreFromTrash, permanentlyDelete, emptyTrash 
} from '../utils/storage';
import { exportToCsv, exportToJson } from '../utils/exportHistory';
import { checkUrlSafety } from '../utils/urlSafety';

export default function ScanHistory() {
  const [activeSubTab, setActiveSubTab] = useState('history'); // 'history' | 'trash'
  const [historyList, setHistoryList] = useState([]);
  const [trashList, setTrashList] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 編集中のアイテムIDと一時値
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editComment, setEditComment] = useState('');

  // ⚠️ 100点満点以外のURLアクセス警告モーダル用状態
  const [warningUrlItem, setWarningUrlItem] = useState(null);

  const refreshData = () => {
    setHistoryList(getScanHistory(false));
    setTrashList(getTrashHistory());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 編集開始
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title || '');
    setEditComment(item.comment || '');
  };

  // 編集保存
  const saveEditing = (id) => {
    updateHistoryItem(id, { title: editTitle, comment: editComment });
    setEditingId(null);
    refreshData();
  };

  // 編集キャンセル
  const cancelEditing = () => {
    setEditingId(null);
  };

  // ゴミ箱へ移動
  const handleMoveToTrash = (id) => {
    moveToTrash(id);
    refreshData();
  };

  // ゴミ箱から復元
  const handleRestore = (id) => {
    restoreFromTrash(id);
    refreshData();
  };

  // 完全削除
  const handleDeletePermanent = (id) => {
    if (window.confirm('このスキャン結果を完全に削除しますか？\n（復元できなくなります）')) {
      permanentlyDelete(id);
      refreshData();
    }
  };

  // ゴミ箱を空にする
  const handleEmptyTrash = () => {
    if (window.confirm('ゴミ箱内のすべてのアイテムを完全に削除しますか？')) {
      emptyTrash();
      refreshData();
    }
  };

  // URLジャンプ時の安全スコアチェックハンドラー
  const handleOpenUrl = (item) => {
    const safety = item.safety || checkUrlSafety(item.value);
    if (safety && safety.score === 100) {
      window.open(item.value, '_blank', 'noopener,noreferrer');
    } else {
      // 100点以外のURLは確認モーダルを表示
      setWarningUrlItem({
        url: item.value,
        title: item.title,
        safety: safety || {
          score: 0,
          status: 'danger',
          color: '#ef4444',
          checks: [{ title: '安全スコア未確認', detail: 'URL構文または安全確認が必要です。' }],
          securityLinks: []
        }
      });
    }
  };

  // 検索フィルター
  const currentItems = activeSubTab === 'history' ? historyList : trashList;
  const filteredList = currentItems.filter(item => 
    (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.comment && item.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.scanDateTime && item.scanDateTime.includes(searchTerm))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 上部ヘッダーカード */}
      <div className="card" style={{ borderLeft: '4px solid #38bdf8', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '17px', color: '#38bdf8', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} color="#38bdf8" /> スキャン履歴 ＆ メモ管理
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginTop: '4px', marginBottom: 0 }}>
              各スキャンにタイトルやコメントを記録できます。不要なデータはゴミ箱へ移動できます。
            </p>
          </div>

          {/* サブタブ切り替え (履歴 vs ゴミ箱) */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => setActiveSubTab('history')}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: activeSubTab === 'history' ? '#38bdf8' : 'transparent',
                color: activeSubTab === 'history' ? '#000' : '#94a3b8',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <History size={13} />
              <span>履歴一覧 ({historyList.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('trash')}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: activeSubTab === 'trash' ? '#ef4444' : 'transparent',
                color: activeSubTab === 'trash' ? '#fff' : '#94a3b8',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Trash2 size={13} />
              <span>ゴミ箱 ({trashList.length})</span>
            </button>
          </div>
        </div>

        {/* ツールバー: エクスポート & ゴミ箱操作 */}
        <div style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {/* CSV / JSON エクスポートボタン群 */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => exportToCsv(currentItems)}
              disabled={currentItems.length === 0}
              title="表示中の履歴をExcel互換のCSV形式（UTF-8 BOM付き）でダウンロード"
              style={{
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: currentItems.length > 0 ? '#00FF66' : '#64748b',
                background: currentItems.length > 0 ? 'rgba(0, 255, 102, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                border: currentItems.length > 0 ? '1px solid rgba(0, 255, 102, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                cursor: currentItems.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
            >
              <FileSpreadsheet size={13} />
              <span>CSV出力</span>
            </button>

            <button
              onClick={() => exportToJson(currentItems)}
              disabled={currentItems.length === 0}
              title="表示中の履歴をJSON形式でダウンロード"
              style={{
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: currentItems.length > 0 ? '#38bdf8' : '#64748b',
                background: currentItems.length > 0 ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                border: currentItems.length > 0 ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                cursor: currentItems.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
            >
              <FileJson size={13} />
              <span>JSON出力</span>
            </button>
          </div>

          {/* ゴミ箱全消去ボタン (ゴミ箱タブ選択時) */}
          {activeSubTab === 'trash' && trashList.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              style={{
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Trash2 size={13} />
              <span>ゴミ箱を空にする</span>
            </button>
          )}
        </div>
      </div>

      {/* 検索バー */}
      {currentItems.length > 0 && (
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder={activeSubTab === 'history' ? "タイトル、コメント、URL、日時で検索..." : "ゴミ箱内を検索..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '9px 12px 9px 36px',
              color: '#fff',
              fontSize: '12.5px',
              outline: 'none'
            }}
          />
        </div>
      )}

      {/* リストが空の場合 */}
      {filteredList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          {activeSubTab === 'history' ? (
            <>
              <History size={36} color="rgba(255,255,255,0.2)" style={{ marginBottom: '8px' }} />
              <div>{historyList.length === 0 ? 'スキャン履歴はまだありません。' : '検索に一致する履歴がありません。'}</div>
            </>
          ) : (
            <>
              <Trash2 size={36} color="rgba(255,255,255,0.2)" style={{ marginBottom: '8px' }} />
              <div>ゴミ箱は空です。</div>
            </>
          )}
        </div>
      ) : (
        /* カード一覧 */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredList.map((item) => {
            const isEditing = editingId === item.id;
            const safety = item.safety;

            return (
              <div 
                key={item.id} 
                className="card" 
                style={{ 
                  padding: '14px 16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '10px', 
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: activeSubTab === 'trash' ? '1px dashed rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {/* 1行目: タイトル & 編集/ゴミ箱ボタン */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  {isEditing ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', color: '#94a3b8' }}>タイトル:</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="タイトルを入力..."
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1.5px solid #38bdf8',
                          borderRadius: '8px',
                          padding: '9px 12px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 800, 
                        color: '#ffffff', 
                        lineHeight: 1.3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>{item.title || '（無題のスキャン）'}</span>
                      </div>
                    </div>
                  )}

                  {/* 右側アクション（通常時: 編集ボタン・ゴミ箱ボタン） */}
                  {activeSubTab === 'history' && !isEditing && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => startEditing(item)}
                        title="タイトル・コメントを編集"
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#94a3b8',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px'
                        }}
                      >
                        <Edit3 size={13} />
                        <span>編集</span>
                      </button>

                      <button
                        onClick={() => handleMoveToTrash(item.id)}
                        title="ゴミ箱へ移動"
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#f87171',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* 2行目: バッジ群（種別・安全スコア・日時） */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                  {/* 種別バッジ */}
                  <span style={{
                    background: item.type === 'url' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0, 255, 102, 0.2)',
                    color: item.type === 'url' ? '#38bdf8' : '#00FF66',
                    border: `1px solid ${item.type === 'url' ? '#38bdf8' : '#00FF66'}`,
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px'
                  }}>
                    {item.type ? item.type.toUpperCase() : 'TEXT'}
                  </span>

                  {/* 安全度バッジ */}
                  {safety && (
                    <span style={{
                      background: `${safety.color}18`,
                      color: safety.color,
                      border: `1px solid ${safety.color}`,
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {safety.status === 'safe' && <ShieldCheck size={12} />}
                      {safety.status === 'warning' && <ShieldAlert size={12} />}
                      {safety.status === 'danger' && <ShieldX size={12} />}
                      スコア: {safety.score}点 ({safety.statusText || '安全診断'})
                    </span>
                  )}

                  {/* スキャン日時 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#94a3b8',
                    marginLeft: 'auto'
                  }}>
                    <Clock size={12} color="#64748b" />
                    <span>{item.scanDateTime || item.timestamp}</span>
                  </div>
                </div>

                {/* 3行目: コメントエリア */}
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600 }}>コメント / メモ:</label>
                    <textarea
                      rows={4}
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      placeholder="メモや備考を自由に入力..."
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        border: '1.5px solid #38bdf8',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }}>
                      <button
                        onClick={cancelEditing}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <X size={12} /> キャンセル
                      </button>
                      <button
                        onClick={() => saveEditing(item.id)}
                        className="btn btn-primary"
                        style={{ padding: '4px 12px', fontSize: '11px', background: '#38bdf8', color: '#000', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Save size={12} /> 保存
                      </button>
                    </div>
                  </div>
                ) : (
                  item.comment && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '6px',
                      background: 'rgba(56, 189, 248, 0.08)',
                      borderLeft: '2px solid #38bdf8',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#cbd5e1'
                    }}>
                      <MessageSquare size={13} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'pre-wrap' }}>{item.comment}</span>
                    </div>
                  )
                )}

                {/* 4行目: スキャンした生テキスト/URL */}
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  wordBreak: 'break-all',
                  background: 'rgba(0, 0, 0, 0.45)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  {item.value}
                </div>

                {/* 5行目: アクションボタン列 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  {activeSubTab === 'history' ? (
                    <>
                      <div>
                        {!item.comment && !isEditing && (
                          <button
                            onClick={() => startEditing(item)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: 0
                            }}
                          >
                            <MessageSquare size={12} />
                            <span>＋ コメントを追加</span>
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleCopy(item.id, item.value)}
                          style={{ padding: '5px 10px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiedId === item.id ? <Check size={13} color="#00FF66" /> : <Copy size={13} />}
                          <span>{copiedId === item.id ? 'コピー完了' : 'コピー'}</span>
                        </button>

                        {(item.type === 'url' || item.value.startsWith('http')) && (
                          <button 
                            onClick={() => handleOpenUrl(item)}
                            className="btn btn-primary"
                            style={{ 
                              padding: '5px 12px', 
                              fontSize: '11.5px', 
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              background: safety && safety.status === 'danger' ? '#ef4444' : (safety && safety.score === 100 ? '#00FF66' : '#f59e0b'),
                              color: safety && safety.status === 'danger' ? '#fff' : '#000'
                            }}
                          >
                            <ExternalLink size={13} />
                            <span>開く</span>
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    /* ゴミ箱タブ時: 復元 & 完全削除 */
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
                      <button
                        onClick={() => handleRestore(item.id)}
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          color: '#38bdf8',
                          borderRadius: '6px',
                          padding: '5px 12px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RotateCcw size={13} />
                        <span>元に戻す</span>
                      </button>

                      <button
                        onClick={() => handleDeletePermanent(item.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#ef4444',
                          borderRadius: '6px',
                          padding: '5px 12px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={13} />
                        <span>完全に削除</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ⚠️ 安全スコア100点以外のURLアクセス確認モーダル */}
      {warningUrlItem && (
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
            border: `2px solid ${warningUrlItem.safety.color || '#f59e0b'}`,
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: `0 0 40px ${(warningUrlItem.safety.color || '#f59e0b')}50`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: warningUrlItem.safety.color || '#f59e0b', fontSize: '18px', fontWeight: 800 }}>
                <AlertTriangle size={24} /> ⚠️ 安全確認: URLへのアクセス
              </div>
              <button 
                onClick={() => setWarningUrlItem(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#f8fafc', wordBreak: 'break-all', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.1)' }}>
              {warningUrlItem.url}
            </div>

            <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>安全スコア:</span>
                <span style={{
                  background: `${warningUrlItem.safety.color || '#f59e0b'}22`,
                  color: warningUrlItem.safety.color || '#f59e0b',
                  border: `1.5px solid ${warningUrlItem.safety.color || '#f59e0b'}`,
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontWeight: 800,
                  fontSize: '13.5px'
                }}>
                  {warningUrlItem.safety.score} / 100点
                </span>
                <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>（100点満点以外の警告）</span>
              </div>

              {warningUrlItem.safety.checks && warningUrlItem.safety.checks.filter(c => !c.safe).length > 0 ? (
                <div>
                  <div style={{ fontSize: '12.5px', color: '#94a3b8', marginBottom: '4px' }}>検出された注意項目:</div>
                  <ul style={{ margin: '4px 0 0 18px', padding: 0, color: warningUrlItem.safety.color || '#f59e0b', fontSize: '13px' }}>
                    {warningUrlItem.safety.checks.filter(c => !c.safe).map((c, i) => (
                      <li key={i} style={{ marginTop: '2px' }}><strong>{c.title}:</strong> {c.detail}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  このURLは完全な100点満点の検証基準を満たしていません。リンク先が信頼できるかご確認の上アクセスしてください。
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              {warningUrlItem.safety.securityLinks && warningUrlItem.safety.securityLinks[0] && (
                <a
                  href={warningUrlItem.safety.securityLinks[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ textAlign: 'center', textDecoration: 'none', padding: '10px', fontSize: '12.5px', fontWeight: 700 }}
                >
                  🔍 Google Safe Browsing で安全性を事前確認
                </a>
              )}

              <button
                className="btn btn-danger"
                onClick={() => {
                  const targetUrl = warningUrlItem.url;
                  setWarningUrlItem(null);
                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                }}
                style={{
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: warningUrlItem.safety.color || '#f59e0b',
                  borderColor: warningUrlItem.safety.color || '#f59e0b'
                }}
              >
                ⚠️ リスクを承知の上でアクセスする
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setWarningUrlItem(null)}
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
