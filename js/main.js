/* =========================================================================
   main.js — header/footer injection, active nav, mobile menu,
   image loader (Firebase Storage), scroll reveal + stagger, stat counters,
   click-to-enlarge figures and galleries (lightbox).
   No dependencies.
   ========================================================================= */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG || { images: {} };
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // a mouse or trackpad (not touch): tilt and magnetic effects only apply here
  var finePointer = window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.documentElement.classList.add("js");

  var NAV = [
    { key: "home",            label: "HOME",                            href: "/index.html" },
    { key: "about",           label: "ABOUT",                           href: "/about.html" },
    { key: "projects",        label: "CLEAN WATER EMPOWERMENT PROJECT", href: "/projects.html" },
    { key: "community",       label: "STEM & COMMUNITY",                href: "/community.html" },
    { key: "research",        label: "RESEARCH",                        href: "/research.html" },
    { key: "achievements",    label: "ACHIEVEMENT",                     href: "/achievements.html" },
    { key: "beyond-the-game", label: "BEYOND THE GAME",                 href: "/beyond-the-game.html" }
  ];

  var NAV_BREAKPOINT = 1180; // px; below this the menu is a drop-down (see css/style.css)

  /* ---------- Active page (works with and without .html) ---------- */
  function currentKey() {
    var path = window.location.pathname.toLowerCase()
      .replace(/\/index(\.html)?$/, "/")
      .replace(/\.html$/, "")
      .replace(/\/+$/, "");
    if (path === "") return "home";
    if (path.indexOf("/projects/") === 0 || path === "/projects") return "projects";
    var slug = path.split("/").pop();
    for (var i = 0; i < NAV.length; i++) {
      if (NAV[i].key === slug) return slug;
    }
    return "";
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    var header = document.querySelector("[data-site-header]");
    if (!header) return;
    var active = currentKey();
    var links = NAV.map(function (item, i) {
      var isActive = item.key === active;
      return '<li style="--i:' + i + '"><a href="' + item.href + '"' +
        (isActive ? ' class="is-active" aria-current="page"' : "") +
        ">" + item.label.replace("&", "&amp;") + "</a></li>";
    }).join("");

    header.innerHTML =
      '<div class="container header-inner">' +
        '<a class="brand" href="/index.html" aria-label="Andy, Hong An Do — home">' +
          '<span class="brand-mark media" data-placeholder="A">' +
            '<img data-img="logo" alt="" width="180" height="100" decoding="async">' +
          "</span>" +
          '<span class="brand-text"><span class="brand-name">Andy</span>' +
          '<span class="brand-sub">Hong An Do</span></span>' +
        "</a>" +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' +
          '<span class="sr-only">Menu</span><span class="nav-toggle-bar" aria-hidden="true"></span>' +
        "</button>" +
        '<nav class="site-nav" id="site-nav" aria-label="Main">' +
          '<ul class="nav-list">' + links + "</ul>" +
        "</nav>" +
      "</div>" +
      '<span class="scroll-progress" aria-hidden="true"></span>';
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    var footer = document.querySelector("[data-site-footer]");
    if (!footer) return;
    footer.innerHTML =
      '<div class="container footer-inner">' +
        '<a class="brand" href="/index.html" aria-label="Andy, Hong An Do — home">' +
          '<span class="brand-mark media" data-placeholder="A">' +
            '<img data-img="logo" alt="" width="180" height="100" loading="lazy" decoding="async">' +
          "</span>" +
          '<span class="brand-text"><span class="brand-name">Andy</span>' +
          '<span class="brand-sub">Hong An Do</span></span>' +
        "</a>" +
        '<p class="footer-line">Where ideas flow.</p>' +
        '<a class="back-to-top" href="#top">Back to top ' +
          '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</a>" +
        '<p class="footer-copy">&copy; 2026 Hong An Do</p>' +
      "</div>";

    var top = footer.querySelector(".back-to-top");
    top.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      var main = document.getElementById("main");
      if (main) main.focus({ preventScroll: true });
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var header = document.querySelector("[data-site-header]");
    if (!header) return;
    var btn = header.querySelector(".nav-toggle");
    var nav = header.querySelector(".site-nav");
    if (!btn || !nav) return;

    function setOpen(open) {
      btn.setAttribute("aria-expanded", String(open));
      header.classList.toggle("menu-open", open);
      document.body.classList.toggle("no-scroll", open);
    }
    btn.addEventListener("click", function () {
      setOpen(btn.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("menu-open")) {
        setOpen(false);
        btn.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > NAV_BREAKPOINT && header.classList.contains("menu-open")) setOpen(false);
    });

    // Shadow once the page scrolls
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 4); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Image loader ---------- */
  function imageUrl(key) {
    var file = CONFIG.images && CONFIG.images[key];
    if (file && file.charAt(0) === "/") return file;   // local file served by this site
    if (!file || !CONFIG.bucket) return null;
    var objectPath = (CONFIG.basePath || "") + file;
    return "https://firebasestorage.googleapis.com/v0/b/" + CONFIG.bucket +
      "/o/" + encodeURIComponent(objectPath) + "?alt=media";
  }

  function markMissing(img) {
    img.classList.add("is-missing");
    var wrap = img.closest(".media");
    if (wrap) {
      wrap.classList.add("is-missing");
      wrap.classList.remove("is-loading");
    }
    img.removeAttribute("src");
  }

  // Images this browser has already shown once: they are served from the
  // service-worker cache, so show them straight away with no fade-in.
  var SEEN_KEY = "andy-seen-images";
  var seen = {};
  try { seen = JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch (e) { seen = {}; }
  function remember(url) {
    if (seen[url]) return;
    seen[url] = 1;
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) { /* storage blocked: fine */ }
  }

  function markLoaded(img, instant) {
    var wrap = img.closest(".media");
    if (instant) img.classList.add("no-fade");
    if (wrap) wrap.classList.remove("is-loading");
    img.classList.add("is-loaded");
  }

  function loadImage(img, url) {
    var known = !!seen[url];
    var wrap = img.closest(".media");
    img.addEventListener("load", function () { remember(url); markLoaded(img, known); }, { once: true });
    img.addEventListener("error", function () { markMissing(img); }, { once: true });
    // Only hide-then-fade images that are new to this browser.
    if (wrap && !known) wrap.classList.add("is-loading");
    img.src = url;
    if (img.complete && img.naturalWidth) { remember(url); markLoaded(img, true); }
  }

  function loadImages() {
    var imgs = document.querySelectorAll("img[data-img]");
    Array.prototype.forEach.call(imgs, function (img) {
      var url = imageUrl(img.getAttribute("data-img"));
      if (!url) { markMissing(img); return; }
      if (img.hasAttribute("data-hero")) {
        var holder = img.closest("[data-hero-portrait]");
        if (holder) holder.classList.toggle("is-cutout", CONFIG.heroCutout === true);
      }
      loadImage(img, url);
    });
  }

  /* ---------- Image cache (service worker) ---------- */
  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").then(function () {
        return navigator.serviceWorker.ready;
      }).then(function (reg) {
        // Images on the very first page loaded before the worker existed: hand them over to cache.
        var urls = Object.keys(seen);
        if (reg.active && urls.length) reg.active.postMessage({ type: "cache-images", urls: urls });
      }).catch(function () { /* caching is optional */ });
    });
  }

  /* ---------- Research links ---------- */
  function initResearchLinks() {
    var links = (CONFIG.researchLinks) || {};
    var els = document.querySelectorAll("[data-research-link]");
    Array.prototype.forEach.call(els, function (el) {
      var url = links[el.getAttribute("data-research-link")];
      if (!url) {
        el.addEventListener("click", function (e) { e.preventDefault(); });
        return;
      }
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      el.removeAttribute("aria-disabled");
      el.classList.remove("is-disabled");
      var note = el.querySelector(".btn-note");
      if (note) note.remove();
    });
  }

  /* ---------- Staggered children ---------- */
  // Items in these containers rise in one after another when the .reveal
  // around them becomes visible. Outer containers come first, so a list
  // nested inside one already staggering is left to move with its parent.
  var STAGGER = [
    ".page-hero .reveal:not(.page-hero__media)", ".home-hero__copy",
    ".stats", ".tags", ".bullets", ".interests", ".mini-stats", ".chips", ".btn-row",
    ".gallery", ".link-row"
  ];
  function initStagger() {
    STAGGER.forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
        if (!el.closest(".reveal") || (el.parentElement && el.parentElement.closest(".stagger"))) return;
        el.classList.add("stagger");
        Array.prototype.forEach.call(el.children, function (child, i) {
          child.style.setProperty("--i", i);
        });
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal, .timeline, .story");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  /* ---------- Stat counters ---------- */
  // <span data-count="1050" data-prefix="~$" data-suffix="+">1,050</span>
  function formatNumber(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var finalText = prefix + formatNumber(target) + suffix;
    if (reduceMotion || isNaN(target)) { el.textContent = finalText; return; }
    var duration = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + formatNumber(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = finalText;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) return; // keep final values from HTML
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(els, function (el) {
      el.textContent = (el.getAttribute("data-prefix") || "") + "0" + (el.getAttribute("data-suffix") || "");
      io.observe(el);
    });
  }

  /* ---------- Click-to-enlarge figures (project + research pages) ---------- */
  // Main pictures open in the same lightbox as the galleries. Each one is its
  // own group unless the markup already gives it a data-lightbox name.
  function initFigureZoom() {
    var figs = document.querySelectorAll(".detail__figure .media, .research__media .media, .featured__figure .media");
    Array.prototype.forEach.call(figs, function (media, i) {
      var img = media.querySelector("img");
      if (!img) return;
      if (!media.hasAttribute("data-lightbox")) media.setAttribute("data-lightbox", "figure-" + i);
      media.classList.add("is-zoomable");
      media.setAttribute("role", "button");
      media.setAttribute("tabindex", "0");
      media.setAttribute("aria-label", "Enlarge image" + (img.alt ? ": " + img.alt : ""));
      media.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); media.click(); }
      });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  // <button data-lightbox="group"><img …></button> opens the picture large.
  // Arrows / swipe step through the other pictures of the same group.
  function initLightbox() {
    var triggers = document.querySelectorAll("[data-lightbox]");
    if (!triggers.length || typeof HTMLDialogElement !== "function") return;

    var box = document.createElement("dialog");
    box.className = "lightbox";
    box.setAttribute("aria-label", "Image viewer");
    box.innerHTML =
      '<button class="lightbox__btn lightbox__close" type="button" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous image">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<figure class="lightbox__figure"><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lightbox__btn lightbox__next" type="button" aria-label="Next image">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<span class="lightbox__count" aria-live="polite"></span>';
    document.body.appendChild(box);

    var big = box.querySelector("img");
    var caption = box.querySelector("figcaption");
    var count = box.querySelector(".lightbox__count");
    var group = [], index = 0;

    // Lazy pictures further down may not have loaded yet; the lightbox
    // fetches them itself, so only files that failed are left out.
    function usable(btn) {
      var img = btn.querySelector("img");
      return img && img.getAttribute("src") && !btn.classList.contains("is-missing");
    }
    function show(i) {
      index = (i + group.length) % group.length;
      var img = group[index].querySelector("img");
      big.classList.remove("is-in");
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      caption.textContent = img.alt;
      count.textContent = group.length > 1 ? (index + 1) + " / " + group.length : "";
      big.getBoundingClientRect(); // restart the fade for each picture
      big.classList.add("is-in");
    }
    function open(btn) {
      var name = btn.getAttribute("data-lightbox");
      group = Array.prototype.filter.call(document.querySelectorAll('[data-lightbox="' + name + '"]'), usable);
      if (!group.length) return;
      box.classList.toggle("is-single", group.length < 2);
      show(Math.max(0, group.indexOf(btn)));
      box.showModal();
      document.body.classList.add("no-scroll");
    }

    Array.prototype.forEach.call(triggers, function (btn) {
      btn.addEventListener("click", function () { open(btn); });
    });
    box.querySelector(".lightbox__close").addEventListener("click", function () { box.close(); });
    box.querySelector(".lightbox__prev").addEventListener("click", function () { show(index - 1); });
    box.querySelector(".lightbox__next").addEventListener("click", function () { show(index + 1); });
    box.addEventListener("close", function () {
      document.body.classList.remove("no-scroll");
    });
    // a click on the dark backdrop (the dialog itself, not its content) closes it
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
    });

    var startX = null;
    box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ---------- Hero spotlight ---------- */
  // A soft light follows the pointer across the dark page heroes.
  function initSpotlight() {
    if (reduceMotion || !finePointer) return;
    Array.prototype.forEach.call(document.querySelectorAll(".page-hero"), function (hero) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        hero.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  // Buttons lean a little towards the pointer while it is over them.
  function initMagnetic() {
    if (reduceMotion || !finePointer) return;
    Array.prototype.forEach.call(document.querySelectorAll(".btn:not(.is-disabled), .back-to-top, .to-top"), function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.translate = (dx * 10).toFixed(1) + "px " + (dy * 8).toFixed(1) + "px";
      });
      el.addEventListener("pointerleave", function () { el.style.translate = ""; });
    });
  }

  /* ---------- Card tilt ---------- */
  // Cards turn slightly in 3D towards the pointer, with a soft highlight.
  var TILT = ".project-card, .drive-card, .impact-card, .milestone__card, .stat, .interest";
  function initTilt() {
    if (reduceMotion || !finePointer) return;
    Array.prototype.forEach.call(document.querySelectorAll(TILT), function (card) {
      card.classList.add("tilt");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        // rotate around the axis perpendicular to the pointer's offset from the centre
        card.style.rotate = (0.5 - py).toFixed(3) + " " + (px - 0.5).toFixed(3) + " 0 " +
          (Math.hypot(px - 0.5, py - 0.5) * 9).toFixed(2) + "deg";
        card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", function () { card.style.rotate = ""; });
    });
  }

  /* ---------- Word-by-word headings ---------- */
  // Page titles are split into words that slide up out of a mask in turn.
  function splitWords(el) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 1) { walk(child); return; }
        if (child.nodeType !== 3 || !child.nodeValue.trim()) return;
        var frag = document.createDocumentFragment();
        child.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var word = document.createElement("span");
          word.className = "word";
          word.innerHTML = '<span class="word__in" style="--w:' + (n++) + '"></span>';
          word.firstChild.textContent = part;
          frag.appendChild(word);
        });
        node.replaceChild(frag, child);
      });
    })(el);
  }
  function initSplitHeadings() {
    if (reduceMotion) return;
    Array.prototype.forEach.call(document.querySelectorAll(".page-hero__title, .home-hero__heading, .closing__title"), splitWords);
  }

  /* ---------- Parallax ---------- */
  // Decorative shapes in dark bands drift at a different speed while scrolling.
  function initParallax() {
    if (reduceMotion) return;
    var bands = document.querySelectorAll(".page-hero, .closing, .welcome, .home-hero");
    if (!bands.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      Array.prototype.forEach.call(bands, function (band) {
        var r = band.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        band.style.setProperty("--py", ((r.top + r.height / 2 - vh / 2) * -0.12).toFixed(1));
      });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Rising bubbles ---------- */
  // A few soft bubbles float up through the dark page heroes ("where ideas flow").
  function initBubbles() {
    if (reduceMotion) return;
    Array.prototype.forEach.call(document.querySelectorAll(".page-hero, .closing"), function (band) {
      var wrap = document.createElement("span");
      wrap.className = "bubbles";
      wrap.setAttribute("aria-hidden", "true");
      var html = "";
      for (var i = 0; i < 12; i++) {
        html += '<i style="--x:' + (4 + Math.random() * 92).toFixed(1) + "%;--s:" + (6 + Math.random() * 18).toFixed(0) +
          "px;--d:" + (9 + Math.random() * 10).toFixed(1) + "s;--t:-" + (Math.random() * 18).toFixed(1) + 's"></i>';
      }
      wrap.innerHTML = html;
      band.insertBefore(wrap, band.firstChild);
    });
  }

  /* ---------- Back-to-top button with reading progress ---------- */
  function initToTop() {
    var btn = document.createElement("a");
    btn.className = "to-top";
    btn.href = "#top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML =
      '<svg class="to-top__ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/><circle class="to-top__bar" cx="24" cy="24" r="21"/></svg>' +
      '<svg class="to-top__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);
    var bar = btn.querySelector(".to-top__bar");
    var length = 2 * Math.PI * 21;
    bar.style.strokeDasharray = length;
    var ticking = false;
    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.strokeDashoffset = (length * (1 - p)).toFixed(1);
      btn.classList.toggle("is-shown", window.scrollY > 500);
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Boot ---------- */
  function init() {
    registerServiceWorker();
    renderHeader();
    renderFooter();
    initMenu();
    loadImages();
    initResearchLinks();
    initSplitHeadings();
    initStagger();
    initReveal();
    initCounters();
    initFigureZoom();
    initLightbox();
    initSpotlight();
    initBubbles();
    initParallax();
    initToTop();
    initMagnetic();
    initTilt();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
