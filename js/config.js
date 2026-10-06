/* =========================================================================
   SITE CONFIG — the only file you normally need to edit.
   -------------------------------------------------------------------------
   Images are served from Firebase Storage (public read) with this pattern:
   https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<encodeURIComponent(basePath + file)>?alt=media

   - File names are CASE-SENSITIVE ("community-physix.JPG" is not ".jpg").
   - If you move the images into a folder in the bucket, set basePath,
     e.g. basePath: "images/"  (keep the trailing slash).
   - A missing key or a file that fails to load shows an
     "Image coming soon" placeholder instead of a broken image.
   ========================================================================= */
window.SITE_CONFIG = {
  bucket: "main-ada2c.firebasestorage.app",
  basePath: "",   // files are at the bucket root; if they are inside a folder, put e.g. "images/"
  images: {
    "logo": "logo.png",
    "home-hero": "home-hero.png",
    "home-question": "home-question.jpg",
    "home-build": "home-build.jpg",
    "home-experiment": "home-experiment.jpeg",
    "about-main": "about-main.jpg",
    "about-curiosity": "about-curiosity.jpg",
    "about-engineering": "about-engineering.jpg",
    "about-impact": "about-impact.jpg",
    "proj-pure-mekong": "proj-pure-mekong.jpeg",
    "proj-water-filter": "proj-water-filter.jpeg",
    "proj-iot": "proj-iot.jpg",
    "proj-stemify": "proj-stemify.jpg",
    "research-wastewater": "research-wastewater.jpg",
    "research-robot": "research-robot.jpg",
    "community-physix": "community-physix.JPG",
    "community-aeroleague": "community-aeroleague.jpg",
    "community-yes": "community-yes.jpg",
    "community-stemify": "community-stemify.jpg"
  },

  /* Home hero portrait style:
     false -> the photo has a solid background: show it framed in a blob mask
              (the current home-hero.png has a white background, so use false).
     true  -> use this if you upload a version with a TRANSPARENT background:
              the figure is shown as a cutout standing on a blob shape.        */
  heroCutout: false,

  /* ---------------------------------------------------------------------
     RESEARCH LINKS
     Paste the URL here when the paper / write-up is ready. While a value
     is empty, the "Read Research →" button shows a disabled "Coming soon"
     state. Example: wastewater: "https://example.com/my-paper.pdf"
     --------------------------------------------------------------------- */
  researchLinks: {
    wastewater: ""
  }
};
