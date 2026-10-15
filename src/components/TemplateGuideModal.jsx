import React, { useState } from 'react';
import { Wifi, User, HelpCircle, X, Check, ArrowRight, Info, ShieldCheck } from 'lucide-react';

export function TemplateGuideModal({ templateType, onClose, onApplyCustomText }) {
  // Wi-Fi 用入力ステート
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState('SecretPassword');
  const [wifiType, setWifiType] = useState('WPA'); // 'WPA' | 'WEP' | 'nopass'
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard 用入力ステート
  const [vcardLastName, setVcardLastName] = useState('山田');
  const [vcardFirstName, setVcardFirstName] = useState('太郎');
  const [vcardTel, setVcardTel] = useState('090-1234-5678');
  const [vcardEmail, setVcardEmail] = useState('yamada@example.com');
  const [vcardOrg, setVcardOrg] = useState('株式会社サンプル');
  const [vcardTitle, setVcardTitle] = useState('マネージャー');

  if (!templateType) return null;

  // Wi-Fi 文字列生成
  const generateWifiString = () => {
    let str = `WIFI:T:${wifiType};S:${wifiSsid};`;
    if (wifiType !== 'nopass' && wifiPass) {
      str += `P:${wifiPass};`;
    }
    if (wifiHidden) {
      str += `H:true;`;
    }
    str += ';';
    return str;
  };

  // vCard 文字列生成
  const generateVcardString = () => {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${vcardLastName};${vcardFirstName}`,
      `FN:${vcardLastName} ${vcardFirstName}`,
      `ORG:${vcardOrg}`,
      `TITLE:${vcardTitle}`,
      `TEL:${vcardTel}`,
      `EMAIL:${vcardEmail}`,
      'END:VCARD'
    ].join('\n');
  };

  const handleApplyWifi = () => {
    onApplyCustomText(generateWifiString());
    onClose();
  };

  const handleApplyVcard = () => {
    onApplyCustomText(generateVcardString());
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #090d16 100%)',
        border: `1.5px solid ${templateType === 'wifi' ? '#00FF66' : '#a855f7'}`,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '20px',
        boxShadow: `0 12px 40px rgba(0, 0, 0, 0.8), 0 0 20px ${templateType === 'wifi' ? 'rgba(0, 255, 102, 0.25)' : 'rgba(168, 85, 247, 0.25)'}`,
        position: 'relative'
      }}>
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* -------------------- Wi-Fi 解説 -------------------- */}
        {templateType === 'wifi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(0, 255, 102, 0.15)',
                padding: '10px',
                borderRadius: '10px',
                color: '#00FF66'
              }}>
                <Wifi size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#00FF66', fontWeight: 800 }}>
                  📶 Wi-Fi 接続 QRコードの書き方
                </h3>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  スマホカメラで読み取るとパスワード入力不要で即座に接続されます
                </div>
              </div>
            </div>

            {/* キーワード解説表 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} color="#00FF66" /> 各キーワードの意味とルール:
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px', color: '#cbd5e1' }}>
                <li><code style={{ color: '#00FF66', fontWeight: 700 }}>WIFI:</code> ➔ Wi-Fi設定データの開始を宣言</li>
                <li><code style={{ color: '#00FF66', fontWeight: 700 }}>T:</code> ➔ 暗号化方式（<code>WPA</code>, <code>WEP</code>, またはなし <code>nopass</code>）</li>
                <li><code style={{ color: '#00FF66', fontWeight: 700 }}>S:</code> ➔ 接続するネットワーク名（SSID）</li>
                <li><code style={{ color: '#00FF66', fontWeight: 700 }}>P:</code> ➔ 暗号化パスワード</li>
                <li><code style={{ color: '#00FF66', fontWeight: 700 }}>H:</code> ➔ ステルスSSIDの場合は <code>true</code>（通常は省略可）</li>
                <li><code style={{ color: '#00FF66', fontWeight: 700 }}>;;</code> ➔ 末尾の区切り記号（セミコロン2個）</li>
              </ul>
            </div>

            {/* 入力アシストフォーム */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(0, 255, 102, 0.3)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                ✍️ かんたん自動入力（ここに入力して反映）
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>ネットワーク名 (SSID):</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="例: MyHomeWiFi"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>セキュリティ方式:</label>
                  <select
                    value={wifiType}
                    onChange={(e) => setWifiType(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#090d16',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  >
                    <option value="WPA">WPA / WPA2 / WPA3 (標準)</option>
                    <option value="WEP">WEP (旧式)</option>
                    <option value="nopass">パスワードなし (オープン)</option>
                  </select>
                </div>
              </div>

              {wifiType !== 'nopass' && (
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Wi-Fi パスワード:</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="パスワードを入力"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </div>
              )}

              {/* 生成プレビュー */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '8px 10px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: '#00FF66',
                wordBreak: 'break-all'
              }}>
                {generateWifiString()}
              </div>

              <button
                onClick={handleApplyWifi}
                style={{
                  padding: '9px',
                  background: '#00FF66',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <Check size={16} />
                <span>この内容を QR コードに反映する</span>
              </button>
            </div>
          </div>
        )}

        {/* -------------------- vCard 解説 -------------------- */}
        {templateType === 'vcard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(168, 85, 247, 0.15)',
                padding: '10px',
                borderRadius: '10px',
                color: '#a855f7'
              }}>
                <User size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#a855f7', fontWeight: 800 }}>
                  👤 vCard 名刺 QRコードの書き方
                </h3>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  スマホカメラで読み取ると「連絡先に保存」が開き、ワンタップで電話帳に登録されます
                </div>
              </div>
            </div>

            {/* キーワード解説表 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} color="#a855f7" /> 各キーワードの意味とルール:
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px', color: '#cbd5e1' }}>
                <li><code style={{ color: '#a855f7', fontWeight: 700 }}>BEGIN:VCARD</code> / <code style={{ color: '#a855f7', fontWeight: 700 }}>END:VCARD</code> ➔ 名刺データの開始と終了宣言</li>
                <li><code style={{ color: '#a855f7', fontWeight: 700 }}>VERSION:3.0</code> ➔ vCardの規格バージョン</li>
                <li><code style={{ color: '#a855f7', fontWeight: 700 }}>N:姓;名</code> ➔ 氏名データ（セミコロンで姓と名を分割）</li>
                <li><code style={{ color: '#a855f7', fontWeight: 700 }}>FN:フルネーム</code> ➔ 連絡先一覧に表示される名前</li>
                <li><code style={{ color: '#a855f7', fontWeight: 700 }}>ORG:会社名</code> ➔ 勤務先や組織名</li>
                <li><code style={{ color: '#a855f7', fontWeight: 700 }}>TITLE:役職</code> ➔ 役職や肩書</li>
                <li><code style={{ color: '#a855f7', fontWeight: 700 }}>TEL:電話番号</code> ➔ 電話番号（携帯・代表等）</li>
                <li><code style={{ color: '#a855f7', fontWeight: 700 }}>EMAIL:アドレス</code> ➔ メールアドレス</li>
              </ul>
            </div>

            {/* 入力アシストフォーム */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                ✍️ 名刺データ自動生成（ここに入力して反映）
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>姓 (苗字):</label>
                  <input
                    type="text"
                    value={vcardLastName}
                    onChange={(e) => setVcardLastName(e.target.value)}
                    placeholder="例: 山田"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>名 (名前):</label>
                  <input
                    type="text"
                    value={vcardFirstName}
                    onChange={(e) => setVcardFirstName(e.target.value)}
                    placeholder="例: 太郎"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>電話番号:</label>
                  <input
                    type="text"
                    value={vcardTel}
                    onChange={(e) => setVcardTel(e.target.value)}
                    placeholder="例: 090-1234-5678"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>メールアドレス:</label>
                  <input
                    type="text"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    placeholder="例: info@example.com"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>会社名・組織:</label>
                  <input
                    type="text"
                    value={vcardOrg}
                    onChange={(e) => setVcardOrg(e.target.value)}
                    placeholder="例: 株式会社サンプル"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>役職:</label>
                  <input
                    type="text"
                    value={vcardTitle}
                    onChange={(e) => setVcardTitle(e.target.value)}
                    placeholder="例: 代表取締役 / 課長"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleApplyVcard}
                style={{
                  padding: '9px',
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <Check size={16} />
                <span>この名刺データを QR コードに反映する</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
