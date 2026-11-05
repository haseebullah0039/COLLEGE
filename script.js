const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Mobile menu
const navLinks = $('#navLinks');
$('#menuBtn').addEventListener('click', () => navLinks.classList.toggle('open'));
$$('#navLinks a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Dark mode (remembered)
const themeBtn = $('#themeToggle');
function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeBtn.textContent = dark ? '☀️' : '🌙';
  try { localStorage.setItem('dark', dark ? '1' : '0'); } catch (e) {}
}
try { setTheme(localStorage.getItem('dark') === '1'); } catch (e) {}
themeBtn.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));

// Scroll: header shadow, back-to-top, active nav link
const sections = $$('section[id]');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  $('#header').classList.toggle('scrolled', y > 20);
  $('#toTop').classList.toggle('show', y > 500);
  let current = '';
  sections.forEach(s => { if (y >= s.offsetTop - 120) current = s.id; });
  $$('#navLinks a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current && !a.classList.contains('btn')));
});
$('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Reveal on scroll
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObs.observe(el));

// Animated counters
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.target;
    let n = 0; const step = Math.max(1, Math.ceil(target / 80));
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = n.toLocaleString() + (target >= 1000 ? '+' : '');
      if (n >= target) clearInterval(t);
    }, 20);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
$$('.counter').forEach(c => counterObs.observe(c));

// Course filter
$$('.filter').forEach(btn => btn.addEventListener('click', () => {
  $$('.filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  $$('#courseGrid .card').forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.cat !== f));
}));

// Testimonial slider
const slides = $$('.slide'), dotsBox = $('.dots');
let idx = 0, timer;
slides.forEach((_, i) => {
  const d = document.createElement('span');
  d.addEventListener('click', () => { show(i); restart(); });
  dotsBox.appendChild(d);
});
function show(i) {
  idx = i;
  slides.forEach((s, k) => s.classList.toggle('active', k === i));
  $$('span', dotsBox).forEach((d, k) => d.classList.toggle('active', k === i));
}
function restart() { clearInterval(timer); timer = setInterval(() => show((idx + 1) % slides.length), 5000); }
show(0); restart();

// Form validation
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#name').value.trim(), email = $('#email').value.trim();
  let ok = true;
  $('#nameErr').textContent = name.length < 3 ? (ok = false, 'Please enter your full name.') : '';
  $('#emailErr').textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : (ok = false, 'Please enter a valid email.');
  if (ok) {
    $('#success').textContent = `Thank you, ${name}! We received your application for ${$('#course').value}.`;
    e.target.reset();
  } else $('#success').textContent = '';
});

$('#year').textContent = new Date().getFullYear();
