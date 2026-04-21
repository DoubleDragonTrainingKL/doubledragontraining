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

    try {
      const res = await fetch(applyForm.action, {
        method: 'POST',
        body: new FormData(applyForm),
        headers: { 'Accept': 'application/json' }
      });
      res.ok ? showSuccess() : showError();
    } catch {
      showError();
    }
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
