// ===================================
// Grădinița Model — script.js
// - Burger menu mobil (toggle + accesibilitate)
// - Închidere la click pe link / în afară / Escape
// - Marcarea linkului activ (desktop + mobil)
// - Reset la resize (ieși din modul mobil)
// ===================================

(function () {
  // Elemente cheie din header-ul tău existent
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const body = document.body;

  if (!menuToggle || !mobileMenu) {
    console.warn('[GM] Lipsesc .menu-toggle sau #mobile-menu în HTML.');
    return;
  }

  const openMenu = () => {
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('no-scroll');
  };

  const toggleMenu = (e) => {
    e && e.stopPropagation();
    const isOpen = mobileMenu.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  };

  // 1) Toggle pe buton
  menuToggle.addEventListener('click', toggleMenu);

  // 2) Închide când dai click pe un link din sertar
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // 3) Închide când dai click în afara sertarului
  document.addEventListener('click', (e) => {
    const isOpen = mobileMenu.classList.contains('active');
    if (!isOpen) return;
    if (mobileMenu.contains(e.target) || menuToggle.contains(e.target)) return;
    closeMenu();
  });

  // 4) Închide cu Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // 5) Marchează linkul activ (ambele meniuri)
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const markActive = (root) => {
    root.querySelectorAll('a[href]').forEach(link => {
      const hrefAttr = (link.getAttribute('href') || '').toLowerCase();
      const file = hrefAttr.split('/').pop();
      if (file === current || (current === '' && file === 'index.html')) {
        link.classList.add('active');
      }
    });
  };

  const desktopNav = document.querySelector('.nav-links');
  if (desktopNav) markActive(desktopNav);
  markActive(mobileMenu);

  // 6) Reset la resize (dacă treci pe desktop, închide meniul mobil)
  const MQ_DESKTOP = 768;
  const handleResize = () => {
    if (window.innerWidth >= MQ_DESKTOP) {
      // asigură starea închisă în modul desktop
      closeMenu();
    }
  };
  window.addEventListener('resize', handleResize);

  // Inițializare
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');

  console.log('%c[GM] burger ready', 'color:#7BD389');
})();




// ===================================
// Galerie - Arată mai mult / mai puțin (responsiv: 4/6/8)
// ===================================
(function () {
  const grid = document.getElementById('gallery-grid');
  const btn = document.getElementById('show-more-btn');
  if (!grid || !btn) return; // rulează doar pe pagina galeriei

  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  let expanded = false; // stare: extins sau nu
  let visibleCount = 0;

  // Breakpoint-uri: <640px = 4, <1024px = 6, altfel 8
  const getItemsPerPage = () => {
    const w = window.innerWidth;
    if (w < 640) return 4;       // telefon
    if (w < 1024) return 6;      // tabletă
    return 8;                    // desktop
  };

  const updateGallery = () => {
    const perPage = getItemsPerPage();
    visibleCount = perPage;

    items.forEach((el, i) => {
      const shouldHide = !expanded && i >= perPage;
      el.classList.toggle('hidden', shouldHide);
    });

    if (items.length <= perPage) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'block';
      btn.textContent = expanded ? 'Arată mai puțin' : 'Arată mai mult';
    }
  };

  // Toggle extins / restrâns
  btn.addEventListener('click', () => {
    expanded = !expanded;
    updateGallery();
  });

  // Recalculează la redimensionare (debounce)
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      // dacă utilizatorul a extins, păstrăm extins,
      // doar recalculăm câte să arătăm când e restrâns
      updateGallery();
    }, 150);
  });

  // Inițial: restrâns
  updateGallery();
})();


