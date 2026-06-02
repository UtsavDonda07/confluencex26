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

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
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
    if (menu.classList.contains('open') && !menu.contains(e.target)) {
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

/* ============================================
   VISITOR COUNTER — Abacus API with Session Deduplication
   ============================================ */
(function initVisitorCounter() {
  const countEl = document.getElementById('visitorCount');
  if (!countEl) return;

  const namespace = 'confluencex26-vgec';
  const key = 'unique-visits-v1';
  const offset = 0; // Start count fresh from the API without offset

  // Check if we already registered a hit during this user session (e.g. within 30 minutes in localStorage)
  const lastVisitTime = localStorage.getItem('confluencex26_last_visit_time');
  const now = Date.now();
  const sessionDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  let isNewVisit = true;
  if (lastVisitTime) {
    const elapsed = now - parseInt(lastVisitTime, 10);
    if (!isNaN(elapsed) && elapsed < sessionDuration) {
      isNewVisit = false;
    }
  }

  // Choose API endpoint: increment (hit) on new visit, or just get (get) on refresh
  const action = isNewVisit ? 'hit' : 'get';
  const apiUrl = `https://abacus.jasoncameron.dev/${action}/${namespace}/${key}`;

  // Update last visit time on page load to slide the 30-min session window
  localStorage.setItem('confluencex26_last_visit_time', now.toString());

  // Use cached count as fallback
  let cachedCount = parseInt(localStorage.getItem('confluencex26_last_count'), 10) || (offset + 2);
  countEl.textContent = '—';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('API response error');
      return response.json();
    })
    .then(data => {
      if (data && typeof data.value === 'number') {
        const total = data.value + offset;
        localStorage.setItem('confluencex26_last_count', total.toString());
        animateCountUp(countEl, total);
      } else {
        throw new Error('Invalid data format');
      }
    })
    .catch(err => {
      console.warn('Visitor counter error, using fallback:', err);
      animateCountUp(countEl, cachedCount);
    });

  // Smooth Ease-Out Count Up Animation
  function animateCountUp(el, total) {
    el.style.textShadow = 'none';
    
    // Animate from 0 for small numbers, or from 85% of total for larger numbers
    let start = 0;
    if (total > 50) {
      start = Math.floor(total * 0.85);
    }
    
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function update(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (total - start) * easeProgress);
      
      el.textContent = current.toLocaleString('en-IN');
      
      // Subtle pulse/glow while counting
      if (progress < 1) {
        el.style.textShadow = '0 0 5px rgba(124,58,237,0.3)';
        requestAnimationFrame(update);
      } else {
        el.textContent = total.toLocaleString('en-IN');
        // Final purple-cyan glow finish
        el.style.textShadow = '0 0 10px rgba(124,58,237,0.6), 0 0 20px rgba(6,182,212,0.4)';
      }
    }
    
    requestAnimationFrame(update);
  }
})();

/* ============================================
   VIRTUAL CHEMLAB SIMULATOR
   ============================================ */
(function initChemLab() {
  const canvas = document.getElementById('reactorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Sliders & UI Elements
  const tempSlider = document.getElementById('temp-slider');
  const catSlider = document.getElementById('cat-slider');
  const tempVal = document.getElementById('temp-val');
  const catVal = document.getElementById('cat-val');
  const tempOptLabel = document.getElementById('temp-opt-label');
  const catOptLabel = document.getElementById('cat-opt-label');
  
  const yieldVal = document.getElementById('yield-val');
  const rateVal = document.getElementById('rate-val');
  const yieldFeedback = document.getElementById('yield-feedback');
  const rateFeedback = document.getElementById('rate-feedback');
  
  const reactorStatus = document.getElementById('reactor-status');
  const reactorPulse = document.getElementById('reactor-pulse');
  const equationEl = document.getElementById('reaction-equation');
  const descEl = document.getElementById('reaction-desc');

  const presetBtns = document.querySelectorAll('.preset-btn');

  // Reaction presets config
  const presets = {
    aspirin: {
      name: 'Aspirin Synthesis',
      equation: 'C₇H₆O₃ (Salicylic) + C₄H₆O₃ → C₉H₈O₄ (Aspirin) + CH₃COOH',
      desc: 'Aspirin synthesis is moderately exothermic. Requires low-to-moderate temperature and acid catalyst concentration to prevent decomposition.',
      optTemp: 75,
      optCat: 35,
      tempRange: [30, 500],
      catRange: [0, 100],
      maxRate: 0.12,
      particleColor: '#f3e8ff', // pink/white
    },
    hydrogen: {
      name: 'Green Hydrogen Production',
      equation: '2H₂O (Liquid) + Electricity → 2H₂ (Gas) + O₂ (Gas)',
      desc: 'Electrolysis of water. Reaction rate increases exponentially with temperature (improving ion mobility) and catalyst/electrolyte concentration.',
      optTemp: 400,
      optCat: 85,
      tempRange: [30, 500],
      catRange: [0, 100],
      maxRate: 0.85,
      particleColor: '#06b6d4', // cyan gas
    },
    ethanol: {
      name: 'Bio-Ethanol Fermentation',
      equation: 'C₆H₁₂O₆ (Glucose) + Yeast → 2C₂H₅OH (Ethanol) + 2CO₂',
      desc: 'Biological fermentation using yeast enzymes. Highly sensitive to heat — yeast enzymes denature above 45°C, and yeast is dormant below 20°C.',
      optTemp: 35,
      optCat: 12,
      tempRange: [30, 500],
      catRange: [0, 100],
      maxRate: 0.04,
      particleColor: '#f59e0b', // golden yellow
    }
  };

  let currentReaction = 'aspirin';
  let temp = parseInt(tempSlider.value, 10);
  let catalyst = parseInt(catSlider.value, 10);

  // Setup presets configuration labels
  function updatePresetLabels() {
    const config = presets[currentReaction];
    equationEl.textContent = config.equation;
    descEl.textContent = config.desc;
    tempOptLabel.textContent = `Target: ${config.optTemp}°C`;
    catOptLabel.textContent = `Target: ${config.optCat}%`;
  }

  // Preset button listeners
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentReaction = btn.dataset.reaction;
      
      // Reset sliders to some default within ranges or preset targets
      if (currentReaction === 'aspirin') {
        tempSlider.value = 80;
        catSlider.value = 30;
      } else if (currentReaction === 'hydrogen') {
        tempSlider.value = 350;
        catSlider.value = 75;
      } else {
        tempSlider.value = 30;
        catSlider.value = 10;
      }
      
      temp = parseInt(tempSlider.value, 10);
      catalyst = parseInt(catSlider.value, 10);
      
      tempVal.textContent = temp;
      catVal.textContent = catalyst;
      
      updatePresetLabels();
      updateSimulation();
    });
  });

  // Sliders listeners
  tempSlider.addEventListener('input', () => {
    temp = parseInt(tempSlider.value, 10);
    tempVal.textContent = temp;
    updateSimulation();
  });

  catSlider.addEventListener('input', () => {
    catalyst = parseInt(catSlider.value, 10);
    catVal.textContent = catalyst;
    updateSimulation();
  });

  // Reaction Math State
  let yieldPercentage = 0;
  let reactionRate = 0;
  let statusText = 'Reactor Operating: Stable';
  let statusColorClass = 'active'; // active, warning, danger
  let coreGlowColor = 'rgba(124,58,237,0.3)';

  function updateSimulation() {
    const config = presets[currentReaction];
    let T = temp;
    let C = catalyst;
    
    let curYield = 0;
    let curRate = 0;
    let state = 'Reactor Operating: Stable';
    let statusClass = 'active';
    
    // Core color calculations based on Temp
    if (T < 100) {
      coreGlowColor = `rgba(6, 182, 212, ${T / 100 * 0.4})`; // Cold (cyan)
    } else if (T < 250) {
      coreGlowColor = `rgba(168, 85, 247, 0.4)`; // Warm (purple)
    } else {
      coreGlowColor = `rgba(239, 68, 68, ${Math.min(0.8, 0.4 + (T - 250) / 250 * 0.4)})`; // Hot (red)
    }

    if (currentReaction === 'aspirin') {
      if (T > 160) {
        curYield = 0;
        curRate = 0;
        state = 'Critical: Aspirin Decomposed!';
        statusClass = 'danger';
      } else {
        // Gaussian bell curve for Temperature (optimal 75)
        const tDiff = Math.abs(T - 75);
        const tFactor = Math.max(0, 1 - (tDiff / 40)); // drops to 0 at 35 or 115
        
        // Gaussian bell curve for Catalyst (optimal 35)
        const cDiff = Math.abs(C - 35);
        const cFactor = Math.max(0, 1 - (cDiff / 25)); // drops to 0 at 10 or 60
        
        curYield = Math.round(100 * tFactor * cFactor);
        curRate = config.maxRate * tFactor * cFactor;
        
        if (curYield > 85) {
          state = 'Optimal Synthesis Rate';
        } else if (curYield > 40) {
          state = 'Reaction Active (Sub-optimal)';
          statusClass = 'warning';
        } else {
          state = 'Reactor Idle: Low Kinetics';
          statusClass = 'warning';
        }
      }
    } 
    else if (currentReaction === 'hydrogen') {
      if (T > 460) {
        state = 'Overheating Warning: High Pressure!';
        statusClass = 'warning';
      }
      
      // Needs high temperature and high catalyst
      const tFactor = Math.max(0, Math.min(1, (T - 150) / 250)); // starts at 150, max at 400
      const cFactor = Math.max(0, Math.min(1, C / 85)); // max at 85
      
      // Calculate closeness to target for perfect 100% yield
      const tDiff = Math.abs(T - 400);
      const tOptimal = Math.max(0, 1 - (tDiff / 100)); // tight peak
      const cDiff = Math.abs(C - 85);
      const cOptimal = Math.max(0, 1 - (cDiff / 20));
      
      const perfectFactor = tOptimal * cOptimal;
      curYield = Math.round(70 * tFactor * cFactor + 30 * perfectFactor);
      curYield = Math.max(0, Math.min(100, curYield));
      
      curRate = config.maxRate * tFactor * cFactor;
      
      if (curYield > 90) {
        state = 'Peak Hydrogen Production';
        if (statusClass !== 'warning') statusClass = 'active';
      } else if (curYield > 40) {
        state = 'Synthesis Active';
        if (statusClass !== 'warning') statusClass = 'active';
      } else {
        state = 'Insufficient Cell Voltage / Temp';
        statusClass = 'warning';
      }
    } 
    else if (currentReaction === 'ethanol') {
      if (T > 45) {
        curYield = 0;
        curRate = 0;
        state = 'Enzymes Denatured: Yeast Dead!';
        statusClass = 'danger';
      } else if (T < 22) {
        curYield = 0;
        curRate = 0;
        state = 'Inactive: Cold Dormancy';
        statusClass = 'warning';
      } else {
        // Very tight optimal range for biological processes
        const tDiff = Math.abs(T - 35);
        const tFactor = Math.max(0, 1 - (tDiff / 10)); // drops to 0 at 25 or 45
        
        const cDiff = Math.abs(C - 12);
        const cFactor = Math.max(0, 1 - (cDiff / 10)); // drops to 0 at 2 or 22
        
        curYield = Math.round(100 * tFactor * cFactor);
        curRate = config.maxRate * tFactor * cFactor;
        
        if (curYield > 90) {
          state = 'Optimal Fermentation Rate';
        } else if (curYield > 45) {
          state = 'Active Fermentation';
        } else {
          state = 'Struggling Culture: Check Temp';
          statusClass = 'warning';
        }
      }
    }

    yieldPercentage = curYield;
    reactionRate = curRate;
    statusText = state;
    statusColorClass = statusClass;
    
    // Update live metrics UI
    yieldVal.textContent = yieldPercentage;
    rateVal.textContent = reactionRate.toFixed(3);
    
    // Pulse color updates
    reactorPulse.className = `status-dot-pulse ${statusColorClass}`;
    reactorStatus.textContent = statusText;
    
    // Feedback texts
    if (yieldPercentage === 100) {
      yieldFeedback.textContent = '✨ Perfect yield achieved!';
      yieldFeedback.style.color = 'var(--cyan)';
    } else if (yieldPercentage > 75) {
      yieldFeedback.textContent = 'High output synthesis';
      yieldFeedback.style.color = '#10b981';
    } else if (yieldPercentage > 20) {
      yieldFeedback.textContent = 'Moderate product collection';
      yieldFeedback.style.color = 'var(--text-muted)';
    } else if (yieldPercentage > 0) {
      yieldFeedback.textContent = 'Trace product formed';
      yieldFeedback.style.color = 'var(--gold-light)';
    } else {
      yieldFeedback.style.color = '#ef4444';
      if (state.includes('Denatured') || state.includes('Decomposed')) {
        yieldFeedback.textContent = 'Synthesis broken!';
      } else {
        yieldFeedback.textContent = 'No product formed';
      }
    }

    if (reactionRate > 0.5) {
      rateFeedback.textContent = 'High speed kinetics';
      rateFeedback.style.color = 'var(--cyan)';
    } else if (reactionRate > 0.08) {
      rateFeedback.textContent = 'Stable reaction speed';
      rateFeedback.style.color = 'var(--text-muted)';
    } else if (reactionRate > 0) {
      rateFeedback.textContent = 'Slow reaction kinetics';
      rateFeedback.style.color = 'var(--gold-light)';
    } else {
      rateFeedback.textContent = 'Reaction halted';
      rateFeedback.style.color = '#ef4444';
    }
  }

  // Animation Particle System
  let particles = [];
  const particleCount = 25;
  
  // Pipeline path nodes for flow visualizer
  const pathPoints = [
    { x: 120, y: 150 }, // Up from Reactor
    { x: 120, y: 70 },  // To Condenser inlet
    { x: 380, y: 70 },  // Through Condenser
    { x: 380, y: 220 }, // Down to Separator collector
  ];

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        progress: Math.random(), // 0 to 1 along the path
        size: Math.random() * 2 + 1.5,
        offsetY: (Math.random() - 0.5) * 4, // slight variation in pipes
        speedFactor: Math.random() * 0.4 + 0.8,
      });
    }
  }

  // Get coordinate at progress along pathPoints
  function getPointOnPath(progress) {
    const totalSegments = pathPoints.length - 1;
    const segment = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
    const segmentProgress = (progress * totalSegments) - segment;
    
    const p1 = pathPoints[segment];
    const p2 = pathPoints[segment + 1];
    
    return {
      x: p1.x + (p2.x - p1.x) * segmentProgress,
      y: p1.y + (p2.y - p1.y) * segmentProgress
    };
  }

  // Draw loop
  let lastTime = 0;
  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const config = presets[currentReaction];

    // 1. Draw Piping Background Lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
    for (let i = 1; i < pathPoints.length; i++) {
      ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
    }
    ctx.stroke();

    // Draw pipe inner core
    ctx.strokeStyle = 'rgba(4,9,26,0.6)';
    ctx.lineWidth = 6;
    ctx.stroke();

    // 2. Update and Draw Flow Particles (speed proportional to reaction rate)
    if (reactionRate > 0) {
      const baseSpeed = 0.15; // path progress units per second
      const speed = baseSpeed * (reactionRate / config.maxRate) * 0.8;
      
      particles.forEach(p => {
        p.progress += speed * p.speedFactor * delta;
        if (p.progress > 1) {
          p.progress = 0;
        }

        const pt = getPointOnPath(p.progress);
        
        ctx.fillStyle = config.particleColor;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y + p.offsetY, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow on particles
        ctx.shadowColor = config.particleColor;
        ctx.shadowBlur = 4;
        ctx.arc(pt.x, pt.y + p.offsetY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });
    }

    // 3. Draw Reactor Core (X=120, Y=200, radius=45, height=90)
    const rx = 120;
    const ry = 200;
    const rw = 54;
    const rh = 90;
    
    // Draw Reactor outer frame
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2.5;
    
    // Rounded capsule reactor shape
    ctx.beginPath();
    ctx.roundRect(rx - rw/2, ry - rh/2, rw, rh, 18);
    ctx.fill();
    ctx.stroke();

    // Draw heating / cooling glow inside reactor
    ctx.fillStyle = coreGlowColor;
    ctx.beginPath();
    ctx.roundRect(rx - rw/2 + 3, ry - rh/2 + 3, rw - 6, rh - 6, 15);
    ctx.fill();

    // Draw little floating process bubbles inside reactor
    if (reactionRate > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      for (let i = 0; i < 5; i++) {
        const bx = rx + Math.sin(timestamp * 0.005 + i) * (rw/2 - 8);
        const by = ry + rh/2 - 10 - ((timestamp * (0.02 + i * 0.005) + i * 20) % (rh - 20));
        ctx.beginPath();
        ctx.arc(bx, by, Math.random() * 1.5 + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Label on reactor
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 9px var(--font-head)';
    ctx.textAlign = 'center';
    ctx.fillText('REACTOR', rx, ry + 4);

    // 4. Draw Condenser Column (Horizontal tube X=150 to 350, Y=70)
    const cx = 250;
    const cy = 70;
    const cw = 160;
    const ch = 20;

    // Condenser outer frame
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - cw/2, cy - ch/2, cw, ch, 4);
    ctx.fill();
    ctx.stroke();

    // Draw cooling jacket spiral coil inside condenser
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)'; // cooling water blue
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let x = cx - cw/2 + 8; x < cx + cw/2 - 8; x += 12) {
      ctx.moveTo(x, cy - ch/2 + 3);
      ctx.lineTo(x + 6, cy + ch/2 - 3);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = 'bold 8px var(--font-head)';
    ctx.fillText('CONDENSER', cx, cy + 25);

    // 5. Draw Separator Beaker (X=380, Y=220, width=44, height=75)
    const sx = 380;
    const sy = 220;
    const sw = 48;
    const sh = 70;

    // Collector glass beaker
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(sx - sw/2, sy - sh/2, sw, sh, [4, 4, 12, 12]);
    ctx.fill();
    ctx.stroke();

    // Draw collected product fluid inside beaker (height grows with yield)
    if (yieldPercentage > 0) {
      const fluidHeight = sh * 0.75 * (yieldPercentage / 100);
      const fluidY = sy + sh/2 - 3 - fluidHeight;
      ctx.fillStyle = config.particleColor + '33'; // transparent particle color
      ctx.beginPath();
      ctx.roundRect(sx - sw/2 + 3, fluidY, sw - 6, fluidHeight, [0, 0, 9, 9]);
      ctx.fill();

      // Fluid surface line
      ctx.strokeStyle = config.particleColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx - sw/2 + 3, fluidY);
      ctx.lineTo(sx + sw/2 - 3, fluidY);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 9px var(--font-head)';
    ctx.fillText('COLLECTOR', sx, sy + 4);

    requestAnimationFrame(animate);
  }

  // Start simulation
  updatePresetLabels();
  updateSimulation();
  initParticles();
  requestAnimationFrame(animate);
})();



