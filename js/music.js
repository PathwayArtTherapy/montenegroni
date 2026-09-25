/* ============================================================
   A short burst of music, started by the envelope tap.
   Browsers only allow sound after a tap, which is why it starts
   there rather than when the page loads.
   Settings live in js/config.js under MUSIC.
   ============================================================ */
(function () {
  'use strict';
  var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.MUSIC) || {};
  if (!cfg.FILE) return;

  var PLAY_FOR = (cfg.PLAY_SECONDS || 20);
  var START_AT = (cfg.START_AT_SECONDS || 0);
  var FADE_IN = 1.5, FADE_OUT = 3;

  var audio, ctx, gain, stopTimer, btn, muted = false, playing = false, endAt = 0;

  function makeButton() {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'music-toggle';
    btn.setAttribute('aria-label', 'Mute music');
    btn.innerHTML =
      '<svg class="icon-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
      '<svg class="icon-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    btn.addEventListener('click', function () {
      muted = !muted;
      btn.classList.toggle('is-muted', muted);
      btn.setAttribute('aria-label', muted ? 'Play music' : 'Mute music');
      if (gain && ctx) {
        var now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(muted ? 0 : 1, now, 0.15);
        if (!muted && endAt - now > FADE_OUT + 0.5) {
          gain.gain.setValueAtTime(1, endAt - FADE_OUT);
          gain.gain.linearRampToValueAtTime(0, endAt);
        }
      } else if (audio) {
        audio.muted = muted;
      }
    });
    document.body.appendChild(btn);
    requestAnimationFrame(function () { btn.classList.add('is-shown'); });
  }

  function hideButton() {
    if (!btn) return;
    btn.classList.remove('is-shown');
    setTimeout(function () { if (btn) { btn.remove(); btn = null; } }, 500);
  }

  function stop() {
    playing = false;
    if (audio) audio.pause();
    hideButton();
  }

  // Must be called from inside a tap/click handler.
  window.startSong = function () {
    if (playing) return;
    playing = true;
    audio = new Audio(cfg.FILE);
    audio.preload = 'auto';
    audio.playsInline = true;

    // Web Audio lets the fade work on iPhones too (they ignore audio.volume).
    var AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      try {
        ctx = new AC();
        var src = ctx.createMediaElementSource(audio);
        gain = ctx.createGain();
        gain.gain.value = 0;
        src.connect(gain).connect(ctx.destination);
        if (ctx.state === 'suspended') ctx.resume();
      } catch (e) { ctx = null; gain = null; }
    }

    // Start playing right away, inside the tap, so iPhones allow it.
    var p = audio.play();
    if (p && p.catch) p.catch(function () { stop(); });

    var started = false;
    function begin() {
      if (started) return;
      started = true;
      try { if (START_AT) audio.currentTime = START_AT; } catch (e) {}
      if (gain && ctx) {
        var t = ctx.currentTime;
        endAt = t + PLAY_FOR;
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(muted ? 0 : 1, t + FADE_IN);
        gain.gain.setValueAtTime(muted ? 0 : 1, t + PLAY_FOR - FADE_OUT);
        gain.gain.linearRampToValueAtTime(0, t + PLAY_FOR);
      }
      stopTimer = setTimeout(stop, PLAY_FOR * 1000 + 100);
      makeButton();
    }
    if (audio.readyState >= 1) begin();
    else audio.addEventListener('loadedmetadata', begin, { once: true });
  };
})();
