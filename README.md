# Userscripts

Userscripts published to [Greasy Fork](https://greasyfork.org) via GitHub Pages auto-sync.

## How It Works

1. Edit any script in `scripts/*.user.js`
2. Bump `@version` in the script header
3. Push to `main` (or push a `v*` tag)
4. GitHub Actions validates metadata and deploys to GitHub Pages
5. Greasy Fork fetches the updated file from the Pages URL automatically

## Scripts

| Script | Pages URL | Greasy Fork |
|--------|-----------|-------------|
| goto_xueqiu | `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/goto_xueqiu.user.js` | _(add link after first publish)_ |

> Replace `<YOUR_USERNAME>` and `<REPO_NAME>` with your actual GitHub username and repo name.

## Add a New Script

1. Put the `.user.js` file under `scripts/`
2. Make sure the `==UserScript==` header contains `@name`, `@version`, and at least one `@match`
3. Push — the workflow picks it up automatically
4. Go to Greasy Fork → your script page → **Sync** → enter the Pages URL

## One-time GitHub Setup

### Enable GitHub Pages

1. Go to **Settings → Pages**
2. Source: **GitHub Actions**
3. Save

### Configure Greasy Fork Sync URL (once per script)

1. On Greasy Fork, open your script → **Edit → Update from external URL**
2. Enter: `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/<script-filename>.user.js`
3. Save — future pushes sync automatically
