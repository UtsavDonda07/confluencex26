/* ============================================
   ConfluenceX'26 — Main JavaScript
   Next Generation of Chemical Innovation
   ============================================ */

'use strict';

/* ============================================
   PARTICLE CANVAS — Molecular Animation
   ============================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, hexagons, animId;

  const PARTICLE_COUNT = 60;
  const HEX_COUNT = 12;
  const COLORS = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(168,85,247,', 'rgba(245,158,11,'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: randRange(-0.4, 0.4),
      vy: randRange(-0.5, -0.1),
      r: randRange(1.5, 4),
      alpha: randRange(0.3, 0.8),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: randRange(0.02, 0.06),
    };
  }

  function createHexagon() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      size: randRange(20, 55),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: randRange(-0.004, 0.004),
      alpha: randRange(0.04, 0.12),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: randRange(-0.15, 0.15),
      vy: randRange(-0.2, 0.05),
    };
  }

  function drawHexagon(cx, cy, size, rotation, alpha, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = size * Math.cos(angle);
      const py = size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = color + alpha + ')';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  function drawConnection(p1, p2, dist, maxDist) {
    const alpha = (1 - dist / maxDist) * 0.25;
    if (alpha <= 0) return;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    hexagons = Array.from({ length: HEX_COUNT }, createHexagon);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Draw hexagons
    hexagons.forEach(h => {
      h.x += h.vx;
      h.y += h.vy;
      h.rotation += h.rotSpeed;
      if (h.x < -80) h.x = W + 80;
      if (h.x > W + 80) h.x = -80;
      if (h.y < -80) h.y = H + 80;
      if (h.y > H + 80) h.y = -80;
      drawHexagon(h.x, h.y, h.size, h.rotation, h.alpha, h.color);
    });

    // Draw particles and connections
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;
      const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.2;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.min(pulseAlpha, 0.9) + ')';
      ctx.fill();

      // Draw glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      gradient.addColorStop(0, p.color + pulseAlpha * 0.4 + ')');
      gradient.addColorStop(1, p.color + '0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          drawConnection(p, p2, dist, maxDist);
        }
      }
    }
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    loop();
  });

  init();
  loop();
})();

/* ============================================
   COUNTDOWN TIMER
   ============================================ */
(function initCountdown() {
  const eventDate = new Date('2026-08-01T09:00:00+05:30').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateTimer() {
    const now = Date.now();
    const diff = eventDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
})();

/* ============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  function animateCounter(el, target) {
    let current = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================
   ACTIVE NAV ON SCROLL
   ============================================ */
(function initActiveNav() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  function onScroll() {
    const scrollY = window.scrollY;

    // Navbar shadow on scroll
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    const btt = document.getElementById('backToTop');
    if (btt) {
      if (scrollY > 500) btt.classList.add('visible');
      else btt.classList.remove('visible');
    }

    // Active section detection
    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================
   HAMBURGER MENU
   ============================================ */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('navLinks');
  if (!btn || !menu) return;

  function closeMenu() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      btn.classList.add('open');
      menu.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close on nav link click
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });
})();

/* ============================================
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================
   DOMAIN PILLS — STAGGERED ENTRANCE
   ============================================ */
(function initDomainPills() {
  const pills = document.querySelectorAll('.domain-pill');
  if (!pills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pills.forEach((pill, i) => {
          setTimeout(() => {
            pill.style.opacity = '1';
            pill.style.transform = 'translateY(0) scale(1)';
          }, i * 80);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  pills.forEach(pill => {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(20px) scale(0.95)';
    pill.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  if (pills[0]) observer.observe(pills[0]);
})();

/* ============================================
   TIMELINE PROGRESS LINE ANIMATION
   ============================================ */
(function initTimelineAnimation() {
  const line = document.querySelector('.timeline-line');
  if (!line) return;

  const wrapper = document.querySelector('.timeline-wrapper');
  if (!wrapper) return;

  line.style.transformOrigin = 'top';
  line.style.transform = 'scaleY(0)';
  line.style.transition = 'transform 1.5s ease';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          line.style.transform = 'scaleY(1)';
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(wrapper);
})();

/* ============================================
   SPONSOR TIER CARD GLOW ON HOVER
   ============================================ */
(function initSponsorCardHover() {
  const tierCards = document.querySelectorAll('.sponsor-tier-card');
  tierCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      tierCards.forEach(c => {
        if (c !== card) c.style.opacity = '0.6';
      });
    });
    card.addEventListener('mouseleave', () => {
      tierCards.forEach(c => { c.style.opacity = '1'; });
    });
  });
})();

/* ============================================
   HERO CONTENT REVEAL ON LOAD
   ============================================ */
(function initHeroReveal() {
  window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.classList.add('visible');
    }
  });
})();

/* ============================================
   GUIDELINE ITEMS — STAGGER ON SCROLL
   ============================================ */
(function initGuidelineStagger() {
  const items = document.querySelectorAll('.guideline-item');
  if (!items.length) return;

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach(item => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });

  if (items[0]) observer.observe(items[0].parentElement);
})();

console.log('%cConfluenceX\'26 🚀 Next Generation of Chemical Innovation', 'color:#7c3aed;font-size:14px;font-weight:bold;');
