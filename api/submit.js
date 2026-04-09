export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { feature, descrizione, email, lingua } = req.body;
 
  if (!feature || !feature.trim()) {
    return res.status(400).json({ error: 'Feature title is required' });
  }
 
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = '33da307e5d4a8022bddbe1d815ecb4e7';
 
  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          Feature: {
            title: [{ text: { content: feature.trim() } }]
          },
          Descrizione: {
            rich_text: [{ text: { content: (descrizione || '').trim() } }]
          },
          Lingua: {
            select: { name: lingua || 'EN' }
          },
          Status: {
            status: { name: 'Da valutare' }
          },
          ...(email && email.trim() ? {
            Email: {
              email: email.trim()
            }
          } : {})
        }
      })
    });
 
    if (!response.ok) {
      const err = await response.json();
      console.error('Notion error:', err);
      return res.status(500).json({ error: 'Notion API error', detail: err });
    }
 
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Server error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
 
