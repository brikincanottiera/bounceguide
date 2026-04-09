const crypto = require('crypto');

function verifyToken(token) {
  try {
    const secret = process.env.ADMIN_PASSWORD + process.env.GITHUB_TOKEN;
    const [payloadB64, sig] = token.split('.');
    if (!payloadB64 || !sig) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
    const expectedSig = crypto.createHmac('sha256', secret)
      .update(JSON.stringify(payload)).digest('hex');
    if (sig !== expectedSig) return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, data } = req.body || {};

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPO || 'brikincanottiera/bounceguide';

  try {
    // Get current file SHA (required for update)
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/data.json`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    let sha = null;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // Update file on GitHub
    const body = {
      message: `Admin: update data.json [${new Date().toISOString()}]`,
      content: Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64'),
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/data.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      console.error('GitHub error:', err);
      return res.status(500).json({ error: 'GitHub API error', detail: err });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Save error:', e);
    return res.status(500).json({ error: e.message });
  }
};
