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
      '<p class="env-hint">Tap seal to open</p>' +
    '</div>';

  document.documentElement.classList.add('env-lock');
  document.body.appendChild(overlay);

  /* A little paper sound, made on the spot (no audio file):
     a soft snap as the seal breaks, a rustle as the flap lifts,
     and a gentle slide as the card comes out. */
  function playEnvelopeSound() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      var ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      var sr = ctx.sampleRate;
      var noise = ctx.createBuffer(1, Math.floor(sr * 2), sr);
      var d = noise.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      var master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
      var t0 = ctx.currentTime + 0.02;

      function burst(start, dur, freq, q, peak, shape) {
        var src = ctx.createBufferSource();
        src.buffer = noise;
        var bp = ctx.createBiquadFilter();
        bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0, start);
        shape(g.gain, start, dur, peak);
        src.connect(bp).connect(g).connect(master);
        src.start(start, Math.random() * 0.5, dur + 0.05);
        return bp;
      }
      function snap(p, s, dur, peak) { p.linearRampToValueAtTime(peak, s + 0.004); p.exponentialRampToValueAtTime(0.001, s + dur); }
      function crinkle(p, s, dur, peak) {
        // uneven little grains of paper noise
        var steps = Math.floor(dur / 0.018);
        for (var k = 0; k <= steps; k++) {
          var tt = s + k * 0.018;
          var env = Math.sin(Math.PI * k / steps);
          p.linearRampToValueAtTime(peak * env * (0.35 + Math.random() * 0.65), tt);
        }
        p.linearRampToValueAtTime(0, s + dur + 0.02);
      }
      function slide(p, s, dur, peak) {
        p.linearRampToValueAtTime(peak, s + dur * 0.35);
        p.linearRampToValueAtTime(peak * 0.6, s + dur * 0.8);
        p.linearRampToValueAtTime(0, s + dur);
      }

      // 1. The seal breaking: a quick crack, low thump underneath.
      burst(t0, 0.06, 2400, 1.2, 0.9, snap);
      burst(t0, 0.09, 380, 1.0, 0.5, snap);
      // 2. The flap lifting: a papery rustle.
      burst(t0 + 0.28, 0.55, 3200, 0.8, 0.28, crinkle);
      burst(t0 + 0.30, 0.50, 6500, 1.0, 0.12, crinkle);
      // 3. The card sliding out: a soft, smooth swish that rises in pitch.
      var bp = burst(t0 + 0.9, 0.8, 1200, 0.7, 0.2, slide);
      bp.frequency.setValueAtTime(900, t0 + 0.9);
      bp.frequency.linearRampToValueAtTime(2600, t0 + 1.7);

      setTimeout(function () { try { ctx.close(); } catch (e) {} }, 2500);
    } catch (e) { /* sound is a nice-to-have; never block the page */ }
  }

  var btn = overlay.querySelector('.env');
  var opened = false;
  // Keyboard: Enter or Space opens it too.
  function onKey(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } }
  document.addEventListener('keydown', onKey);

  function open() {
    if (opened) return;
    opened = true;
    playEnvelopeSound();
    window.scrollTo(0, 0);
    if (reduce) { finish(0); return; }
    overlay.classList.add('is-opening');                               // seal pops, hint fades
    setTimeout(function () { overlay.classList.add('flap-open'); }, 280);  // flap swings up
    setTimeout(function () { overlay.classList.add('flap-behind'); }, 700); // flap tucks behind the letter
    setTimeout(function () { overlay.classList.add('letter-out'); }, 900);  // letter rises
    setTimeout(function () { overlay.classList.add('letter-present'); presenting = true; }, 2500); // envelope fades, card unfolds with the photo
    // The card finishes unfolding at about 3.3s; hold it for 2.5s, then show the page.
    finish(3300 + 2500);
  }
  var presenting = false, finished = false, finishTimer = null;
  function finish(delay) {
    clearTimeout(finishTimer);
    finishTimer = setTimeout(function () {
      if (finished) return;
      finished = true;
      window.scrollTo(0, 0);
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
