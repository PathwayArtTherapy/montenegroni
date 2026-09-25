(function () {
  'use strict';
  var box = document.getElementById('lightbox');
  if (!box || typeof box.showModal !== 'function') return; // very old browsers: photos just stay in the grid

  var items = Array.prototype.map.call(document.querySelectorAll('.gal-open'), function (btn) {
    var fig = btn.closest('figure');
    var img = btn.querySelector('img');
    return {
      btn: btn,
      src: btn.getAttribute('data-full'),
      alt: img ? img.alt : '',
      cap: fig && fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : ''
    };
  });
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbCount = document.getElementById('lb-count');
  var current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    var it = items[current];
    lbImg.src = it.src;
    lbImg.alt = it.alt;
    lbCap.textContent = it.cap;
    lbCount.textContent = (current + 1) + ' / ' + items.length;
    // warm the next photo
    var next = new Image(); next.src = items[(current + 1) % items.length].src;
  }

  items.forEach(function (it, i) {
    it.btn.addEventListener('click', function () {
      show(i);
      box.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  function close() { box.close(); }
  box.addEventListener('close', function () {
    document.body.style.overflow = '';
    items[current].btn.focus();
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });

  // click on the dark backdrop closes
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { show(current + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { show(current - 1); e.preventDefault(); }
  });

  // swipe on phones
  var startX = null, startY = null;
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
