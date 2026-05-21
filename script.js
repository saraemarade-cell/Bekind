// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

// Donation amount buttons
function setAmount(val) {
  document.querySelectorAll('.dona-btn').forEach(b => b.classList.remove('dona-btn-active'));
  event.currentTarget.classList.add('dona-btn-active');
}

// Copy codice fiscale
function copyCodiceFiscale() {
  const cf  = document.getElementById('codiceFiscale').textContent;
  const msg = document.getElementById('copyMsg');
  navigator.clipboard.writeText(cf).then(() => {
    msg.textContent = 'Copiato!';
    setTimeout(() => { msg.textContent = 'Copia'; }, 2000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = cf;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    msg.textContent = 'Copiato!';
    setTimeout(() => { msg.textContent = 'Copia'; }, 2000);
  });
}

// Contact form — mailto fallback
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const nome     = form.nome.value.trim();
  const cognome  = form.cognome.value.trim();
  const email    = form.email.value.trim();
  const oggetto  = form.oggetto.value;
  const msg      = form.messaggio.value.trim();

  const subject = encodeURIComponent(`[Contatto BeKind] ${oggetto || 'Messaggio dal sito'} - ${nome} ${cognome}`);
  const body    = encodeURIComponent(
    `Nome: ${nome} ${cognome}\nEmail: ${email}\nArgomento: ${oggetto}\n\n${msg}`
  );

  window.location.href = `mailto:info@bekindfoundation.org?subject=${subject}&body=${body}`;

  form.style.display = 'none';
  success.style.display = 'block';
}

// Navbar scroll shadow
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,.1)' : '';
});

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.fondatrice-card, .programma-item, .fondo-card, .cpm-step, .unisciti-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
});
