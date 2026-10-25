# Nimm's Kitchen Website

Static restaurant landing page for **Nimm's Kitchen** (Karachi), built with HTML, CSS, and JavaScript. No build step — ready for GitHub and [Vercel](https://vercel.com) static hosting.

## Features

- Responsive homepage for mobile and desktop
- Menu cards with add-to-cart flow
- Dedicated gallery page with dish previews
- SEO metadata and favicon
- Order form with confirmation modal (opens the customer’s email app to send the order)

## Project structure

| File / folder | Purpose |
|---------------|---------|
| `index.html` | Homepage (served as `/` on Vercel) |
| `gallery.html` | Photo gallery (`/gallery` with clean URLs) |
| `style.css` | Styles |
| `script.js` | Cart, gallery, order form, UI behavior |
| `assets/images/` | Food photos and favicon |
| `vercel.json` | Vercel routing, cache headers, legacy redirect |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Then visit `http://localhost:3000`.

## Deploy on Vercel (via GitHub)

1. **Commit and push** this repo to GitHub (remote is already set to `Nimm-s-Kitchen`).
2. Sign in at [vercel.com](https://vercel.com) and choose **Add New → Project**.
3. **Import** the GitHub repository `batoolnimrah543-byte/Nimm-s-Kitchen`.
4. Vercel should detect a **static** site automatically:
   - **Framework Preset:** Other (or leave as detected)
   - **Build Command:** leave empty
   - **Output Directory:** leave empty (site root)
   - **Install Command:** leave empty
5. Click **Deploy**. Your site will be live at a `*.vercel.app` URL.
6. Optional: in Vercel **Project → Settings → Domains**, add a custom domain.

Each push to the connected branch (usually `main`) triggers a new deployment.

## After go-live (recommended)

- In `index.html` and `gallery.html`, set `og:image` (and optionally `og:url`) to **full HTTPS URLs** using your Vercel or custom domain so link previews work on WhatsApp, Facebook, etc.
- Test the order form on a phone: it uses `mailto:` so the visitor needs an email app configured.

## Notes

- Orders are sent via the visitor’s email client to the address configured in `script.js` (`recipientEmail`).
- Lucide icons load from unpkg (pinned version in HTML).
