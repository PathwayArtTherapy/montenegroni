/* ============================================================
   "Tap to open" envelope intro.
   Currently only shown when the address ends in ?envelope
   (preview mode). To switch it on for everyone, set
   ENVELOPE_ALWAYS to true below.
   ============================================================ */
(function () {
  'use strict';
  var ENVELOPE_ALWAYS = false;

  var wanted = ENVELOPE_ALWAYS || /[?&]envelope\b/.test(location.search);
  if (!wanted) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var overlay = document.createElement('div');
  overlay.className = 'envelope-intro';
  overlay.innerHTML =
    '<div class="env-stage">' +
      '<button class="env" type="button" aria-label="Open the invitation">' +
        '<span class="env-back"></span>' +
        '<span class="env-letter" aria-hidden="true">' +
          '<span class="env-letter-inner">' +
            '<span class="env-letter-kicker">Save the date</span>' +
            '<span class="env-letter-names">Lou Lou<i>&amp;</i>Dylan</span>' +
            '<span class="env-letter-place">Perast · June 2027</span>' +
            '<span class="env-letter-photo"><img src="assets/intro-hands.jpg" alt="" width="360" height="540"></span>' +
          '</span>' +
        '</span>' +
        '<svg class="env-front" viewBox="0 0 400 280" preserveAspectRatio="none" aria-hidden="true">' +
          '<path d="M0 0 L200 150 L400 0 L400 280 L0 280 Z" fill="#F7F1E1"/>' +
          '<path d="M0 280 L170 138 M400 280 L230 138" stroke="#C9A227" stroke-width="1.5" fill="none"/>' +
          '<path d="M0 0 L200 150 L400 0" stroke="#C9A227" stroke-width="1.5" fill="none"/>' +
        '</svg>' +
        '<span class="env-flap" aria-hidden="true">' +
          '<svg viewBox="0 0 400 170" preserveAspectRatio="none">' +
            '<path d="M0 0 L400 0 L200 168 Z" fill="#EFE5CC"/>' +
            '<path d="M0 0 L200 168 L400 0" stroke="#C9A227" stroke-width="2" fill="none"/>' +
            '<path d="M28 6 L200 150 L372 6" stroke="#C9A227" stroke-width="1" fill="none" opacity=".7"/>' +
          '</svg>' +
        '</span>' +
        '<span class="env-seal" aria-hidden="true">' +
          '<svg viewBox="0 0 100 100">' +
            '<circle cx="50" cy="50" r="47" fill="#14213D"/>' +
            '<circle cx="50" cy="50" r="41" fill="none" stroke="#C9A227" stroke-width="2"/>' +
            '<circle cx="50" cy="50" r="36" fill="none" stroke="#C9A227" stroke-width="1"/>' +
            '<text x="50" y="58" text-anchor="middle" font-family="Limelight, serif" font-size="19" letter-spacing="1" fill="#E0BE4A">LL&amp;D</text>' +
            '<path d="M30 68 H70" stroke="#C9A227" stroke-width="1"/><path d="M50 64 l3 4 l-3 4 l-3 -4 z" fill="#C9A227"/>' +
          '</svg>' +
        '</span>' +
      '</button>' +
      '<p class="env-hint">Tap to open</p>' +
    '</div>';

  document.documentElement.classList.add('env-lock');
  document.body.appendChild(overlay);

  var btn = overlay.querySelector('.env');
  var opened = false;
  // Keyboard: Enter or Space opens it too.
  function onKey(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } }
  document.addEventListener('keydown', onKey);

  function open() {
    if (opened) return;
    opened = true;
    window.scrollTo(0, 0);
    if (reduce) { finish(0); return; }
    overlay.classList.add('is-opening');                               // seal pops, hint fades
    setTimeout(function () { overlay.classList.add('flap-open'); }, 280);  // flap swings up
    setTimeout(function () { overlay.classList.add('flap-behind'); }, 700); // flap tucks behind the letter
    setTimeout(function () { overlay.classList.add('letter-out'); }, 900);  // letter rises
    setTimeout(function () { overlay.classList.add('letter-present'); presenting = true; }, 1750); // envelope fades, card unfolds with the photo
    finish(5200);
  }
  var presenting = false, finished = false, finishTimer = null;
  function finish(delay) {
    clearTimeout(finishTimer);
    finishTimer = setTimeout(function () {
      if (finished) return;
      finished = true;
      overlay.classList.add('is-gone');
      document.documentElement.classList.remove('env-lock');
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { overlay.remove(); }, reduce ? 0 : 750);
    }, delay);
  }

  // First tap opens; a tap while the card is showing skips straight to the page.
  function tap() { if (!opened) open(); else if (presenting) finish(0); }
  btn.addEventListener('click', tap);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) tap(); });
})();
