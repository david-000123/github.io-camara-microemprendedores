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
