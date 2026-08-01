// =========================================================
// MASCOL — site script
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Dark / Light theme toggle ---- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('mascol-theme');
  if (savedTheme === 'light') root.setAttribute('data-theme', 'light');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('mascol-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('mascol-theme', 'light');
      }
    });
  }

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  /* ---- Fleet showcase arrows ---- */
  const fleetScroll = document.getElementById('fleetScroll');
  const fleetPrev = document.getElementById('fleetPrev');
  const fleetNext = document.getElementById('fleetNext');
  if (fleetScroll && fleetPrev && fleetNext) {
    const step = () => {
      const item = fleetScroll.querySelector('.fleet-item');
      const gap = parseFloat(getComputedStyle(fleetScroll).gap) || 18;
      return item ? item.getBoundingClientRect().width + gap : 300;
    };
    fleetPrev.addEventListener('click', () => fleetScroll.scrollBy({ left: -step(), behavior: 'smooth' }));
    fleetNext.addEventListener('click', () => fleetScroll.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  /* ---- Footer year ---- */
  const yearEls = document.querySelectorAll('.year, #year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = currentYear; });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Count-up stats ---- */
  const statNums = document.querySelectorAll('.stat .num');
  const animateCount = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/[\d.]+/);
    if (!match) return; // e.g. "24/7" — leave as-is
    const target = parseFloat(match[0]);
    const suffix = raw.replace(match[0], '');
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && statNums.length) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNums.forEach(el => statIO.observe(el));
  }

  /* ---- Language switch (SW default, EN toggle via data-i18n-en) ---- */
  const langButtons = document.querySelectorAll('.lang-btn');
  const setLang = (lang) => {
    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      if (lang === 'en') {
        if (!el.dataset.swOriginal) el.dataset.swOriginal = el.textContent;
        el.textContent = el.dataset.i18nEn;
      } else if (el.dataset.swOriginal) {
        el.textContent = el.dataset.swOriginal;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder-en]').forEach(el => {
      if (lang === 'en') {
        if (!el.dataset.swPlaceholder) el.dataset.swPlaceholder = el.getAttribute('placeholder');
        el.setAttribute('placeholder', el.dataset.i18nPlaceholderEn);
      } else if (el.dataset.swPlaceholder) {
        el.setAttribute('placeholder', el.dataset.swPlaceholder);
      }
    });
    document.querySelectorAll('[data-i18nhtml-en]').forEach(el => {
      if (lang === 'en') {
        if (!el.dataset.swHtml) el.dataset.swHtml = el.innerHTML;
        el.innerHTML = el.dataset.i18nhtmlEn;
      } else if (el.dataset.swHtml) {
        el.innerHTML = el.dataset.swHtml;
      }
    });
    langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    document.documentElement.lang = lang;
    localStorage.setItem('mascol-lang', lang);
  };
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  // default to Swahili unless previously chosen otherwise
  const savedLang = localStorage.getItem('mascol-lang');
  if (savedLang === 'en') setLang('en');
  else {
    langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === 'sw'));
  }

});
