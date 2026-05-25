/**
 * OLCC *Flow product sites — language switcher widget.
 *
 * Drops a floating language dropdown into the top-right corner of any page
 * that includes this script. Reads which languages are available from a
 * <meta name="olcc-langs" content="zh,en,ms"> tag in the page <head>.
 *
 * URL convention:
 *   /carwashflow            -> zh (default, no lang segment)
 *   /carwashflow/en         -> English
 *   /carwashflow/ms         -> Bahasa Malaysia
 *   /carwashflow/demo       -> zh demo
 *   /carwashflow/demo/en    -> English demo
 *
 * Or under a product subdomain (carwashflow.olcc.com.my):
 *   /        -> zh
 *   /en      -> English
 *   /demo/ms -> Malay demo
 *
 * Switching language replaces (or appends) the trailing language segment,
 * preserving query string and hash.
 *
 * Languages that aren't in the meta tag are shown but disabled with a
 * "coming soon" note, so visitors know more is on the way.
 */
(function () {
  "use strict";

  var LANGS = [
    { code: "zh", label: "中文" },
    { code: "en", label: "English" },
    { code: "ms", label: "Bahasa Malaysia" },
  ];
  var LANG_CODES = LANGS.map(function (l) { return l.code; });
  var COMING_SOON = { en: "Coming soon", ms: "Akan datang", zh: "即将推出" };

  function getAvailable() {
    var meta = document.querySelector('meta[name="olcc-langs"]');
    if (!meta) return ["zh"]; // default: only Chinese
    return meta.content
      .split(",")
      .map(function (s) { return s.trim().toLowerCase(); })
      .filter(function (s) { return LANG_CODES.indexOf(s) >= 0; });
  }

  function getCurrentLang() {
    var segments = location.pathname.split("/").filter(Boolean);
    var last = segments[segments.length - 1];
    return LANG_CODES.indexOf(last) >= 0 ? last : "zh";
  }

  function buildLangUrl(targetLang) {
    var segments = location.pathname.split("/").filter(Boolean);
    var last = segments[segments.length - 1];
    if (LANG_CODES.indexOf(last) >= 0) segments.pop();
    if (targetLang !== "zh") segments.push(targetLang);
    var newPath = "/" + segments.join("/");
    if (newPath === "//") newPath = "/";
    return newPath + location.search + location.hash;
  }

  function render() {
    var available = getAvailable();
    var current = getCurrentLang();

    // If only one language available, don't render the widget at all.
    if (available.length <= 1) return;

    var root = document.createElement("div");
    root.className = "olcc-lang";
    root.setAttribute("data-open", "false");

    var currentLabel = (LANGS.find(function (l) { return l.code === current; }) || LANGS[0]).label;

    root.innerHTML =
      '<button class="olcc-lang__btn" type="button" aria-haspopup="listbox" aria-expanded="false">' +
        '<svg class="olcc-lang__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="12" cy="12" r="10"></circle>' +
          '<line x1="2" y1="12" x2="22" y2="12"></line>' +
          '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>' +
        '</svg>' +
        '<span class="olcc-lang__btn-label">' + currentLabel + '</span>' +
        '<svg class="olcc-lang__btn-caret" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<polyline points="2 4 5 7 8 4"></polyline>' +
        '</svg>' +
      '</button>' +
      '<ul class="olcc-lang__menu" role="listbox">' +
        LANGS.map(function (l) {
          var isCurrent = l.code === current;
          var isAvailable = available.indexOf(l.code) >= 0;
          if (isCurrent) {
            return '<li class="olcc-lang__item olcc-lang__item--current"><span>' + l.label + '<span class="olcc-lang__item-note">·</span></span></li>';
          }
          if (!isAvailable) {
            return '<li class="olcc-lang__item olcc-lang__item--disabled" title="' + (COMING_SOON[l.code] || COMING_SOON.en) + '"><span>' + l.label + '<span class="olcc-lang__item-note">' + (COMING_SOON[l.code] || COMING_SOON.en) + '</span></span></li>';
          }
          return '<li class="olcc-lang__item"><a href="' + buildLangUrl(l.code) + '">' + l.label + '</a></li>';
        }).join("") +
      '</ul>';

    document.body.appendChild(root);

    var btn = root.querySelector(".olcc-lang__btn");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = root.getAttribute("data-open") === "true";
      root.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) {
        root.setAttribute("data-open", "false");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
