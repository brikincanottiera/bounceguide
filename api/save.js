const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const serverToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!serverToken || !repo) return res.status(500).json({ error: "Missing env vars" });

  const [owner, repoName] = repo.split("/");

  try {
    // Parse body manually if needed (Vercel sometimes doesn't auto-parse)
    let payload = req.body;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch(e) {}
    }
    if (!payload || typeof payload !== 'object') {
      // Try reading raw body
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString('utf-8');
      try { payload = JSON.parse(raw); } catch(e) {
        return res.status(400).json({ error: "Cannot parse request body" });
      }
    }

    let jsonString;
    if (payload.content) {
      jsonString = payload.content;
    } else if (payload.data) {
      jsonString = JSON.stringify(payload.data, null, 2);
    } else {
      return res.status(400).json({ error: "No content or data in body", received: Object.keys(payload) });
    }

    const octokit = new Octokit({ auth: serverToken });

    const { data: file } = await octokit.repos.getContent({
      owner, repo: repoName, path: "data.json",
    });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: "data.json",
      message: "Update data.json via admin panel",
      content: Buffer.from(jsonString).toString("base64"),
      sha: file.sha,
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Save error:", e);
    res.status(500).json({ error: e.message });
  }
};
