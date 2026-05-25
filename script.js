// Navbar scroll shadow
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 8);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target))
    navLinks.classList.remove('open');
});

// Fade-up on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }});
}, { threshold: 0.1 });

document.querySelectorAll(
  '.fondatrice-card, .programma-item, .fondo-card, .unisciti-card, .stat, .cpm-steps li, .partner, .press-logo'
).forEach(el => { el.classList.add('fade-up'); observer.observe(el); });

// Copy codice fiscale
function copyCF() {
  const val = document.getElementById('cfValue').textContent;
  const btn = document.getElementById('copyBtn');
  navigator.clipboard.writeText(val).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = val; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  });
  btn.textContent = 'Copiato ✓';
  setTimeout(() => { btn.textContent = 'Copia'; }, 2000);
}

// Contact form — mailto
function inviaForm(e) {
  e.preventDefault();
  const f = document.getElementById('contactForm');
  const subject = encodeURIComponent(`[BeKind] ${f.oggetto.value || 'Messaggio'} — ${f.nome.value}`);
  const body    = encodeURIComponent(`Nome: ${f.nome.value}\nEmail: ${f.email.value}\nArgomento: ${f.oggetto.value}\n\n${f.messaggio.value}`);
  window.location.href = `mailto:info@bekindfoundation.org?subject=${subject}&body=${body}`;
  f.style.display = 'none';
  document.getElementById('formSuccess').style.display = 'flex';
  document.getElementById('formSuccess').style.flexDirection = 'column';
  document.getElementById('formSuccess').style.alignItems = 'center';
}
