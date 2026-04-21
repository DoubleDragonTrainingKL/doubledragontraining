/* ═══════════════════════════════════════
   DOUBLE DRAGON — ELITE PERSONAL TRAINING
   js/main.js
   ═══════════════════════════════════════ */

// CURSOR
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();
  document.querySelectorAll('a, button, .stat-item, .step-card, .diff-card, .svc-item, .trainer-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); cursorRing.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); cursorRing.classList.remove('hovered'); });
  });
}

// NAV SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// MOBILE NAV
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// SCROLL REVEAL
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// SMOOTH SCROLL (offset for fixed nav)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - navbar.offsetHeight - 16, behavior: 'smooth' });
  });
});

// FORM
const applyForm = document.getElementById('applyForm');
const submitBtn = document.getElementById('submitBtn');
const submitTxt = document.getElementById('submitText');

if (applyForm) {
  applyForm.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitTxt.textContent = 'Sending…';

    // ── WIRE UP YOUR FORM BACKEND HERE ──────────────────────
    // OPTION A: Formspree (recommended — free at formspree.io)
    // const res = await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST', body: new FormData(applyForm),
    //   headers: { 'Accept': 'application/json' }
    // });
    // res.ok ? showSuccess() : showError();

    // OPTION B: EmailJS
    // emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', applyForm)
    //   .then(showSuccess, showError);

    // PLACEHOLDER — remove when wired up
    setTimeout(showSuccess, 1200);
  });
}

function showSuccess() {
  submitTxt.textContent = 'Application Sent ✓';
  submitBtn.style.background = '#1a3a1a';
  applyForm.querySelectorAll('input,select').forEach(el => el.disabled = true);
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.style.background = '';
    submitTxt.textContent = 'Submit Application';
    applyForm.reset();
    applyForm.querySelectorAll('input,select').forEach(el => el.disabled = false);
  }, 5000);
}
function showError() {
  submitTxt.textContent = 'Something went wrong — try WhatsApp';
  submitBtn.style.background = '#3a1a1a';
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.style.background = '';
    submitTxt.textContent = 'Submit Application';
  }, 4000);
}

// TESTIMONIAL SLIDER
(function() {
  const grid  = document.querySelector('.testi-grid');
  const cards = document.querySelectorAll('.testi-card');
  const dots  = document.querySelectorAll('.testi-dot');
  const prev  = document.getElementById('testiPrev');
  const next  = document.getElementById('testiNext');
  if (!grid || cards.length === 0) return;

  let current = 0;
  const total = cards.length;
  const isMobile = () => window.innerWidth <= 860;

  function goTo(idx) {
    current = (idx + total) % total;
    if (isMobile()) {
      // On mobile: show one card at a time
      cards.forEach((c, i) => {
        c.style.display = i === current ? 'flex' : 'none';
      });
    } else {
      // On desktop: show all three, scroll to current
      cards.forEach(c => c.style.display = 'flex');
      const cardW = cards[0].offsetWidth + 3; // width + gap
      grid.style.transform = `translateX(${-current * cardW}px)`;
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function init() {
    if (isMobile()) {
      grid.style.gridTemplateColumns = '1fr';
      cards.forEach((c, i) => { c.style.display = i === 0 ? 'flex' : 'none'; });
    } else {
      grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      cards.forEach(c => c.style.display = 'flex');
      grid.style.transform = 'translateX(0)';
      grid.style.overflow = 'visible';
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));

  // Swipe support
  let startX = 0;
  grid.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });

  window.addEventListener('resize', init);
  init();
})();
