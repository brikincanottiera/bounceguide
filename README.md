# BounceGuide

**The foolproof file submission guide for mix and master engineers.**

Generate a professional, crystal-clear PDF guide for your clients in seconds — so they know exactly how to export and send their files. No more wrong formats, no more "Audio 01.mp3", no more limiter on the master bus.

🔗 **Live:** [bounceguide.vercel.app](https://bounceguide.vercel.app)

---

## What it does

BounceGuide lets any mix/master engineer build a fully customized PDF guide in 9 steps:

1. **Your details & branding** — name, logo, accent color
2. **Service type** — mixing or mastering, stems or type beat
3. **Glossary** — optional plain-language glossary for non-technical clients
4. **File format** — WAV/AIFF/MP3, sample rate, bit depth
5. **Stems & export** — WET/DRY guidelines, drums, instruments, vocals, premix
6. **File naming** — naming conventions with examples
7. **How to send** — accepted platforms, personal upload link, session info
8. **DAW export guides** — step-by-step instructions for 9 DAWs with YouTube links
9. **Stupidity Check & notes** — common mistakes section, pre-send checklist, T&C

The PDF is generated entirely in the browser — nothing is uploaded or stored on any server.

---

## Features

- 🌍 **6 languages** — EN, IT, ES, FR, DE, PT
- 🎨 **Custom branding** — logo, accent color, opening message
- 📋 **DAW guides** — Ableton, Logic, FL Studio, Pro Tools, Cubase, Studio One, REAPER, Bitwig, GarageBand
- ✅ **Stupidity Check** — serious warning section for classic client mistakes
- 💾 **Auto-save** — your data persists across sessions
- 📱 **Responsive** — works on desktop and mobile
- 🔒 **Privacy first** — no tracking, no cookies, PDF generated locally

---

## Pages

| Page | URL |
|------|-----|
| Main app | `/` |
| About | `/about` |
| Feature Requests | `/feature-requests` |

---

## Tech stack

- **Frontend:** Vanilla HTML, CSS, JavaScript — single file, no frameworks
- **PDF generation:** [jsPDF](https://github.com/parallax/jsPDF) via CDN
- **Hosting:** [Vercel](https://vercel.com) (free tier)
- **Feature requests backend:** Vercel Serverless Function → Notion API

---

## Project structure

```
/
├── index.html              # Main app
├── about.html              # About page
├── feature-requests.html   # Feature requests form
├── 404.html                # Custom 404 page
├── og-image.png            # Open Graph image
├── favicon.ico             # Favicon
├── favicon-32.png          # Favicon 32x32
├── apple-touch-icon.png    # iOS home screen icon
├── vercel.json             # Vercel routing config
├── api/
│   └── submit.js           # Serverless function → Notion
└── README.md
```

---

## Local development

No build step needed. Just open `index.html` in your browser.

```bash
# Or serve locally
npx serve .
```

---

## Feature requests & bugs

Got an idea or found a bug? → [bounceguide.vercel.app/feature-requests](https://bounceguide.vercel.app/feature-requests)

---

## Author

Made by **Francesco** — [Brik in Canottiera](https://www.tiktok.com/@brikincanottiera)  
Mix & Master Engineer · TikTok audio educator · Builder of tools that stop clients from sending Audio 01.mp3

---

## License

Free to use. Not open source.
