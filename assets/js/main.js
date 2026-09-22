/* ==========================================================================
   Tori's Cleaning Service — main.js
   Mobile nav, scroll spy, reveal-on-scroll, counters, testimonial slider,
   back-to-top, and quote form validation.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Current year in footer
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');

  function closeNav() {
    if (!nav || !navToggle) { return; }
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  function openNav() {
    if (!nav || !navToggle) { return; }
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) { closeNav(); } else { openNav(); }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeNav(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) { closeNav(); }
    });
  }

  /* ------------------------------------------------------------------
     Sticky header shadow + back-to-top visibility
     ------------------------------------------------------------------ */
  var header = document.getElementById('header');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) { header.classList.toggle('is-stuck', y > 8); }
    if (toTop) { toTop.classList.toggle('is-visible', y > 600); }
  }

  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (scrollTicking) { return; }
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      scrollTicking = false;
    });
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     Scroll spy — highlight the active nav link
     ------------------------------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var spyTargets = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#' || id === '#') { return null; }
      var section = document.querySelector(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  if (spyTargets.length && 'IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        spyTargets.forEach(function (t) {
          t.link.classList.toggle('is-active', t.section === entry.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    spyTargets.forEach(function (t) { spyObserver.observe(t.section); });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!revealEls.length) {
    /* nothing to do */
  } else if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     Animated stat counters
     ------------------------------------------------------------------ */
  var counters = Array.prototype.slice.call(document.querySelectorAll('.stat__num[data-count]'));

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) { return; }

    var duration = 1400;
    var start = null;

    function frame(ts) {
      if (start === null) { start = ts; }
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased)) + suffix;
      if (progress < 1) { window.requestAnimationFrame(frame); }
    }
    window.requestAnimationFrame(frame);
  }

  if (counters.length && !prefersReduced && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     Testimonial slider
     ------------------------------------------------------------------ */
  (function initSlider() {
    var slider = document.getElementById('slider');
    var track = document.getElementById('sliderTrack');
    var dotsWrap = document.getElementById('sliderDots');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    if (!slider || !track || !dotsWrap) { return; }

    var slides = Array.prototype.slice.call(track.querySelectorAll('.slide'));
    if (slides.length < 2) {
      if (prevBtn) { prevBtn.style.display = 'none'; }
      if (nextBtn) { nextBtn.style.display = 'none'; }
      return;
    }

    var index = 0;
    var autoTimer = null;
    var AUTO_MS = 7000;

    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'slider__dot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Show review ' + (i + 1));
      b.addEventListener('click', function () {
        goTo(i);
        restartAuto();
      });
      dotsWrap.appendChild(b);
      return b;
    });

    function render() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (d, i) {
        var active = i === index;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      slides.forEach(function (s, i) {
        s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAuto() {
      if (prefersReduced) { return; }
      autoTimer = window.setInterval(next, AUTO_MS);
    }
    function stopAuto() {
      if (autoTimer) { window.clearInterval(autoTimer); autoTimer = null; }
    }
    function restartAuto() { stopAuto(); startAuto(); }

    if (nextBtn) { nextBtn.addEventListener('click', function () { next(); restartAuto(); }); }
    if (prevBtn) { prevBtn.addEventListener('click', function () { prev(); restartAuto(); }); }

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);

    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); restartAuto(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); restartAuto(); }
    });

    /* Touch swipe */
    var startX = 0;
    var deltaX = 0;
    var swiping = false;

    slider.addEventListener('touchstart', function (e) {
      if (!e.touches || e.touches.length !== 1) { return; }
      startX = e.touches[0].clientX;
      deltaX = 0;
      swiping = true;
      stopAuto();
    }, { passive: true });

    slider.addEventListener('touchmove', function (e) {
      if (!swiping || !e.touches || e.touches.length !== 1) { return; }
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });

    slider.addEventListener('touchend', function () {
      if (!swiping) { return; }
      swiping = false;
      if (Math.abs(deltaX) > 45) {
        if (deltaX < 0) { next(); } else { prev(); }
      }
      startAuto();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stopAuto(); } else { restartAuto(); }
    });

    render();
    startAuto();
  }());

  /* ------------------------------------------------------------------
     Quote form validation
     ------------------------------------------------------------------ */
  (function initForm() {
    var form = document.getElementById('quoteForm');
    if (!form) { return; }

    var statusEl = document.getElementById('formStatus');
    var submitBtn = document.getElementById('submitBtn');

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    function setError(field, errorId, message) {
      var errEl = document.getElementById(errorId);
      if (errEl) { errEl.textContent = message || ''; }
      if (field && field.classList) {
        field.classList.toggle('is-invalid', Boolean(message));
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
      }
      return !message;
    }

    function digitsOf(value) {
      return (value || '').replace(/\D/g, '');
    }

    function validateName() {
      var el = form.elements.name;
      var v = el.value.trim();
      if (!v) { return setError(el, 'err-name', 'Please tell us your name.'); }
      if (v.length < 2) { return setError(el, 'err-name', 'That name looks a little short.'); }
      return setError(el, 'err-name', '');
    }

    function validatePhone() {
      var el = form.elements.phone;
      var d = digitsOf(el.value);
      if (!d) { return setError(el, 'err-phone', 'A phone number lets us text your quote.'); }
      if (d.length < 10 || d.length > 15) {
        return setError(el, 'err-phone', 'Please enter a valid 10-digit phone number.');
      }
      return setError(el, 'err-phone', '');
    }

    function validateEmail() {
      var el = form.elements.email;
      var v = el.value.trim();
      if (!v) { return setError(el, 'err-email', 'We need an email to send your written quote.'); }
      if (!EMAIL_RE.test(v)) { return setError(el, 'err-email', 'That email address doesn’t look right.'); }
      return setError(el, 'err-email', '');
    }

    function validateService() {
      var el = form.elements.service;
      if (!el.value) { return setError(el, 'err-service', 'Pick the service you need.'); }
      return setError(el, 'err-service', '');
    }

    function validateConsent() {
      var el = form.elements.consent;
      var errEl = document.getElementById('err-consent');
      if (!el.checked) {
        if (errEl) { errEl.textContent = 'Please allow us to contact you about your quote.'; }
        return false;
      }
      if (errEl) { errEl.textContent = ''; }
      return true;
    }

    /* Live re-validation once a field has been touched */
    [
      ['name', validateName],
      ['phone', validatePhone],
      ['email', validateEmail],
      ['service', validateService]
    ].forEach(function (pair) {
      var el = form.elements[pair[0]];
      if (!el) { return; }
      el.addEventListener('blur', pair[1]);
      el.addEventListener('input', function () {
        if (el.classList.contains('is-invalid')) { pair[1](); }
      });
      el.addEventListener('change', function () {
        if (el.classList.contains('is-invalid')) { pair[1](); }
      });
    });

    var consentEl = form.elements.consent;
    if (consentEl) { consentEl.addEventListener('change', validateConsent); }

    function showStatus(type, html) {
      if (!statusEl) { return; }
      statusEl.className = 'form__status form__status--' + type;
      statusEl.innerHTML = html;
      statusEl.hidden = false;
    }

    function buildMailto(data) {
      var subject = 'Cleaning quote request — ' + data.name + (data.city ? ' (' + data.city + ')' : '');
      var lines = [
        'New quote request from the Tori’s Cleaning Service website.',
        '',
        'Name: ' + data.name,
        'Phone: ' + data.phone,
        'Email: ' + data.email,
        'City / neighborhood: ' + (data.city || 'Not provided'),
        'Service needed: ' + data.service,
        'Frequency: ' + (data.frequency || 'Not specified'),
        'Home size: ' + (data.size || 'Not specified'),
        'Preferred timing: ' + (data.when || 'Not specified'),
        '',
        'Notes:',
        data.message || '(none)'
      ];
      return 'mailto:hello@toriscleaningservice.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(lines.join('\n'));
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var checks = [
        validateName(),
        validatePhone(),
        validateEmail(),
        validateService(),
        validateConsent()
      ];

      if (checks.indexOf(false) !== -1) {
        showStatus('err',
          '<strong>Almost there.</strong>Please fix the highlighted fields above, then send again — ' +
          'or just call <a href="tel:+17135550142">(713) 555-0142</a>.');
        var firstBad = form.querySelector('.is-invalid') ||
                       (consentEl && !consentEl.checked ? consentEl : null);
        if (firstBad && typeof firstBad.focus === 'function') {
          firstBad.focus({ preventScroll: false });
        }
        return;
      }

      var data = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        city: form.elements.city.value.trim(),
        service: form.elements.service.value,
        frequency: form.elements.frequency.value,
        size: form.elements.size.value,
        when: form.elements.when.value,
        message: form.elements.message.value.trim()
      };

      var mailto = buildMailto(data);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Opening your email…';
      }

      showStatus('ok',
        '<strong>Thanks, ' + data.name.split(' ')[0].replace(/[<>&]/g, '') + '!</strong>' +
        'Your email app is opening with the request ready to send — just hit send and we’ll reply ' +
        'the same business day with a flat price. In a hurry? ' +
        '<a href="tel:+17135550142">Call (713) 555-0142</a> and we’ll sort it out in two minutes.');

      window.location.href = mailto;

      window.setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send My Quote Request';
        }
      }, 2500);
    });
  }());

  /* ------------------------------------------------------------------
     Smooth scrolling fallback for browsers without CSS scroll-behavior
     ------------------------------------------------------------------ */
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) { return; }
      var id = link.getAttribute('href');
      if (!id || id === '#') { return; }
      var target = document.querySelector(id);
      if (!target) { return; }
      e.preventDefault();
      var offset = (header ? header.offsetHeight : 0) + 16;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo(0, top);
    });
  }

}());
