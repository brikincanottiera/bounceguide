const DATABASE_ID = '33da307e5d4a8022bddbe1d815ecb4e7';
 
// In-memory rate limit (resets on cold start)
const _rateMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const entry = _rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > 60000) { _rateMap.set(ip, { count: 1, start: now }); return false; }
  entry.count++;
  _rateMap.set(ip, entry);
  return entry.count > 5;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  const { feature, descrizione, email, lingua, website } = req.body;

  // Honeypot: hidden field that bots fill, humans leave empty
  if (website) return res.status(200).json({ success: true });

  if (!feature || !feature.trim()) {
    return res.status(400).json({ error: 'Feature title is required' });
  }
  if (feature.length > 300 || (descrizione||'').length > 3000 || (email||'').length > 200) {
    return res.status(400).json({ error: 'Input too long' });
  }
 
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
 
  // Build description content including email if provided
  let descContent = (descrizione || '').trim();
  if (email && email.trim()) {
    descContent += (descContent ? '\n\nEmail: ' : 'Email: ') + email.trim();
  }
 
  const properties = {
    Feature: {
      title: [{ text: { content: feature.trim() } }]
    },
    Lingua: {
      select: { name: (lingua || 'EN').toUpperCase() }
    }
  };
 
  // Only add Descrizione if there's content
  if (descContent) {
    properties['Descrizione'] = {
      rich_text: [{ text: { content: descContent } }]
    };
  }
 
  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + NOTION_TOKEN,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties
      })
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      console.error('Notion error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Notion API error', detail: data });
    }
 
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Server error:', e.message);
    return res.status(500).json({ error: 'Server error', detail: e.message });
  }
};
