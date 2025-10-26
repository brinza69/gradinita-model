/* ===================================
   Grădinița Model - script.js
   JavaScript optimizat - Burger + Lightbox + Read More
   =================================== */

(function() {
    'use strict';

    // ===== MOBILE MENU (BURGER) =====
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const body = document.body;
        
        if (!menuToggle || !mobileMenu) return;
        
        // Toggle menu on button click
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;
            
            this.setAttribute('aria-expanded', newState);
            mobileMenu.classList.toggle('active', newState);
            mobileMenu.setAttribute('aria-hidden', !newState);
            body.classList.toggle('no-scroll', newState);
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
                menuToggle.focus();
            }
        });
        
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            menuToggle.setAttribute('aria-expanded', 'false');
            body.classList.remove('no-scroll');
        }
    }

    // ===== GALLERY LIGHTBOX =====
    function initLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        let lightbox = document.getElementById('lightbox');
        
        if (galleryItems.length === 0) return;
        
        // Create lightbox if it doesn't exist
        if (!lightbox) {
            lightbox = createLightboxHTML();
        }
        
        const lightboxImage = lightbox.querySelector('.lightbox-content');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        const body = document.body;
        
        let currentIndex = 0;
        let images = [];
        
        // Prepare images array
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                images.push({
                    full: img.getAttribute('data-full') || img.src,
                    alt: img.alt || `Imagine ${index + 1}`
                });
            }
            
            // Open lightbox on click
            item.addEventListener('click', function() {
                openLightbox(index);
            });
            
            // Keyboard accessibility
            item.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });
        
        function openLightbox(index) {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            body.classList.add('no-scroll');
            lightboxClose.focus();
            
            // Trap focus inside lightbox
            trapFocus(lightbox);
        }
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            body.classList.remove('no-scroll');
            lightboxImage.src = '';
            
            // Return focus to the gallery item that was clicked
            if (galleryItems[currentIndex]) {
                galleryItems[currentIndex].focus();
            }
        }
        
        function updateLightboxImage() {
            if (images[currentIndex]) {
                lightboxImage.src = images[currentIndex].full;
                lightboxImage.alt = images[currentIndex].alt;
            }
            
            // Show/hide prev/next buttons
            lightboxPrev.style.display = currentIndex > 0 ? 'flex' : 'none';
            lightboxNext.style.display = currentIndex < images.length - 1 ? 'flex' : 'none';
        }
        
        function showPrevImage() {
            if (currentIndex > 0) {
                currentIndex--;
                updateLightboxImage();
            }
        }
        
        function showNextImage() {
            if (currentIndex < images.length - 1) {
                currentIndex++;
                updateLightboxImage();
            }
        }
        
        // Event listeners for lightbox controls
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
        
        // Close on background click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        });
        
        // Simple swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    showNextImage();
                } else {
                    showPrevImage();
                }
            }
        }
        
        // Focus trap
        function trapFocus(element) {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', function(e) {
                if (e.key !== 'Tab') return;
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            });
        }
    }
    
    // Create lightbox HTML if not present
    function createLightboxHTML() {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Vizualizare imagine');
        lightbox.setAttribute('aria-hidden', 'true');
        
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Închide">×</button>
            <button class="lightbox-prev" aria-label="Imaginea anterioară">‹</button>
            <button class="lightbox-next" aria-label="Imaginea următoare">›</button>
            <div class="lightbox-content-wrapper">
                <img class="lightbox-content" src="" alt="" loading="eager">
            </div>
        `;
        
        document.body.appendChild(lightbox);
        return lightbox;
    }

    // ===== "CITEȘTE MAI MULT" (READ MORE) =====
    function initReadMore() {
        const readMoreBtn = document.querySelector('.read-more-btn');
        const fullText = document.querySelector('.about-text-full');
        
        if (!readMoreBtn || !fullText) return;
        
        readMoreBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;
            
            this.setAttribute('aria-expanded', newState);
            fullText.classList.toggle('show', newState);
            
            // Update button text
            const btnText = this.querySelector('span');
            if (btnText) {
                btnText.textContent = newState ? 'Citește mai puțin' : 'Citește mai mult';
            }
            
            // Scroll to button if collapsing
            if (!newState) {
                this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

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


