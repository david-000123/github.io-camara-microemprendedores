document.addEventListener('DOMContentLoaded', function () {
  const nav  = document.getElementById('gen-nav');
  const btn  = document.getElementById('gen-ham');
  const menu = document.getElementById('gen-menu');
 
  if (!nav || !btn || !menu) return;
 
  // Guardar el padre original para restaurar al cerrar
  const originalParent = menu.parentNode;
 
  // Breakpoint sincronizado con CSS: 1300px
  const mqDesktop = window.matchMedia('(min-width: 1301px)');
 
  function isDesktop() {
    return mqDesktop.matches;
  }
 
  function closeMenu() {
    menu.classList.remove('open');
    nav.classList.remove('mobile-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menú');
 
    // Restaurar scroll del body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(document.body.dataset.scrollY || '0'));
    delete document.body.dataset.scrollY;
 
    // Devolver el <ul> al nav
    if (menu.parentNode !== originalParent) {
      originalParent.appendChild(menu);
    }
  }
 
  function openMenu() {
    // Guardar posición de scroll y bloquear el body
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
 
    // Mover el <ul> al <body> para escapar el stacking context del nav
    document.body.appendChild(menu);
 
    menu.classList.add('open');
    nav.classList.add('mobile-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Cerrar menú');
  }
 
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
 
  // Cerrar al hacer clic fuera
  document.addEventListener('click', function (e) {
    if (
      menu.classList.contains('open') &&
      !nav.contains(e.target) &&
      !menu.contains(e.target)
    ) {
      closeMenu();
    }
  });
 
  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      btn.focus();
    }
  });
 
  // Cerrar al hacer clic en un enlace
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
 
  // Cerrar al pasar a desktop
  mqDesktop.addEventListener('change', function (e) {
    if (e.matches) closeMenu();
  });
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9\s\-\+]+$/;

const fields = [
  { id: 'f-name',   wrap: 'wrap-name',   empty: 'El nombre es obligatorio.' },
  { id: 'f-phone',  wrap: 'wrap-phone',  empty: 'El teléfono es obligatorio.',  format: 'Número de teléfono inválido.',  re: PHONE_RE },
  { id: 'f-email',  wrap: 'wrap-email',  empty: 'El email es obligatorio.',     format: 'Formato de email inválido.',    re: EMAIL_RE },
  { id: 'f-sector', wrap: 'wrap-sector', empty: 'El sector es obligatorio.' },
  { id: 'f-msg',    wrap: 'wrap-msg',    empty: 'Este campo es obligatorio.' }
];

function setError(wrap, msg) {
  const wrapEl = document.getElementById(wrap);
  wrapEl.classList.add('has-error');
  let span = wrapEl.querySelector('.error-msg');
  if (!span) {
    span = document.createElement('span');
    span.className = 'error-msg';
    wrapEl.appendChild(span);
  }
  span.textContent = msg;
}

function clearError(wrap) {
  const wrapEl = document.getElementById(wrap);
  wrapEl.classList.remove('has-error');
  const span = wrapEl.querySelector('.error-msg');
  if (span) span.remove();
}

function validateField(f) {
  const el = document.getElementById(f.id);
  const val = el.value.trim();
  if (!val) { setError(f.wrap, f.empty); return false; }
  if (f.re && !f.re.test(val)) { setError(f.wrap, f.format); return false; }
  clearError(f.wrap);
  return true;
}

// Limpia el error en tiempo real mientras el usuario escribe
fields.forEach(f => {
  document.getElementById(f.id).addEventListener('input', () => validateField(f));
});

function submitForm(e) {
  e.preventDefault();
  const valid = fields.map(f => validateField(f));
  if (valid.every(Boolean)) {
    document.getElementById('modal').classList.add('active');
    document.getElementById('cf').reset();
    fields.forEach(f => clearError(f.wrap));
  } else {
    // Foco en el primer campo con error
    const firstError = document.querySelector('.has-error input, .has-error textarea');
    if (firstError) firstError.focus();
  }
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});
