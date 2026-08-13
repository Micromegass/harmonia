# MEDIA.md — getting her Instagram content into the site

Automated scraping of @harmonia.baila was attempted (anonymous API + profile fetch) and is blocked by Instagram's login wall, as expected. The site therefore ships with **branded placeholders** everywhere, and a pipeline that picks up real photos/videos the moment files are dropped in. Nothing else needs to change — no code edits.

## The reliable route: Instagram's own export

1. In the Instagram app (logged in as **@harmonia.baila**): **Settings → Accounts Center → Your information and permissions → Download your information**.
2. Choose **Some of your information → Content (posts, stories, reels)**, format **HTML or JSON**, media quality **High**, and request the download.
3. Instagram emails a ZIP within a few hours/days. Unzip it — photos and videos are inside `media/posts/...`.

Alternative for a handful of items: open a post in the app → **⋯ → Save to device** (reels), or take the original files from her phone/camera roll — original quality beats Instagram's recompression anyway.

## Dropping files into the site

1. Copy the chosen photos/videos into **`media-raw/`** at the repo root (this folder is gitignored — originals never bloat the repo).
2. Rename each file to match (or add) an entry in **`app/content/media.manifest.json`**. Naming convention: `<styleTag>-<short-slug>-<number>.<ext>`, e.g. `bachata-clase-03.jpg`, `showreel-02.mp4`.
3. For a **new** asset, add a manifest entry:

```json
{
  "id": "bachata-clase-03",
  "file": "bachata-clase-03.jpg",
  "type": "image",
  "styleTag": "bachata",
  "orientation": "portrait",
  "placeholder": true,
  "alt": { "es": "…texto alternativo en español…", "en": "…alt text in English…" }
}
```

   `styleTag` must be one of the list at the top of the manifest (drives gallery filters). Always write real alt text in **both** languages.
4. Run **`npm run media`**. This generates AVIF/WebP responsive variants (480–1920px) + blur-up placeholders into `public/media/`, compresses video to MP4/WebM with a poster frame, and flips `placeholder` to `false` automatically.
5. Commit the changes in `public/media/` and the manifest. Done — gallery, showreel, and pages pick the assets up from the manifest.

## Requirements & notes

- Image processing needs only `npm install` (sharp). **Video compression needs ffmpeg** (`brew install ffmpeg`); without it, videos are copied uncompressed and a warning is printed — install ffmpeg and re-run before deploying video.
- Videos on the site are **muted, looping, `playsInline`**, with poster frames; `prefers-reduced-motion` users get the poster only. Never add autoplaying audio.
- **Consent:** before publishing any photo/video with identifiable students — especially minors — confirm written consent (see the image-rights section of the legal pages and DECISIONS.md).
