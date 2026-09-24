(function () {
  'use strict';
  var cfg = window.SITE_CONFIG || {};

  /* ---------- Fill placeholders from config.js ---------- */
  document.querySelectorAll('[data-config]').forEach(function (el) {
    var key = el.getAttribute('data-config');
    if (cfg[key]) el.textContent = cfg[key];
  });

  /* ---------- WhatsApp links (one button per person) ---------- */
  var numbers = cfg.WHATSAPP || {};
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    var number = String(numbers[a.getAttribute('data-wa')] || '').replace(/\D/g, '');
    if (number) {
      a.href = 'https://wa.me/' + number;
    } else {
      a.hidden = true; // no number yet: hide that person's button
    }
  });

  /* ---------- Countdown ---------- */
  var target = new Date(cfg.CELEBRATION_DATE || '2027-06-26T00:00:00+02:00').getTime();
  var cdEls = {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    mins: document.querySelector('[data-cd="mins"]')
  };
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      cdEls.days.textContent = '0'; cdEls.hours.textContent = '0'; cdEls.mins.textContent = '0';
      return;
    }
    var mins = Math.floor(diff / 60000);
    cdEls.days.textContent = Math.floor(mins / 1440);
    cdEls.hours.textContent = Math.floor((mins % 1440) / 60);
    cdEls.mins.textContent = mins % 60;
  }
  if (cdEls.days) { tick(); setInterval(tick, 30000); }

  /* ---------- Sticky RSVP bar: hide while the form is on screen ---------- */
  var sticky = document.getElementById('sticky-rsvp');
  var rsvpSection = document.getElementById('rsvp');
  if (sticky && rsvpSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.05 }).observe(rsvpSection);
  }

  /* ---------- RSVP form ---------- */
  var form = document.getElementById('rsvp-form');
  if (!form) return;
  var fields = document.getElementById('rsvp-fields');
  var errorBox = document.getElementById('form-error');
  var submitBtn = document.getElementById('submit-btn');
  var thanks = document.getElementById('rsvp-thanks');
  var conditional = form.querySelectorAll('[data-show]');
  var nightsDetail = form.querySelector('.nights-detail');

  function currentPlan() {
    var checked = form.querySelector('input[name="plan"]:checked');
    return checked ? checked.value : null;
  }

  function applyPlan() {
    var plan = currentPlan();
    fields.hidden = !plan;
    if (!plan) return;
    conditional.forEach(function (el) {
      var show = el.getAttribute('data-show').split(/\s+/).indexOf(plan) !== -1;
      el.hidden = !show;
    });
    var adults = document.getElementById('f-adults');
    adults.required = plan !== 'cant';
  }

  form.querySelectorAll('input[name="plan"]').forEach(function (r) {
    r.addEventListener('change', function () {
      applyPlan();
      // Bring the newly revealed fields into view on phones.
      if (window.innerWidth < 800) {
        setTimeout(function () { fields.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
      }
    });
  });

  form.querySelectorAll('input[name="nights"]').forEach(function (r) {
    r.addEventListener('change', function () {
      nightsDetail.hidden = form.querySelector('input[name="nights"]:checked').value !== 'some';
    });
  });

  function showError(msg, el) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); }
  }
  function clearErrors() {
    errorBox.hidden = true;
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
  }

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function collect() {
    var data = {};
    var plan = currentPlan();
    var labels = {
      'house': 'Stay in the house for the week (EOI)',
      'week-own': 'Coming for the week, own accommodation',
      'saturday': 'Celebration day only (Sat 26 June)',
      'cant': "Can't make it"
    };
    data.plan = labels[plan] || plan;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.name === 'plan' || el.name === '_gotcha') return;
      if (!isVisible(el) && el.type !== 'radio') return;
      if (el.type === 'radio') {
        if (el.checked && isVisible(el.closest('.field') || el)) data[el.name] = el.value;
        return;
      }
      if (el.value !== '') data[el.name] = el.value;
    });
    data._subject = 'RSVP: ' + (data.name || 'someone') + ' — ' + data.plan;
    return data;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var plan = currentPlan();
    if (!plan) { showError('Pick one of the options above first.'); return; }

    var name = document.getElementById('f-name');
    var email = document.getElementById('f-email');
    var adults = document.getElementById('f-adults');
    if (!name.value.trim()) { showError('Please tell us your name(s).', name); return; }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showError('That email doesn\'t look right.', email); return; }
    if (plan !== 'cant' && (!adults.value || Number(adults.value) < 1)) { showError('How many adults are coming?', adults); return; }
    if (form.querySelector('input[name="_gotcha"]').value) { finish(plan); return; } // bot: pretend success

    var payload = collect();
    var endpoint = (cfg.FORM_ENDPOINT || '').trim();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    if (!endpoint) {
      // Not connected yet: behave as if it worked so the page can be tested.
      console.warn('FORM_ENDPOINT is empty in js/config.js. Submission not sent:', payload);
      setTimeout(function () { finish(plan); }, 500);
      return;
    }

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      finish(plan);
    }).catch(function (err) {
      console.error(err);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send it';
      showError('Hmm, that didn\'t send. Please try again, or message us on WhatsApp.');
    });
  });

  function finish(plan) {
    form.hidden = true;
    document.getElementById('thanks-house').hidden = plan !== 'house';
    if (plan === 'cant') {
      document.getElementById('thanks-copy').textContent = "We'll miss you! Thanks for letting us know, and sending love right back.";
    }
    thanks.hidden = false;
    thanks.focus();
    thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
