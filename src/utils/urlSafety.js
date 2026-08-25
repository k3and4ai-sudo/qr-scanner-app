/**
 * URL Safety & Threat Analysis Utility for QR Code Scanner
 */

// 信頼性の高いメジャーTLDおよびドメインリスト
const KNOWN_SAFE_DOMAINS = [
  'google.com', 'google.co.jp', 'youtube.com', 'github.com', 'wikipedia.org',
  'yahoo.co.jp', 'amazon.co.jp', 'amazon.com', 'apple.com', 'line.me',
  'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'microsoft.com'
];

// 高リスクの可能性が高いTLD（トップレベルドメイン）
const SUSPICIOUS_TLDS = [
  '.zip', '.mov', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.work', 
  '.click', '.download', '.racing', '.rest', '.fit', '.party', '.country'
];

// 危険な拡張子（マルウェア・スクリプト配布）
const DANGEROUS_EXTENSIONS = [
  '.exe', '.apk', '.bat', '.cmd', '.sh', '.vbs', '.scr', '.ps1', 
  '.zip', '.rar', '.7z', '.iso', '.dmg', '.msi'
];

// フィッシング・詐欺サイトで多用されるキーワード
const PHISHING_KEYWORDS = [
  'login-verify', 'verify-account', 'security-update', 'confirm-bank',
  'free-gift', 'crypto-claim', 'win-prize', 'account-blocked', 'billing-update',
  'paypal-security', 'amazon-verify', 'appleid-login'
];

/**
 * URLの安全性を総合判定・スコアリングする関数
 * @param {string} urlStr - 判定対象のURL文字列
 * @returns {Object} 判定結果オブジェクト (score, status, level, checks, breakdown, securityLinks)
 */
export function checkUrlSafety(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') {
    return {
      isValid: false,
      status: 'invalid',
      score: 0,
      level: 'danger',
      message: '無効なURL形式です',
      checks: []
    };
  }

  const cleanUrl = urlStr.trim();
  const checks = [];
  let score = 100;
  let parsedUrl = null;

  // 1. スキーム/プロトコルチェック
  const lowerUrl = cleanUrl.toLowerCase();
  if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:') || lowerUrl.startsWith('vbscript:')) {
    return {
      isValid: true,
      status: 'danger',
      score: 0,
      level: 'danger',
      label: '🔴 危険（実行可能スクリプト）',
      summary: 'ブラウザで実行可能な危険なスクリプトが含まれています！開かないでください。',
      checks: [
        { title: '危険なプロトコルスキーム', safe: false, risk: 'high', detail: 'javascript: / data: 実行可能コードです。' }
      ]
    };
  }

  try {
    parsedUrl = new URL(cleanUrl);
  } catch (e) {
    try {
      parsedUrl = new URL(`http://${cleanUrl}`);
    } catch (err) {
      return {
        isValid: false,
        status: 'invalid',
        score: 0,
        level: 'danger',
        label: '❌ URL構文エラー',
        summary: '正しいURL形式ではありません。',
        checks: [{ title: 'URL構文解析', safe: false, risk: 'high', detail: 'URL文字列の構造が不正です。' }]
      };
    }
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const protocol = parsedUrl.protocol.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();

  // 2. HTTPS 暗号化通信チェック
  if (protocol === 'https:') {
    checks.push({
      title: '通信暗号化 (HTTPS)',
      safe: true,
      risk: 'none',
      detail: 'TLS/SSLによる暗号化通信が使用されています。'
    });
  } else if (protocol === 'http:') {
    score -= 20;
    checks.push({
      title: '非暗号化通信 (HTTP)',
      safe: false,
      risk: 'medium',
      detail: 'HTTP接続のため通信内容が盗聴・改ざんされるリスクがあります。'
    });
  }

  // 3. IPアドレス直接接続チェック (e.g. http://192.168.1.1)
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipPattern.test(hostname)) {
    score -= 30;
    checks.push({
      title: '数値IPアドレス接続',
      safe: false,
      risk: 'high',
      detail: '正規ドメイン名ではなく数値IPアドレスへの接続です。フィッシング詐欺でよく使われます。'
    });
  }

  // 4. パニコード / 国際化ドメイン名 (Punycode / IDN Homograph Attack) チェック
  if (hostname.startsWith('xn--')) {
    score -= 40;
    checks.push({
      title: 'Punycode (国際化ドメイン偽装の可能性)',
      safe: false,
      risk: 'high',
      detail: `Punycodeドメイン (${hostname}) です。類似文字を用いたフィッシングの可能性があります。`
    });
  }

  // 5. サブドメインの多重ネストチェック (e.g. login.paypal.com.phishing.info)
  const hostParts = hostname.split('.');
  if (hostParts.length > 4) {
    score -= 25;
    checks.push({
      title: '複雑なサブドメイン構成',
      safe: false,
      risk: 'medium',
      detail: `サブドメインが多重にネストされています (${hostParts.length}階層)。大手サービスの偽装に注意してください。`
    });
  }

  // 6. 不審なTLD (トップレベルドメイン) チェック
  const matchedSuspiciousTld = SUSPICIOUS_TLDS.find(tld => hostname.endsWith(tld));
  if (matchedSuspiciousTld) {
    score -= 25;
    checks.push({
      title: '高リスクTLD (トップレベルドメイン)',
      safe: false,
      risk: 'medium',
      detail: `ドメイン末尾 "${matchedSuspiciousTld}" は不審なサイトに多用される傾向があります。`
    });
  }

  // 7. 危険なファイル拡張子のダウンロードチェック
  const matchedDangerousExt = DANGEROUS_EXTENSIONS.find(ext => pathname.endsWith(ext));
  if (matchedDangerousExt) {
    score -= 35;
    checks.push({
      title: '実行ファイル / アーカイブ直リンク',
      safe: false,
      risk: 'high',
      detail: `パス末尾に "${matchedDangerousExt}" が含まれます。意図しないファイルダウンロードに注意してください。`
    });
  }

  // 8. フィッシングキーワード検出
  const matchedKeyword = PHISHING_KEYWORDS.find(kw => cleanUrl.toLowerCase().includes(kw));
  if (matchedKeyword) {
    score -= 30;
    checks.push({
      title: 'フィッシング疑いキーワード検出',
      safe: false,
      risk: 'high',
      detail: `URL内にフィッシング詐欺で多用されるキーワード "${matchedKeyword}" が検出されました。`
    });
  }

  // 9. メジャーな安全ドメインの加点
  const isKnownSafe = KNOWN_SAFE_DOMAINS.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
  if (isKnownSafe) {
    score = Math.min(100, score + 15);
    checks.push({
      title: '信頼ドメイン確認',
      safe: true,
      risk: 'none',
      detail: '大手事業者または既知の公式ドメイン構造と一致します。'
    });
  }

  // スコアに基づく総合レベル決定
  let status = 'safe';
  let level = 'safe';
  let label = '🟢 安全度: 高 (Safe)';
  let color = '#00FF66';
  let summary = '目立った脅威パターンは検出されませんでした。通常のWebページです。';

  if (score < 60) {
    status = 'danger';
    level = 'danger';
    label = '🔴 危険・警告 (High Risk)';
    color = '#ef4444';
    summary = '不審なパターンが検出されました！不用意にアクセスしないよう注意してください。';
  } else if (score < 90) {
    status = 'warning';
    level = 'warning';
    label = '🟡 注意 (Caution)';
    color = '#f59e0b';
    summary = 'HTTP非暗号化通信または注意が必要な要素が含まれています。アクセス先をよく確認してください。';
  }

  // 外部セキュリティデータベース参照用URLの修正（404および構文エラーの解消）
  const encodedUrl = encodeURIComponent(cleanUrl);
  const securityLinks = [
    {
      name: 'Google Safe Browsing (透明性レポート)',
      url: `https://transparencyreport.google.com/safe-browsing/search?url=${encodedUrl}`,
      badge: 'Google Official'
    },
    {
      name: 'VirusTotal (マルチエンジン解析)',
      url: `https://www.virustotal.com/gui/search?query=${encodedUrl}`,
      badge: 'Multi-AV Scan'
    },
    {
      name: 'urlscan.io (URL動作解析)',
      url: `https://urlscan.io/search/#domain:${hostname}`,
      badge: 'Behavior Analysis'
    },
    {
      name: 'Norton Safe Web (安全診断)',
      url: `https://safeweb.norton.com/report/show?url=${encodedUrl}`,
      badge: 'Norton Check'
    }
  ];

  return {
    isValid: true,
    url: cleanUrl,
    hostname,
    score: Math.max(0, Math.min(100, score)),
    status,
    level,
    label,
    color,
    summary,
    checks,
    securityLinks
  };
}
