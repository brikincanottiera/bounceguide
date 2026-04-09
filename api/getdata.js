const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(content);
  } catch (e) {
    console.error('getdata error:', e);
    return res.status(404).json({ error: 'data.json not found', detail: e.message });
  }
};
