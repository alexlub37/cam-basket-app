(function (global) {
  "use strict";
  const CLUB_LOGO_FALLBACK = "assets/logos/clubs/demo-app-club.png";
  const LEGACY_LOCAL_LOGOS = new Set(["image png.png", "logo.png", "demo-app-club.png"]);
  function cleanPath(value) {
    return String(value == null ? "" : value).trim().replace(/\\/g, "/");
  }
  function basename(path) {
    const clean = path.split("#", 1)[0].split("?", 1)[0];
    try { return decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1)).toLowerCase(); }
    catch (_error) { return clean.substring(clean.lastIndexOf("/") + 1).toLowerCase(); }
  }
  function resolveClubLogoUrl(value) {
    const raw = cleanPath(value);
    if (!raw) return CLUB_LOGO_FALLBACK;
    if (raw.toLowerCase() === CLUB_LOGO_FALLBACK.toLowerCase()) return CLUB_LOGO_FALLBACK;
    if (!/^(?:https?:|data:|blob:)/i.test(raw) && LEGACY_LOCAL_LOGOS.has(basename(raw))) return CLUB_LOGO_FALLBACK;
    if (/^https?:/i.test(raw)) {
      try {
        const url = new URL(raw, global.location.href);
        if (url.origin === global.location.origin && LEGACY_LOCAL_LOGOS.has(basename(url.pathname))) return CLUB_LOGO_FALLBACK;
      } catch (_error) {}
    }
    return raw;
  }
  function applyLogoFallback(image) {
    if (!image || image.dataset.clubLogoFallbackApplied === "1") return;
    image.dataset.clubLogoFallbackApplied = "1";
    image.src = CLUB_LOGO_FALLBACK;
  }
  global.CLUB_LOGO_FALLBACK = CLUB_LOGO_FALLBACK;
  global.resolveClubLogoUrl = resolveClubLogoUrl;
  global.applyClubLogoFallback = applyLogoFallback;
  document.addEventListener("error", function (event) {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.id === "mainLogo" || target.id === "splashLogo" || target.id === "portalLogo" || target.classList.contains("hero-logo")) {
      applyLogoFallback(target);
    }
  }, true);
})(window);
