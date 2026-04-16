const crypto = require('crypto');
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { user, password } = req.body || {};
  const validUser = process.env.ADMIN_USER;
  const validPass = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_PASSWORD + process.env.GITHUB_TOKEN;
  if (!user || !password || user !== validUser || password !== validPass) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Create a signed token valid for 8 hours
  const exp = Date.now() + 8 * 60 * 60 * 1000;
  const payload = JSON.stringify({ user, exp });
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token = Buffer.from(payload).toString('base64') + '.' + sig;
  return res.status(200).json({ token });
};
