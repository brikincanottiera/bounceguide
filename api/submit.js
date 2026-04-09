const { feature, descrizione, email, lingua } = req.body;
 
  if (!feature || !feature.trim()) {
    return res.status(400).json({ error: 'Feature title is required' });
  }
 
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = '33da307e5d4a8022bddbe1d815ecb4e7';
 
  // Build properties — only fields that exist in the database
  const properties = {
    Feature: {
      title: [{ text: { content: feature.trim() } }]
    },
    Descrizione: {
      rich_text: [{ text: { content: (descrizione || '').trim() } }]
    },
    Lingua: {
      select: { name: (lingua || 'EN').toUpperCase() }
    }
  };
 
  // Add email as rich_text in Descrizione if provided, or append to description
  if (email && email.trim()) {
    const existingDesc = (descrizione || '').trim();
    const emailNote = `\n\nEmail: ${email.trim()}`;
    properties.Descrizione = {
      rich_text: [{ text: { content: existingDesc + emailNote } }]
    };
  }
 
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
    console.error('Server error:', e);
    return res.status(500).json({ error: 'Server error', detail: e.message });
  }
}
 
