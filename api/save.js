const crypto = require('crypto');
const { Octokit } = require("@octokit/rest");

// ── TOKEN VERIFICATION ──────────────────────────────────────
function verifyToken(token) {
  try {
    const secret = process.env.ADMIN_PASSWORD + process.env.GITHUB_TOKEN;
    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return false;
    const payload = Buffer.from(b64, 'base64').toString('utf-8');
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    // Constant-time compare to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const { exp } = JSON.parse(payload);
    if (Date.now() > exp) return false;
    return true;
  } catch (e) {
    return false;
  }
}

// ── RATE LIMITING (in-memory, resets on cold start) ─────────
const _rateMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const window = 60 * 1000; // 1 minute
  const limit = 10;
  const key = ip || 'unknown';
  const entry = _rateMap.get(key) || { count: 0, start: now };
  if (now - entry.start > window) { _rateMap.set(key, { count: 1, start: now }); return false; }
  entry.count++;
  _rateMap.set(key, entry);
  return entry.count > limit;
}

module.exports = async (req, res) => {
  // CORS — restrict to own domain only
  const origin = req.headers.origin || '';
  const allowed = ['https://bounceguide.xyz', 'https://www.bounceguide.xyz'];
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress;
  if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  const serverToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!serverToken || !repo) return res.status(500).json({ error: 'Missing env vars' });

  try {
    // Parse body
    let payload = req.body;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch(e) {}
    }
    if (!payload || typeof payload !== 'object') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString('utf-8');
      try { payload = JSON.parse(raw); } catch(e) {
        return res.status(400).json({ error: 'Cannot parse request body' });
      }
    }

    // ── VERIFY ADMIN TOKEN ──
    const { token, content, data } = payload;
    if (!token || !verifyToken(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // ── VALIDATE CONTENT ──
    let jsonString;
    if (content) {
      jsonString = content;
    } else if (data) {
      jsonString = JSON.stringify(data, null, 2);
    } else {
      return res.status(400).json({ error: 'No content or data provided' });
    }

    // Size limit: 2MB max
    if (Buffer.byteLength(jsonString, 'utf-8') > 2 * 1024 * 1024) {
      return res.status(413).json({ error: 'Content too large' });
    }

    // Must be valid JSON
    try { JSON.parse(jsonString); } catch(e) {
      return res.status(400).json({ error: 'Invalid JSON content' });
    }

    const [owner, repoName] = repo.split('/');
    const octokit = new Octokit({ auth: serverToken });

    const { data: file } = await octokit.repos.getContent({
      owner, repo: repoName, path: 'data.json',
    });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: 'data.json',
      message: 'Update data.json via admin panel',
      content: Buffer.from(jsonString).toString('base64'),
      sha: file.sha,
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Save error:', e);
    res.status(500).json({ error: e.message });
  }
};
