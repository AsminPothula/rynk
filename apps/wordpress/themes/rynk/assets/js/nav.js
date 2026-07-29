/**
 * Mobile menu toggle.
 *
 * Replaces the `useState(open)` in the React PublicHeader. The panel and both
 * icon states are in the markup already; this only flips `hidden` and the
 * matching ARIA attributes, so the header works with JavaScript disabled
 * (desktop nav) and degrades to a visible-but-static panel only if this file
 * fails to load.
 */
(function () {
  "use strict";

  var header = document.querySelector("[data-rynk-nav]");
  if (!header) return;

  var toggle = header.querySelector("[data-rynk-nav-toggle]");
  var panel = header.querySelector("[data-rynk-nav-panel]");
  var iconOpen = header.querySelector('[data-rynk-nav-icon="open"]');
  var iconClose = header.querySelector('[data-rynk-nav-icon="close"]');

  if (!toggle || !panel) return;

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (iconOpen) iconOpen.hidden = open;
    if (iconClose) iconClose.hidden = !open;
  }

  toggle.addEventListener("click", function () {
    setOpen(panel.hidden);
  });

  // Close on Escape, matching how the React panel collapsed on navigation.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Reset when the viewport grows past the md breakpoint, so the panel is
  // never left open behind the desktop nav.
  var wide = window.matchMedia("(min-width: 768px)");
  var onChange = function (event) {
    if (event.matches) setOpen(false);
  };
  if (typeof wide.addEventListener === "function") {
    wide.addEventListener("change", onChange);
  } else if (typeof wide.addListener === "function") {
    wide.addListener(onChange);
  }
})();
