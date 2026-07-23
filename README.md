# Soongjin Kim — Academic Homepage

Personal academic website, based on the
[Minimal Academic Website](https://github.com/yuhui-zh15/Minimal-Academic-Website) template.
Plain static HTML/CSS/JS — no build step.

## Structure

```
.
├── index.html            # Page content (about, research, news, experience, awards, services)
├── styles.css            # Styling (light + dark mode)
├── scripts.js            # Publication rendering + image modal
├── publications.json     # Publication data (edit this to add/update papers)
├── images/
│   ├── profile.svg       # Profile picture placeholder — replace with your photo
│   └── thumbs/*.svg      # Publication thumbnails — replace with real figures
├── assets/
│   └── SoongjinKim_CV.pdf
├── .github/workflows/deploy.yml   # Auto-deploy to GitHub Pages
└── .nojekyll
```

## Local preview

From this folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. (A local server is required — the page loads
`publications.json` via `fetch`, which does not work from a `file://` URL.)

## Deploy to GitHub Pages

1. Create a repo named **`<your-username>.github.io`** (for a user site), or any repo
   (for a project site).
2. Push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial homepage"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages → Build and deployment → Source** and select
   **GitHub Actions**. The included workflow (`.github/workflows/deploy.yml`) publishes the
   site on every push to `main`.
4. Your site goes live at `https://<your-username>.github.io/` (user site) or
   `https://<your-username>.github.io/<repo>/` (project site).

## Customizing

- **Profile photo** — replace `images/profile.svg` with a real image (e.g. `profile.jpg`)
  and update the `src` in `index.html`.
- **Publication thumbnails** — replace the SVGs in `images/thumbs/` with real teaser figures
  and update the `thumbnail` paths in `publications.json`.
- **Add paper links** — fill the `links` object in `publications.json`, e.g.
  ```json
  "links": { "pdf": "...", "code": "...", "project": "...", "video": "...", "bibtex": "..." }
  ```
  Only the keys you include are rendered.
- **Selected vs. all** — set `"selected": 1` for papers shown by default; the "Show All"
  button reveals every entry.
- **Author highlight** — your name (`S. Kim`, `Soongjin Kim`) is bolded automatically; adjust
  the `ME` array in `scripts.js` if needed.
