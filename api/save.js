const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // "owner/repo"
  if (!token || !repo) {
    return res.status(500).json({ error: "Missing env vars" });
  }

  const [owner, repoName] = repo.split("/");
  const octokit = new Octokit({ auth: token });

  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "No content" });

    // Get current file SHA
    const { data: file } = await octokit.repos.getContent({
      owner, repo: repoName, path: "data.json",
    });

    // Update file
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: "data.json",
      message: "Update data.json via admin",
      content: Buffer.from(content).toString("base64"),
      sha: file.sha,
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
