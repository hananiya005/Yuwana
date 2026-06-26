/* ================================================
   HMB VENTURES — main.js
   Contact: Web3Forms + WhatsApp
   ================================================ */

const WEB3FORMS_KEY = 'w3f_6214a19eed89ab1142a74e49f85a47a8614b2d90cfc84921';
const WA_NUMBER     = '2348127450087';

// ── HERO CANVAS ANIMATION ─────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

  function Particle() { this.reset(); }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.r = Math.random() * 1.8 + .4;
    this.vx = (Math.random() - .5) * .4; this.vy = (Math.random() - .5) * .4;
    this.alpha = Math.random() * .6 + .15;
    this.color = Math.random() > .7 ? '#E8336D' : '#6274C8';
  };
  Particle.prototype.update = function () {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  function init() { resize(); particles = Array.from({ length: 120 }, () => new Particle()); }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(98,116,200,${(1 - d / 110) * .2})`;
          ctx.lineWidth = .6; ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      p.update();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill(); ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset()); });
  init(); draw();
})();

// ── COUNTER ANIMATION ─────────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.innerHTML = Math.floor(current) + suffix;
    }, 25);
  });
}
let countersRan = false;
setTimeout(() => { if (!countersRan) { animateCounters(); countersRan = true; } }, 1000);

// ── SCROLL REVEAL ─────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── NAV SCROLL + HAMBURGER ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
});

const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => document.body.classList.toggle('mobile-menu-open'));
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.body.classList.remove('mobile-menu-open'));
});

// ── SMOOTH SCROLL ─────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── TOAST ─────────────────────────────────────────────────────────────
function showToast(msg, duration = 4500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── CONTACT FORM — WEB3FORMS + WHATSAPP ──────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // — Validation —
    let valid = true;
    contactForm.querySelectorAll('.field-error').forEach(el => el.remove());
    contactForm.querySelectorAll('input,textarea,select').forEach(el => el.classList.remove('error'));

    function fieldErr(id, msg) {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.add('error');
      const span = document.createElement('span');
      span.className = 'field-error';
      span.textContent = msg;
      el.parentElement.appendChild(span);
      valid = false;
    }

    const fname   = document.getElementById('fname');
    const email   = document.getElementById('email');
    const service = document.getElementById('service');
    const message = document.getElementById('message');

    if (!fname.value.trim())   fieldErr('fname',   'First name is required');
    if (!email.value.trim())   fieldErr('email',   'Email address is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) fieldErr('email', 'Enter a valid email');
    if (!service.value)        fieldErr('service', 'Please select a service');
    if (!message.value.trim()) fieldErr('message', 'Please describe your project');

    if (!valid) return;

    // — Loading state —
    const btn     = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoad = document.getElementById('btn-loading');
    const statusEl = document.getElementById('form-status');

    btn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoad) btnLoad.style.display = 'inline';
    statusEl.textContent = '';
    statusEl.className = '';

    // — Collect data —
    const fullName = (fname.value.trim() + ' ' + (document.getElementById('lname')?.value || '')).trim();
    const params = {
      name:    fullName,
      email:   email.value.trim(),
      phone:   document.getElementById('phone')?.value || 'Not provided',
      company: document.getElementById('company')?.value || 'Not provided',
      service: service.value,
      budget:  document.getElementById('budget')?.value || 'Not specified',
      message: message.value.trim(),
    };

    // — Send via Web3Forms —
    let emailSent = false;
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Inquiry from ${params.name} — HMB Ventures`,
          from_name: params.name,
          email: params.email,
          message:
            `Name: ${params.name}\n` +
            `Email: ${params.email}\n` +
            `Phone: ${params.phone}\n` +
            `Company: ${params.company}\n` +
            `Service: ${params.service}\n` +
            `Budget: ${params.budget}\n\n` +
            `Message:\n${params.message}`,
          botcheck: false,
        }),
      });
      const data = await res.json();
      if (data.success) emailSent = true;
    } catch (err) {
      console.error('Web3Forms error:', err);
    }

    // — Reset UI —
    btn.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (btnLoad) btnLoad.style.display = 'none';

    // — WhatsApp message —
    const waText = encodeURIComponent(
      `*New Project Inquiry — HMB Ventures*\n\n` +
      `*Name:* ${params.name}\n` +
      `*Email:* ${params.email}\n` +
      `*Phone:* ${params.phone}\n` +
      `*Company:* ${params.company}\n` +
      `*Service:* ${params.service}\n` +
      `*Budget:* ${params.budget}\n\n` +
      `*Message:*\n${params.message}`
    );

    if (emailSent) {
      statusEl.textContent = '✅ Message sent! We\'ll be in touch within 24 hours.';
      statusEl.className = 'success';
      showToast('✅ Message sent to HMB Ventures!');
      contactForm.reset();
      // Also ping WhatsApp so nothing is missed
      setTimeout(() => {
        window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, '_blank');
      }, 1200);
    } else {
      // Fallback: WhatsApp so inquiry is never lost
      statusEl.textContent = '⚠️ Email unavailable — sending via WhatsApp instead.';
      statusEl.className = 'error-msg';
      setTimeout(() => window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, '_blank'), 600);
    }
  });
}

// ── CLIENT PORTAL AUTH ────────────────────────────────────────────────
const DEMO_USERS = [
  { email: 'client@hmbventures.com', password: 'hmb2025', name: 'Demo Client' },
];

const portalForm = document.getElementById('portal-login-form');
if (portalForm) {
  portalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email    = document.getElementById('portal-email').value.trim();
    const password = document.getElementById('portal-password').value;
    const msgEl    = document.getElementById('portal-message');
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      msgEl.textContent = `✅ Welcome back, ${user.name}!`;
      msgEl.className = 'success';
      sessionStorage.setItem('hmb_user', JSON.stringify(user));
      setTimeout(() => { window.location.href = 'portal-dashboard.html'; }, 1200);
    } else {
      msgEl.textContent = '❌ Invalid email or password.';
      msgEl.className = 'error-msg';
    }
  });
}

// Portal tabs
document.querySelectorAll('.portal-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.portal-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.portal-panel').forEach(p => p.style.display = 'none');
    const panel = document.getElementById(this.dataset.tab);
    if (panel) panel.style.display = 'block';
  });
});
