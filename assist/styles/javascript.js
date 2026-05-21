 (function () {
      const nav  = document.getElementById('gen-nav');
      const btn  = document.getElementById('gen-ham');
      const menu = document.getElementById('gen-menu');
 
      btn.addEventListener('click', function () {
        const isOpen = menu.classList.toggle('open');
        nav.classList.toggle('mobile-open', isOpen);
 
        // Accesibilidad: actualiza aria-expanded y aria-label
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      });
 
      // Cierra el menú al hacer click fuera del nav
      document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) {
          menu.classList.remove('open');
          nav.classList.remove('mobile-open');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Abrir menú');
        }
      });
 
      // Cierra el menú con la tecla Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          menu.classList.remove('open');
          nav.classList.remove('mobile-open');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', 'Abrir menú');
          btn.focus();
        }
      });
    })();