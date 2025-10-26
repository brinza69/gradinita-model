/* ===================================
   GRĂDINIȚA MODEL - SCRIPT.JS
   Funcționalități: Burger Menu, Lightbox, Validare Formulare, Active Link
   Fără dependențe externe - Vanilla JavaScript
   =================================== */

(function() {
    'use strict';

    /* ===================================
       BURGER MENU & MOBILE NAVIGATION
       Toggle menu, blocare scroll, închidere pe ESC/click outside
       =================================== */
    const gmBurgerMenu = {
        init: function() {
            this.toggle = document.querySelector('.gm-nav__toggle');
            this.menu = document.getElementById('gm-mobile-menu');
            this.body = document.body;
            this.links = this.menu ? this.menu.querySelectorAll('.gm-mobile-menu__link') : [];

            if (!this.toggle || !this.menu) return;

            this.bindEvents();
        },

        bindEvents: function() {
            // Toggle menu la click pe burger
            this.toggle.addEventListener('click', () => this.toggleMenu());

            // Închide meniul când se dă click pe un link
            this.links.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Închide cu ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen()) {
                    this.closeMenu();
                }
            });

            // Închide când se dă click în afara meniului
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen() && 
                    !this.menu.contains(e.target) && 
                    !this.toggle.contains(e.target)) {
                    this.closeMenu();
                }
            });
        },

        toggleMenu: function() {
            const isOpen = this.isMenuOpen();
            
            if (isOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        },

        openMenu: function() {
            this.toggle.setAttribute('aria-expanded', 'true');
            this.menu.setAttribute('aria-hidden', 'false');
            this.menu.classList.add('gm-mobile-menu--active');
            this.body.classList.add('gm-no-scroll');
        },

        closeMenu: function() {
            this.toggle.setAttribute('aria-expanded', 'false');
            this.menu.setAttribute('aria-hidden', 'true');
            this.menu.classList.remove('gm-mobile-menu--active');
            this.body.classList.remove('gm-no-scroll');
        },

        isMenuOpen: function() {
            return this.menu.classList.contains('gm-mobile-menu--active');
        }
    };

    /* ===================================
       ACTIVE LINK HIGHLIGHTING
       Marchează linkul paginii curente în navbar
       =================================== */
    const gmActiveLink = {
        init: function() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('.gm-nav__link, .gm-mobile-menu__link');

            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href');
                
                if (linkPage === currentPage || 
                    (currentPage === '' && linkPage === 'index.html') ||
                    (currentPage === '/' && linkPage === 'index.html')) {
                    link.setAttribute('aria-current', 'page');
                }
            });
        }
    };

    /* ===================================
       LIGHTBOX GALLERY
       Galerie cu navigare, ESC, click outside, focus trap
       =================================== */
    const gmLightbox = {
        init: function() {
            this.lightbox = document.getElementById('gm-lightbox');
            this.lightboxImage = document.getElementById('gm-lightbox-image');
            this.galleryItems = document.querySelectorAll('.gm-gallery__item');
            this.closeBtn = document.querySelector('.gm-lightbox__close');
            this.prevBtn = document.querySelector('.gm-lightbox__prev');
            this.nextBtn = document.querySelector('.gm-lightbox__next');
            this.body = document.body;
            this.currentIndex = 0;
            this.galleryArray = Array.from(this.galleryItems);

            if (!this.lightbox || this.galleryArray.length === 0) return;

            this.bindEvents();
        },

        bindEvents: function() {
            // Click pe fiecare item din galerie
            this.galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => this.openLightbox(index));
                
                // Suport tastatură
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.openLightbox(index);
                    }
                });
            });

            // Buton închidere
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.closeLightbox());
            }

            // Click pe overlay pentru închidere
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });

            // Navigare cu butoane
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.showPrevious());
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.showNext());
            }

            // Navigare cu tastatură
            document.addEventListener('keydown', (e) => {
                if (!this.isLightboxOpen()) return;

                if (e.key === 'Escape') {
                    this.closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.showPrevious();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.showNext();
                }
            });

            // Suport swipe pe mobile
            this.addSwipeSupport();
        },

        openLightbox: function(index) {
            this.currentIndex = index;
            const item = this.galleryArray[index];
            const imageSrc = item.getAttribute('data-gm-full');
            const imageAlt = item.getAttribute('aria-label') || 'Imagine galerie';

            this.lightboxImage.src = imageSrc;
            this.lightboxImage.alt = imageAlt;
            
            this.lightbox.classList.add('gm-lightbox--active');
            this.lightbox.setAttribute('aria-hidden', 'false');
            this.body.classList.add('gm-no-scroll');

            // Focus pe butonul de închidere
            if (this.closeBtn) {
                this.closeBtn.focus();
            }

            // Trap focus în lightbox
            this.trapFocus();
        },

        closeLightbox: function() {
            this.lightbox.classList.remove('gm-lightbox--active');
            this.lightbox.setAttribute('aria-hidden', 'true');
            this.body.classList.remove('gm-no-scroll');

            // Returnează focus la elementul care a deschis lightbox-ul
            if (this.galleryArray[this.currentIndex]) {
                this.galleryArray[this.currentIndex].focus();
            }
        },

        showPrevious: function() {
            this.currentIndex = (this.currentIndex - 1 + this.galleryArray.length) % this.galleryArray.length;
            this.updateImage();
        },

        showNext: function() {
            this.currentIndex = (this.currentIndex + 1) % this.galleryArray.length;
            this.updateImage();
        },

        updateImage: function() {
            const item = this.galleryArray[this.currentIndex];
            const imageSrc = item.getAttribute('data-gm-full');
            const imageAlt = item.getAttribute('aria-label') || 'Imagine galerie';

            this.lightboxImage.src = imageSrc;
            this.lightboxImage.alt = imageAlt;
        },

        isLightboxOpen: function() {
            return this.lightbox.classList.contains('gm-lightbox--active');
        },

        trapFocus: function() {
            const focusableElements = this.lightbox.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            const handleTabKey = (e) => {
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
            };

            this.lightbox.addEventListener('keydown', handleTabKey);
        },

        addSwipeSupport: function() {
            let touchStartX = 0;
            let touchEndX = 0;

            this.lightbox.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            this.lightbox.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            });
        },

        handleSwipe: function(startX, endX) {
            const swipeThreshold = 50;
            const diff = endX - startX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff < 0) {
                    // Swipe left - următoarea imagine
                    this.showNext();
                } else {
                    // Swipe right - imaginea anterioară
                    this.showPrevious();
                }
            }
        }
    };

    /* ===================================
       FORM VALIDATION
       Validare email, telefon, consimțământ + feedback
       =================================== */
    const gmFormValidation = {
        init: function() {
            this.enrollmentForm = document.getElementById('gm-enrollment-form');
            this.contactForm = document.getElementById('gm-contact-form');

            if (this.enrollmentForm) {
                this.setupForm(this.enrollmentForm, 'enrollment');
            }

            if (this.contactForm) {
                this.setupForm(this.contactForm, 'contact');
            }
        },

        setupForm: function(form, formType) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form, formType);
            });

            // Validare în timp real
            const inputs = form.querySelectorAll('.gm-form__input, .gm-form__textarea, .gm-form__checkbox');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    // Șterge mesajul de eroare când utilizatorul începe să scrie
                    const errorId = input.id + '-error';
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                    input.classList.remove('gm-form__input--error');
                });
            });
        },

        handleSubmit: function(form, formType) {
            let isValid = true;
            const inputs = form.querySelectorAll('.gm-form__input, .gm-form__textarea, .gm-form__checkbox');

            // Validează toate câmpurile
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                this.submitForm(form, formType);
            } else {
                // Focus pe primul câmp cu eroare
                const firstError = form.querySelector('.gm-form__input--error, .gm-form__checkbox[aria-invalid="true"]');
                if (firstError) {
                    firstError.focus();
                }
            }
        },

        validateField: function(field) {
            const fieldType = field.type;
            const fieldValue = field.value.trim();
            const isRequired = field.hasAttribute('required');
            const errorId = field.id + '-error';
            const errorElement = document.getElementById(errorId);

            let errorMessage = '';

            // Validare câmpuri required
            if (isRequired && !fieldValue) {
                errorMessage = 'Acest câmp este obligatoriu.';
            }
            // Validare email
            else if (fieldType === 'email' && fieldValue) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldValue)) {
                    errorMessage = 'Vă rugăm să introduceți o adresă de email validă.';
                }
            }
            // Validare telefon
            else if (fieldType === 'tel' && fieldValue) {
                const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
                if (!phoneRegex.test(fieldValue)) {
                    errorMessage = 'Vă rugăm să introduceți un număr de telefon valid.';
                }
            }
            // Validare checkbox consimțământ
            else if (fieldType === 'checkbox' && isRequired && !field.checked) {
                errorMessage = 'Trebuie să fiți de acord cu politica de confidențialitate.';
            }
            // Validare select
            else if (field.tagName === 'SELECT' && isRequired && !fieldValue) {
                errorMessage = 'Vă rugăm să selectați o opțiune.';
            }

            // Afișare eroare
            if (errorMessage && errorElement) {
                errorElement.textContent = errorMessage;
                field.classList.add('gm-form__input--error');
                field.setAttribute('aria-invalid', 'true');
                return false;
            } else {
                if (errorElement) {
                    errorElement.textContent = '';
                }
                field.classList.remove('gm-form__input--error');
                field.removeAttribute('aria-invalid');
                return true;
            }
        },

        submitForm: function(form, formType) {
            const feedbackId = formType === 'enrollment' ? 'gm-form-feedback' : 'gm-contact-form-feedback';
            const feedbackElement = document.getElementById(feedbackId);
            const submitButton = form.querySelector('button[type="submit"]');

            // Dezactivează butonul de submit
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Se trimite...';
            }

            // Simulare trimitere formular (în producție, aici ar fi un fetch/AJAX)
            setTimeout(() => {
                // Succes
                if (feedbackElement) {
                    feedbackElement.textContent = 'Mulțumim! Mesajul dumneavoastră a fost trimis cu succes. Vă vom contacta în curând.';
                    feedbackElement.className = 'gm-form__feedback gm-form__feedback--success';
                }

                // Resetare formular
                form.reset();

                // Reactivează butonul
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = formType === 'enrollment' ? 'Trimite cererea' : 'Trimite mesajul';
                }

                // Scroll la mesajul de succes
                if (feedbackElement) {
                    feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Ascunde mesajul după 10 secunde
                setTimeout(() => {
                    if (feedbackElement) {
                        feedbackElement.className = 'gm-form__feedback';
                    }
                }, 10000);

            }, 1500);

            // În caz de eroare (exemplu)
            // if (feedbackElement) {
            //     feedbackElement.textContent = 'A apărut o eroare. Vă rugăm să încercați din nou.';
            //     feedbackElement.className = 'gm-form__feedback gm-form__feedback--error';
            // }
        }
    };

    /* ===================================
       LAZY LOADING IMAGES
       IntersectionObserver pentru imagini cu data-gm-src
       =================================== */
    const gmLazyLoad = {
        init: function() {
            // Verifică suport pentru loading="lazy"
            if ('loading' in HTMLImageElement.prototype) {
                const images = document.querySelectorAll('img[loading="lazy"]');
                images.forEach(img => {
                    if (img.dataset.gmSrc) {
                        img.src = img.dataset.gmSrc;
                    }
                });
            } else {
                // Fallback cu IntersectionObserver pentru browsere vechi
                this.observeImages();
            }
        },

        observeImages: function() {
            const images = document.querySelectorAll('img[data-gm-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.gmSrc;
                            img.classList.add('gm-loaded');
                            observer.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback pentru browsere foarte vechi - încarcă toate imaginile
                images.forEach(img => {
                    img.src = img.dataset.gmSrc;
                });
            }
        }
    };

    /* ===================================
       SMOOTH SCROLL
       Scroll smooth pentru linkuri interne
       =================================== */
    const gmSmoothScroll = {
        init: function() {
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    if (href !== '#' && href.length > 1) {
                        const target = document.querySelector(href);
                        
                        if (target) {
                            e.preventDefault();
                            
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });

                            // Focus pe element pentru accesibilitate
                            target.setAttribute('tabindex', '-1');
                            target.focus();
                        }
                    }
                });
            });
        }
    };

    /* ===================================
       SCROLL TO TOP BUTTON
       Buton pentru scroll la începutul paginii
       =================================== */
    const gmScrollToTop = {
        init: function() {
            this.createButton();
            this.bindEvents();
        },

        createButton: function() {
            this.button = document.createElement('button');
            this.button.innerHTML = '↑';
            this.button.className = 'gm-scroll-to-top';
            this.button.setAttribute('aria-label', 'Înapoi sus');
            
            Object.assign(this.button.style, {
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7BD389, #73B8F0)',
                color: 'white',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                opacity: '0',
                visibility: 'hidden',
                transition: 'all 0.3s ease',
                zIndex: '1000',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            });

            document.body.appendChild(this.button);
        },

        bindEvents: function() {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    this.button.style.opacity = '1';
                    this.button.style.visibility = 'visible';
                } else {
                    this.button.style.opacity = '0';
                    this.button.style.visibility = 'hidden';
                }
            });

            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            this.button.addEventListener('mouseenter', () => {
                this.button.style.transform = 'translateY(-5px)';
                this.button.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
            });

            this.button.addEventListener('mouseleave', () => {
                this.button.style.transform = 'translateY(0)';
                this.button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            });
        }
    };

    /* ===================================
       INITIALIZATION
       Inițializează toate modulele când DOM-ul e gata
       =================================== */
    const gmInit = function() {
        // Verifică dacă DOM-ul e gata
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeModules);
        } else {
            initializeModules();
        }
    };

    function initializeModules() {
        gmBurgerMenu.init();
        gmActiveLink.init();
        gmLightbox.init();
        gmFormValidation.init();
        gmLazyLoad.init();
        gmSmoothScroll.init();
        gmScrollToTop.init();

        console.log('✅ Grădinița Model - Website loaded successfully!');
    }

    // Start initialization
    gmInit();

})();