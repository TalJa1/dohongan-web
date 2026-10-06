# Andy — Hong An Do · Portfolio website

A static, multi-page portfolio site built with plain HTML, CSS and vanilla JavaScript.
It has no framework, no build step and no dependencies. Images are served from Firebase Storage through public URLs.

```
index.html                 Home
about.html                 About
projects.html              Projects (featured + grid)
research.html              Research
community.html             STEM & Community
achievements.html          Achievements
projects/pure-mekong.html
projects/water-filtration.html
projects/iot-salinity.html
projects/stemify.html
css/style.css              All styles (colour tokens at the top)
js/config.js               ← the file you edit: image names, hero style, research links
js/main.js                 Header/footer, nav, mobile menu, image loader, animations
favicon.svg
vercel.json                Vercel settings (clean URLs, cache headers)
```

The header and footer are injected by `js/main.js`, so a nav change only needs one edit (the `NAV` list at the top of that file).

---

## Run locally

All links and assets use root paths (`/css/style.css`, `/about.html`), so the site
**must be served by a web server**. Double-clicking `index.html` will open a page with no styles or images.

From the project folder, run either of these:

```bash
npx serve .                 # Node: http://localhost:3000 (also mimics Vercel's clean URLs)
python -m http.server 8000  # Python: http://localhost:8000
```

---

## Images (Firebase Storage)

Images live in the bucket `main-ada2c.firebasestorage.app` and load from:

```
https://firebasestorage.googleapis.com/v0/b/main-ada2c.firebasestorage.app/o/<encoded path>?alt=media
```

The bucket must allow public read. No Firebase SDK or Firebase Hosting is used.

### Change or add an image name

Open `js/config.js` and edit the `images` map. The **key** (left) is what the HTML uses
(`<img data-img="home-hero" …>`), and the **value** (right) is the exact file name in the bucket.

- File names are **case-sensitive**: `community-physix.JPG` is not the same file as `community-physix.jpg`.
- If a key is missing or a file fails to load, the page shows a branded "Image coming soon" placeholder, never a broken image.

### Images in a folder

If you move the files into a folder in the bucket (for example `images/`), set the folder in `js/config.js`:

```js
basePath: "images/",
```

Keep the trailing slash. The loader URL-encodes the full path (`images%2Fhome-hero.png`), so nothing else needs to change.

### Home hero style

`heroCutout` in `js/config.js` controls the home portrait:

- `false` (current): the photo is shown inside a blob frame. Use this because the current `home-hero.png` has a **white** background.
- `true`: use this only after uploading a version with a **transparent** background. The figure is then shown as a cutout standing on a blob shape.

### Optimize images (recommended)

Several photos are 2–7 MB, which makes pages slow on mobile. Re-export them once:

1. Resize to about **1600 px on the long side**.
2. Compress to **under about 500 KB** (JPEG quality around 75–80 is usually enough).
   - Easiest: <https://squoosh.app> (drag in, set "Resize" to 1600, choose MozJPEG, download).
   - Command line (ImageMagick): `magick input.jpg -resize "1600x1600>" -strip -quality 78 output.jpg`
3. In the Firebase console → **Storage**, upload each file again under the **same name**, replacing the old one.
   No code changes are needed.

Current sizes over 500 KB:

| File | Size |
|---|---|
| community-physix.JPG | 7.1 MB |
| home-hero.png | 3.9 MB (2268 × 6047, mostly empty white space; crop to the person first) |
| about-impact.jpg | 3.8 MB |
| proj-pure-mekong.jpeg | 3.7 MB |
| community-yes.jpg | 2.9 MB |
| proj-water-filter.jpeg | 2.0 MB |
| home-experiment.jpeg | 2.0 MB |
| about-curiosity.jpg | 1.9 MB |
| about-main.jpg | 1.8 MB |
| proj-iot.jpg | 0.7 MB |

---

## Deploy to Vercel

The site deploys as-is. There's nothing to build.

### Option A: GitHub + Vercel dashboard (recommended)

1. Push this folder to a GitHub repository.
2. On <https://vercel.com>, choose **Add New → Project** and import the repository.
3. Keep **Framework Preset = "Other"**. Leave **Build Command** and **Output Directory** empty.
4. Click **Deploy**.

Every later push to the `main` branch redeploys the site automatically.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel          # first run: links the folder and creates a preview deployment
vercel --prod   # deploy to production
```

### Custom domain

In Vercel open **Project → Settings → Domains**, add your domain, then create the DNS
records Vercel shows you at your domain registrar. HTTPS is set up automatically.

### Notes

- `vercel.json` turns on `cleanUrls`, so `/about.html` is served as `/about`. The source keeps the `.html` links, and the
  active-menu logic works with or without the extension.
- CSS/JS are cached for 1 hour (with background revalidation), so edits show up quickly after a redeploy.
- Don't add a `public/` folder: with the "Other" preset Vercel would serve only that folder.

---

## Edit content

All copy is in the HTML files. Colours and spacing are CSS variables at the top of `css/style.css`.
To enable the research button, paste the URL into `researchLinks.wastewater` in `js/config.js`.
The button then becomes a live link that opens in a new tab.

---

## Still needed

- [ ] **Read Research link** for "Wastewater Treatment & Reuse". The button currently shows "Coming soon".
      Add the URL in `js/config.js` → `researchLinks.wastewater`.
- [ ] **Stemify photos.** The PDF says these will be added later. `home-build.jpg`, `about-engineering.jpg` and
      `community-stemify.jpg` are currently the same photo (identical file size), so replace them with distinct images when ready.
- [ ] **Optimize the large images** listed above.
- [ ] **Transparent hero (optional).** If you want the cutout look, upload a transparent `home-hero.png`
      and set `heroCutout: true`.
- [ ] **Social preview.** `og:image` points to `home-hero.png`. A 1200 × 630 image under ~300 KB would preview better.
      Add `og:url` tags once the final domain is known.
- [ ] **Water Filtration System date.** No date was given, so none is shown.
