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
   - Browsers cannot show .HEIC photos: convert them to .jpg before uploading.
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

    /* Clean Water Empowerment Project (Pure Mekong) */
    "proj-pure-mekong": "proj-pure-mekong.jpeg",
    "proj-water-filter": "proj-water-filter.jpeg",
    "proj-iot": "proj-iot.jpg",
    "proj-stemify": "proj-stemify.jpg",
    "pm-problem-1": "pm-problem-1.webp",
    "pm-problem-2": "pm-problem-2.jpg",
    "pm-problem-3": "pm-problem-3.png",
    "pm-action-1": "pm-action-1.JPG",
    "pm-action-3": "pm-action-3.jpeg",
    "pm-reflect-1": "pm-reflect-1.jpeg",

    /* Research */
    "research-wastewater": "research-wastewater-2.png",
    "research-robot": "research-robot-2.png",
    "research-robot-arm": "research-wastewater.jpg",   // this file shows the robotic arm
    "research-robot-control": "research-robot.jpg",
    "ww-influent": "waste_water_2.png",
    "ww-design": "waste_water_3.png",
    "ww-cost-1": "waste_water_4.png",
    "ww-cost-2": "waste_water_5.png",
    "ww-lcc": "waste_water_6.png",
    "ww-sensitivity-1": "waste_water_8.png",
    "ww-sensitivity": "waste_water_7.png",

    /* STEM & Community */
    "community-physix": "community-physix.JPG",
    "community-aeroleague": "community-aeroleague.jpg",
    "community-yes": "community-yes.jpg",
    "community-stemify": "community-stemify.jpg",
    "stemify-1": "stemify-1.jpg",
    "stemify-2": "stemify-2.jpg",
    "stemify-3": "stemify-3.jpg",
    "physix-1": "physix-1.JPG",
    "physix-2": "physix-2.JPG",
    "aero-1": "aero-1.jpg",
    "aero-2": "aero-2.jpg",
    "aero-3": "aero-3.jpg",
    "yes-1": "yes-1.jpg",
    "yes-2": "yes-2.jpg",
    "yes-3": "yes-3.jpg",

    /* Beyond the Game */
    "run-hero": "run-hero.jpg",
    "run-1": "run-1.JPG"
  },

  /* Home hero portrait style:
     false -> the photo has a solid background: show it framed in a blob mask
              (the current home-hero.png has a white background, so use false).
     true  -> use this if you upload a version with a TRANSPARENT background:
              the figure is shown as a cutout standing on a blob shape.        */
  heroCutout: false,

  /* ---------------------------------------------------------------------
     RESEARCH LINKS
     While a value is empty, its "Read …" button shows a disabled
     "Coming soon" state.
     --------------------------------------------------------------------- */
  researchLinks: {
    wastewater: "http://ijeais.org/wp-content/uploads/2026/7/IJEAIS260736.pdf",
    robot: "https://drive.google.com/file/d/1rskvIgKx3slB8km936jdVcBVKnNDOPiF/view?usp=sharing"
  }
};
