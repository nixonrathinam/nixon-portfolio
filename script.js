/* ============================================
   NIXON RATHINAM PORTFOLIO — SCRIPT.JS
   ============================================ */

'use strict';

// ---- Utility ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initTypingEffect();
  initScrollReveal();
  initActiveNavLink();
  initSkillBars();
  initContactForm();
  initToast();
  setFooterYear();
  initSmoothScroll();
});

// ============================================
// 1. NAVBAR — Scroll glass effect
// ============================================
function initNavbar() {
  const navbar = $('#navbar');
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================
// 2. HAMBURGER MENU — Mobile
// ============================================
function initHamburger() {
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  let isOpen = false;

  hamburger.addEventListener('click', () => {
    isOpen = !isOpen;
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  $$('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) {
        isOpen = false;
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      isOpen = false;
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ============================================
// 3. TYPING EFFECT — Hero subtitle
// ============================================
function initTypingEffect() {
  const el = $('#typing-text');
  if (!el) return;

  const phrases = [
    'AI & Data Science Student',
    'Full Stack Developer',
    'Problem Solver',
    'ML Enthusiast',
    'Product Builder'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isPaused) {
      setTimeout(type, 1500);
      isPaused = false;
      return;
    }

    if (!isDeleting) {
      charIdx++;
      el.textContent = currentPhrase.slice(0, charIdx);

      if (charIdx === currentPhrase.length) {
        isPaused = true;
        isDeleting = true;
        setTimeout(type, 100);
        return;
      }
    } else {
      charIdx--;
      el.textContent = currentPhrase.slice(0, charIdx);

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 40 : 80;
    setTimeout(type, speed);
  }

  type();
}

// ============================================
// 4. SCROLL REVEAL — Intersection Observer
// ============================================
function initScrollReveal() {
  const revealEls = $$('.reveal');
  const eduItems = $$('.edu-item');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
  eduItems.forEach(el => observer.observe(el));
}

// ============================================
// 5. ACTIVE NAV LINK — Scroll spy
// ============================================
function initActiveNavLink() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = $(`.nav-links a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { threshold: 0.4, rootMargin: '-70px 0px 0px 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

// ============================================
// 6. SKILL BARS — Animated on scroll
// ============================================
function initSkillBars() {
  const bars = $$('.skill-bar-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width;
          bar.style.width = width + '%';
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
}

// ============================================
// 7. CONTACT FORM — Validation & Submission
// ============================================
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;
form.addEventListener('submit', async (e) => {
     e.preventDefault();

    const name = $('#contact-name').value.trim();
    const email = $('#contact-email-input').value.trim();
    const message = $('#contact-message').value.trim();
    const submitBtn = $('#form-submit-btn');
    const submitText = $('#submit-text');
    // Validate
    if (!name) {
      showToast('error', '⚠️', 'Please enter your name.');
      $('#contact-name').focus();
      return;
    }

    if (!email || !isValidEmail(email)) {
      showToast('error', '⚠️', 'Please enter a valid email address.');
      $('#contact-email-input').focus();
      return;
    }

    if (!message) {
      showToast('error', '⚠️', 'Please write a message.');
      $('#contact-message').focus();
      return;
    }

    // Simulate sending
    submitBtn.disabled = true;
submitText.textContent = "Sending...";

const formData = new FormData(form);

try {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData
  });

  const result = await response.json();

  if (result.success) {
    form.reset();
    showToast("success", "✅", "Message sent successfully!");
  } else {
    showToast("error", "❌", result.message);
  }

} catch (error) {
  console.error(error);
  showToast("error", "❌", "Failed to send message.");
}

submitBtn.disabled = false;
submitText.innerHTML = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2.5">
<line x1="22" y1="2" x2="11" y2="13"/>
<polygon points="22 2 15 22 11 13 2 9 22 2"/>
</svg>
Send Message
`;
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// 8. TOAST NOTIFICATION
// ============================================
let toastTimer = null;

function initToast() {
  // Pre-initialize
}

function showToast(type, icon, message) {
  const toast = $('#toast');
  const toastIcon = $('#toast-icon');
  const toastMsg = $('#toast-message');

  if (toastTimer) clearTimeout(toastTimer);

  toast.className = `toast ${type}`;
  toastIcon.textContent = icon;
  toastMsg.textContent = message;

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ============================================
// 9. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ============================================
// 10. FOOTER YEAR
// ============================================
function setFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ============================================
// 11. PARALLAX ORBS — Subtle mouse tracking
// ============================================
document.addEventListener('mousemove', (e) => {
  const orbs = $$('.orb');
  const { clientX, clientY } = e;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.006;
    const dx = (clientX - cx) * factor;
    const dy = (clientY - cy) * factor;
    orb.style.transform = `translate(${dx}px, ${dy}px)`;
  });
});

// ============================================
// 12. SPINNER CSS INJECTION
// ============================================
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin-icon {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
})();
