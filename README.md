# BounceGuide

**bounceguide.xyz**

BounceGuide is a free tool for mix and mastering engineers. It lets you create a professional PDF guide in minutes and send it to your clients, with all the instructions they need to send their files correctly.

No more wrong files. No more back and forth.

---

## What it does

Every time a client sends files for mixing or mastering, there is a good chance they will send them in the wrong format, with the master bus active, without a premix, or with names like "Audio 01". BounceGuide solves this: you configure your requirements once, and the tool generates a professional PDF in your client's language.

---

## How it works

The form is split into 9 sections:

1. **Details and branding** - Name, email, website, phone, logo and PDF accent color
2. **Service type** - Mixing (full stems or type beat) or Mastering (stem mastering or standard mastering)
3. **Glossary** - Technical terms explained in plain language, optional
4. **File format** - WAV, AIFF, MP3, sample rate and bit depth
5. **Stems and export** - Exactly what to export, with different options for each service type
6. **File naming** - How to name the files
7. **Delivery** - Accepted platforms, personal upload link, email
8. **DAW guides** - Step-by-step export instructions for each DAW your client uses
9. **Stupidity Check and notes** - Common mistakes to avoid, pre-send checklist and terms and conditions

Everything is saved automatically. When you are ready you click Preview PDF or Download PDF.

---

## Supported service types

**Mixing with full stems**
The client exports drums, bass/808/sub, instruments, vocals and premix with the WET/DRY guidelines you configured.

**Mixing type beat + vocals**
The client sends the type beat/instrumental exported from their project and the vocal stems.

**Stem Mastering**
The client exports separate stems for mastering. You can specify which stems you want, processing guidelines and a reference file.

**Standard Mastering**
The client sends the final stereo mix with the master bus completely bypassed. You can add specific export instructions and a reference file.

---

## DAW guides

For each service type there are separate step-by-step guides for every DAW:

- Ableton Live
- Logic Pro
- FL Studio
- Pro Tools
- Cubase / Nuendo
- Studio One
- REAPER
- Bitwig Studio
- GarageBand

The guides are editable from the admin panel and support 6 languages. You can paste all the instructions at once using the bulk import field and they get turned into individual tiles automatically.

---

## Supported languages

Italian, English, Spanish, French, German, Portuguese.

The PDF is generated in the language selected by the user. All sections are translated, including the DAW guides.

---

## Tech stack

- Vanilla HTML, CSS and JavaScript
- jsPDF for PDF generation in the browser
- Vercel for deployment (serverless functions for Notion and GitHub API)
- GitHub as a database for data.json
- No framework, no bundler

---

## Environment variables on Vercel

| Variable | Description |
|---|---|
| GITHUB_TOKEN | GitHub token with repo permissions |
| GITHUB_REPO | owner/repo (e.g. brikincanottiera/bounceguide) |
| NOTION_TOKEN | Notion token for feature requests |
| ADMIN_USER | Admin panel username |
| ADMIN_PASSWORD | Admin panel password |

---

## Project structure

```
/
├── index.html              # Main app
├── about.html              # About page
├── feature-requests.html   # Feature request form
├── admin.html              # Admin panel
├── privacy.html
├── terms.html
├── 404.html
├── data.json               # Editable content (DAW guides, checklists, etc.)
├── vercel.json
├── package.json
└── api/
    ├── getdata.js          # Serves data.json
    ├── save.js             # Saves data.json to GitHub
    ├── submit.js           # Sends feature requests to Notion
    └── auth.js             # Admin authentication
```

---

## Made by

Brik in Canottiera - [brikincanottiera.xyz](https://brikincanottiera.xyz)

TikTok, YouTube and Instagram: @brikincanottiera
