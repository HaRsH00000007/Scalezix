// Footer collapse: as you scroll down through the footer, the lined Scalezix panel (logo row + wordmark)
// lifts up, narrows and gets its top edge cut, and the lower footer brightens. Scrolling up reverses it.
// Progress is eased toward the scroll position every frame so the motion stays smooth.
// Writes --fr-p (0..1) and a few marker classes on the footer; the visual rules live in styles-*.css.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var target = 0, current = 0, raf = 0;

  function els() {
    var wm = document.querySelector('footer img[src$="scalezix-wordmark.svg"]');
    return wm ? { footer: wm.closest('footer'), wm: wm } : null;
  }

  function measure() {
    var e = els();
    if (!e) return null;
    var vh = window.innerHeight;
    var maxScroll = document.documentElement.scrollHeight - vh;
    // Start when the footer's top reaches the bottom of the viewport; finish at the page bottom.
    var start = e.footer.getBoundingClientRect().top + window.scrollY - vh;
    var end = maxScroll - 2; // scroll positions are fractional; treat the last 2px as "at the bottom"
    var p = end - start <= 1 ? 1 : (window.scrollY - start) / (end - start);
    target = Math.min(1, Math.max(0, p));
    return e;
  }

  function tick() {
    var e = measure();
    if (!e) { raf = 0; return; }
    if (!e.footer.classList.contains('fr-on')) {
      var panel = e.wm.parentElement && e.wm.parentElement.parentElement; // lined panel: logo row + wordmark
      var guides = e.footer.querySelector(':scope>.pointer-events-none.absolute.inset-0');
      if (panel) panel.classList.add('fr-panel');
      if (guides) guides.classList.add('fr-guides');
      if (e.footer.lastElementChild !== panel) e.footer.lastElementChild.classList.add('fr-bottom');
      e.footer.classList.add('fr-on');
    }
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.001) current = target;
    e.footer.style.setProperty('--fr-p', current.toFixed(4));
    raf = current === target ? 0 : requestAnimationFrame(tick);
  }

  function kick() { if (!raf) raf = requestAnimationFrame(tick); }

  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick);
  // Client-side navigation re-mounts the footer; re-apply when the DOM changes.
  new MutationObserver(kick).observe(document.documentElement, { childList: true, subtree: true });
  kick();
})();
