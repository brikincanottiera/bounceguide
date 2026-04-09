const DATABASE_ID = '33da307e5d4a8022bddbe1d815ecb4e7';
 
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { feature, descrizione, email, lingua } = req.body;
 
  if (!feature || !feature.trim()) {
    return res.status(400).json({ error: 'Feature title is required' });
  }
 
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
 
  // Page body for description and email
  const children = [];
 
  if (descrizione && descrizione.trim()) {
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: descrizione.trim() } }]
      }
    });
  }
 
  if (email && email.trim()) {
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: 'Email: ' + email.trim() } }]
      }
    });
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
        properties: {
          Feature: {
            title: [{ text: { content: feature.trim() } }]
          },
          Lingua: {
            select: { name: (lingua || 'EN').toUpperCase() }
          }
        },
        children: children
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
