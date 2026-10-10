/* =========================================================================
   main.js — header/footer injection, active nav, mobile menu,
   image loader (Firebase Storage), scroll reveal + stagger, stat counters.
   No dependencies.
   ========================================================================= */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG || { images: {} };
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  var NAV = [
    { key: "home",         label: "HOME",             href: "/index.html" },
    { key: "about",        label: "ABOUT",            href: "/about.html" },
    { key: "projects",     label: "PROJECTS",         href: "/projects.html" },
    { key: "research",     label: "RESEARCH",         href: "/research.html" },
    { key: "community",    label: "STEM & COMMUNITY", href: "/community.html" },
    { key: "achievements", label: "ACHIEVEMENT",      href: "/achievements.html" }
  ];

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
      if (window.innerWidth > 960 && header.classList.contains("menu-open")) setOpen(false);
    });

    // Shadow once the page scrolls
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 4); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Image loader ---------- */
  function imageUrl(key) {
    var file = CONFIG.images && CONFIG.images[key];
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
    ".stats", ".tags", ".bullets", ".interests", ".mini-stats", ".chips", ".btn-row"
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
    var els = document.querySelectorAll(".reveal, .timeline");
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

  /* ---------- Hover-to-expand figures (project detail + research pages) ---------- */
  // Rest the mouse on the picture: it counts 3, 2, 1, then grows in a fixed
  // layer above the page (no layout shift). Leaving shrinks it back.
  var ZOOM_COUNT = 3, ZOOM_TICK = 1000;

  function placeLayer(el, r) {
    el.style.left = r.left + "px";
    el.style.top = r.top + "px";
    el.style.width = r.width + "px";
    el.style.height = r.height + "px";
  }

  // Largest box with the picture's own proportions that fits the viewport,
  // centred on the original frame and kept clear of the sticky header.
  function zoomTarget(r, img) {
    var header = document.querySelector("[data-site-header]");
    var minTop = (header ? header.offsetHeight : 0) + 16;
    var vw = window.innerWidth, vh = window.innerHeight;
    var ratio = img.naturalWidth / img.naturalHeight;
    var w = Math.min(vw - 32, 1280), h = w / ratio;
    var maxH = vh - minTop - 16;
    if (h > maxH) { h = maxH; w = h * ratio; }
    if (w <= r.width) { w = r.width; h = r.height; }
    var left = Math.max(16, Math.min(r.left + r.width / 2 - w / 2, vw - w - 16));
    var top = Math.max(minTop, Math.min(r.top + r.height / 2 - h / 2, vh - h - 16));
    return { left: left, top: top, width: w, height: h };
  }

  function initImageZoom() {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    Array.prototype.forEach.call(document.querySelectorAll(".detail__figure, .research__media"), function (fig) {
      var media = fig.querySelector(".media");
      var img = media && media.querySelector("img");
      if (!img) return;
      var timer = null, closeTimer = null, badge = null, layer = null;
      fig.classList.add("is-zoomable");

      function showCount(n) {
        if (!badge) {
          badge = document.createElement("div");
          badge.className = "zoom-count";
          badge.setAttribute("aria-hidden", "true");
          media.appendChild(badge);
        }
        badge.innerHTML = "<span>" + n + "</span>"; // new node restarts the pop animation
      }
      function hideCount() {
        if (badge) { badge.remove(); badge = null; }
      }
      function discard() {
        clearTimeout(closeTimer);
        if (layer) { layer.remove(); layer = null; }
        fig.classList.remove("is-zooming");
      }
      function expand() {
        var r = media.getBoundingClientRect();
        layer = document.createElement("div");
        layer.className = "zoom-layer";
        layer.setAttribute("aria-hidden", "true");
        placeLayer(layer, r);
        var big = document.createElement("img");
        big.src = img.currentSrc || img.src;
        big.alt = "";
        layer.appendChild(big);
        fig.appendChild(layer);
        layer.getBoundingClientRect(); // commit the start state so it animates
        placeLayer(layer, zoomTarget(r, img));
        layer.classList.add("is-open");
      }
      function begin() {
        if (!(img.complete && img.naturalWidth) || media.classList.contains("is-missing")) return;
        clearTimeout(timer);
        discard(); // a layer that was still shrinking
        fig.classList.add("is-zooming");
        var n = ZOOM_COUNT;
        (function tick() {
          if (n === 0) { hideCount(); expand(); return; }
          showCount(n--);
          timer = setTimeout(tick, ZOOM_TICK);
        })();
      }
      function collapse() {
        clearTimeout(timer);
        hideCount();
        if (!layer) { fig.classList.remove("is-zooming"); return; }
        var l = layer;
        l.classList.remove("is-open");
        placeLayer(l, media.getBoundingClientRect());
        var done = function () { if (layer === l) discard(); };
        l.addEventListener("transitionend", function (e) { if (e.propertyName === "width") done(); });
        closeTimer = setTimeout(done, 800); // also covers reduced motion (no transition)
      }

      fig.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") begin(); });
      fig.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") collapse(); });
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
    initStagger();
    initReveal();
    initCounters();
    initImageZoom();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
