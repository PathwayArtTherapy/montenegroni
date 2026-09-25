/* ============================================================
   Celebration burst after an RSVP.
   celebrate('party')  champagne-pop confetti from both bottom
                       corners, then curly streamers showering down.
   celebrate('love')   a gentle fall of hearts (for "can't make it").
   No libraries. Skipped for people who prefer reduced motion.
   ============================================================ */
(function () {
  'use strict';

  var COLOURS = ['#C9A227', '#E0BE4A', '#F6E3A1', '#2E6E8E', '#1F4D3A', '#14213D', '#FFFDF7', '#E8A4A0'];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  window.celebrate = function (kind) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:200';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H;
    function size() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener('resize', size);

    var parts = [];
    var scale = Math.min(1, W / 500) * 0.35 + 0.65; // a touch smaller on phones

    function confetti(x, y, vx, vy) {
      parts.push({
        type: Math.random() < 0.25 ? 'dot' : 'rect',
        x: x, y: y, vx: vx, vy: vy,
        w: rand(6, 11) * scale, h: rand(10, 16) * scale,
        rot: rand(0, Math.PI * 2), vr: rand(-0.25, 0.25),
        tilt: rand(0, Math.PI * 2), vt: rand(0.08, 0.2),
        colour: pick(COLOURS), g: 0.32, drag: 0.985, life: 0
      });
    }
    function streamer(x, y) {
      parts.push({
        type: 'streamer',
        x: x, y: y, vx: rand(-0.6, 0.6), vy: rand(1.2, 2.6),
        len: rand(40, 80) * scale, amp: rand(5, 9) * scale, phase: rand(0, 6), vp: rand(0.15, 0.3),
        rot: rand(-0.5, 0.5), vr: rand(-0.02, 0.02),
        colour: pick(COLOURS), g: 0.03, drag: 0.995, life: 0
      });
    }
    function heart(x, y) {
      parts.push({
        type: 'heart',
        x: x, y: y, vx: rand(-0.4, 0.4), vy: rand(0.8, 1.8),
        s: rand(9, 16) * scale, rot: rand(-0.4, 0.4), vr: rand(-0.01, 0.01),
        sway: rand(0, 6), colour: pick(['#C9A227', '#E0BE4A', '#E8A4A0', '#F6E3A1']),
        g: 0.012, drag: 0.998, life: 0
      });
    }

    var t0 = performance.now();
    var schedule = [];

    if (kind === 'love') {
      for (var h = 0; h < 36; h++) schedule.push({ at: h * 70, fn: function () { heart(rand(0, W), rand(-60, -10)); } });
    } else {
      // The pop: two bursts from the bottom corners, angled up and inwards.
      var pop = function (fromLeft) {
        var x = fromLeft ? -10 : W + 10, y = H + 10;
        for (var i = 0; i < 90; i++) {
          var ang = (fromLeft ? rand(-78, -48) : rand(-132, -102)) * Math.PI / 180;
          var speed = rand(14, 24) * Math.max(0.75, Math.min(1.15, H / 800));
          confetti(x, y, Math.cos(ang) * speed, Math.sin(ang) * speed);
        }
      };
      schedule.push({ at: 0, fn: function () { pop(true); pop(false); } });
      schedule.push({ at: 350, fn: function () { pop(true); pop(false); } });
      // Then the shower of streamers and confetti from the top.
      for (var s = 0; s < 40; s++) schedule.push({ at: 500 + s * 45, fn: function () { streamer(rand(0, W), rand(-90, -20)); } });
      for (var c = 0; c < 60; c++) schedule.push({ at: 600 + c * 30, fn: function () { confetti(rand(0, W), rand(-40, -10), rand(-1, 1), rand(1, 3)); } });
    }

    function drawHeart(p) {
      var s = p.s;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.5, -s * 1.1, 0, -s * 0.5);
      ctx.bezierCurveTo(s * 0.5, -s * 1.1, s, -s * 0.4, 0, s * 0.3);
      ctx.fill();
    }

    function frame(now) {
      var elapsed = now - t0;
      while (schedule.length && schedule[0].at <= elapsed) schedule.shift().fn();

      ctx.clearRect(0, 0, W, H);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life++;
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.g;
        if (p.type === 'confetti' || p.type === 'rect' || p.type === 'dot') p.vy = Math.min(p.vy, 5.5); // flutter, don't plummet
        if (p.type === 'heart') { p.sway += 0.03; p.x += Math.sin(p.sway) * 0.6; p.vy = Math.min(p.vy, 2.2); }
        if (p.type === 'streamer') { p.phase += p.vp; p.vy = Math.min(p.vy, 3.2); }
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (p.tilt !== undefined) p.tilt += p.vt;

        if (p.y > H + 100 || p.x < -150 || p.x > W + 150) { parts.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.colour; ctx.strokeStyle = p.colour;
        if (p.type === 'rect') {
          ctx.scale(1, Math.cos(p.tilt));
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.type === 'dot') {
          ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill();
        } else if (p.type === 'streamer') {
          ctx.lineWidth = 3.2 * scale; ctx.lineCap = 'round';
          ctx.beginPath();
          for (var k = 0; k <= 16; k++) {
            var yy = -p.len / 2 + (p.len * k / 16);
            var xx = Math.sin(p.phase + k * 0.55) * p.amp;
            if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
          }
          ctx.stroke();
        } else if (p.type === 'heart') {
          drawHeart(p);
        }
        ctx.restore();
      }

      if (schedule.length || parts.length) {
        requestAnimationFrame(frame);
      } else {
        window.removeEventListener('resize', size);
        canvas.remove();
      }
    }
    requestAnimationFrame(frame);
  };
})();
