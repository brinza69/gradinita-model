/* ===================================
   Grădinița Model - script.js
   JavaScript complet pentru toate paginile
   =================================== */

// Mobile Menu Toggle - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    
    if (menuToggle && mobileMenu) {
        // Toggle menu on button click
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (!isExpanded) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for sticky navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Gallery Lightbox
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imageSrc = this.getAttribute('data-image');
                const imageAlt = this.getAttribute('aria-label') || 'Imagine galerie';
                
                if (imageSrc) {
                    lightboxImage.src = imageSrc;
                    lightboxImage.alt = imageAlt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
            
            // Keyboard accessibility for gallery items
            item.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            lightboxImage.src = '';
        }
    }
});

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const enrollmentForm = document.getElementById('enrollment-form');
    const contactForm = document.getElementById('contact-form');
    
    if (enrollmentForm) {
        handleFormSubmission(enrollmentForm);
    }
    
    if (contactForm) {
        handleFormSubmission(contactForm);
    }
});

function handleFormSubmission(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous feedback
        const feedback = document.getElementById('form-feedback');
        if (feedback) {
            feedback.className = 'form-feedback';
            feedback.textContent = '';
        }
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Se trimite...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success
            showFeedback('success', 'Mulțumim! Formularul a fost trimis cu succes. Te vom contacta în curând.');
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Log form data (for development)
            console.log('Form data:', data);
            
            // In production, you would send to backend:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(result => {
            //     showFeedback('success', 'Mulțumim! Formularul a fost trimis cu succes.');
            //     form.reset();
            // })
            // .catch(error => {
            //     showFeedback('error', 'A apărut o eroare. Te rugăm să încerci din nou.');
            // })
            // .finally(() => {
            //     submitButton.disabled = false;
            //     submitButton.textContent = originalText;
            // });
            
        }, 1500);
    });
}

function validateForm(form) {
    let isValid = true;
    const feedback = document.getElementById('form-feedback');
    
    // Get all required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        // Remove previous error styling
        field.style.borderColor = '';
        
        // Check if field is empty
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#DC2626';
            if (isValid) field.focus();
        }
        
        // Validate email
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                field.style.borderColor = '#DC2626';
                showFeedback('error', 'Te rugăm să introduci o adresă de email validă.');
            }
        }
        
        // Validate phone
        if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(field.value.trim())) {
                isValid = false;
                field.style.borderColor = '#DC2626';
                showFeedback('error', 'Te rugăm să introduci un număr de telefon valid.');
            }
        }
        
        // Validate checkbox
        if (field.type === 'checkbox' && !field.checked) {
            isValid = false;
            showFeedback('error', 'Te rugăm să accepți termenii și condițiile.');
        }
    });
    
    if (!isValid && !feedback.textContent) {
        showFeedback('error', 'Te rugăm să completezi toate câmpurile obligatorii.');
    }
    
    return isValid;
}

function showFeedback(type, message) {
    const feedback = document.getElementById('form-feedback');
    if (feedback) {
        feedback.className = `form-feedback ${type}`;
        feedback.textContent = message;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(43, 47, 56, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 12px rgba(43, 47, 56, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
}

// Active Navigation Link Highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Animation on Scroll
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements with fade-in animation
        const animatedElements = document.querySelectorAll('.feature-card, .program-card, .activity-card, .value-card, .team-member, .testimonial-card');
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
});

// Back to Top Button
function addBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Înapoi sus');
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #7BD389, #73B8F0);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(43, 47, 56, 0.2);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', addBackToTopButton);

// Form Input Focus Effects
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});

// Console Welcome Message
console.log('%c🏫 Grădinița Model Târgoviște', 'font-size: 20px; font-weight: bold; color: #7BD389;');
console.log('%cWebsite dezvoltat cu ❤️ pentru copiii noștri', 'font-size: 14px; color: #73B8F0;');
console.log('%cDacă ai găsit vreun bug, te rugăm să ne contactezi la: contact@gradinita-model.ro', 'font-size: 12px; color: #6B7280;');

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for sticky navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Gallery Lightbox
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imageSrc = this.getAttribute('data-image');
                const imageAlt = this.getAttribute('aria-label') || 'Imagine galerie';
                
                if (imageSrc) {
                    lightboxImage.src = imageSrc;
                    lightboxImage.alt = imageAlt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
            
            // Keyboard accessibility for gallery items
            item.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            lightboxImage.src = '';
        }
    }
});

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const enrollmentForm = document.getElementById('enrollment-form');
    const contactForm = document.getElementById('contact-form');
    
    if (enrollmentForm) {
        handleFormSubmission(enrollmentForm);
    }
    
    if (contactForm) {
        handleFormSubmission(contactForm);
    }
});

function handleFormSubmission(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous feedback
        const feedback = document.getElementById('form-feedback');
        if (feedback) {
            feedback.className = 'form-feedback';
            feedback.textContent = '';
        }
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Se trimite...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success
            showFeedback('success', 'Mulțumim! Formularul a fost trimis cu succes. Te vom contacta în curând.');
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Log form data (for development)
            console.log('Form data:', data);
            
            // In production, you would send to backend:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(result => {
            //     showFeedback('success', 'Mulțumim! Formularul a fost trimis cu succes.');
            //     form.reset();
            // })
            // .catch(error => {
            //     showFeedback('error', 'A apărut o eroare. Te rugăm să încerci din nou.');
            // })
            // .finally(() => {
            //     submitButton.disabled = false;
            //     submitButton.textContent = originalText;
            // });
            
        }, 1500);
    });
}

function validateForm(form) {
    let isValid = true;
    const feedback = document.getElementById('form-feedback');
    
    // Get all required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        // Remove previous error styling
        field.style.borderColor = '';
        
        // Check if field is empty
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#DC2626';
            field.focus();
        }
        
        // Validate email
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                field.style.borderColor = '#DC2626';
                showFeedback('error', 'Te rugăm să introduci o adresă de email validă.');
            }
        }
        
        // Validate phone
        if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(field.value.trim())) {
                isValid = false;
                field.style.borderColor = '#DC2626';
                showFeedback('error', 'Te rugăm să introduci un număr de telefon valid.');
            }
        }
        
        // Validate checkbox
        if (field.type === 'checkbox' && !field.checked) {
            isValid = false;
            showFeedback('error', 'Te rugăm să accepți termenii și condițiile.');
        }
    });
    
    if (!isValid && !feedback.textContent) {
        showFeedback('error', 'Te rugăm să completezi toate câmpurile obligatorii.');
    }
    
    return isValid;
}

function showFeedback(type, message) {
    const feedback = document.getElementById('form-feedback');
    if (feedback) {
        feedback.className = `form-feedback ${type}`;
        feedback.textContent = message;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(43, 47, 56, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 12px rgba(43, 47, 56, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
}

// Active Navigation Link Highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Animation on Scroll
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in animation
    const animatedElements = document.querySelectorAll('.feature-card, .program-card, .activity-card, .value-card, .team-member, .testimonial-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Back to Top Button (Optional - can be added to HTML)
function addBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Înapoi sus');
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--green), var(--blue));
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(43, 47, 56, 0.2);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', addBackToTopButton);

// Form Input Focus Effects
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});

// Console Welcome Message
console.log('%c🏫 Grădinița Model Târgoviște', 'font-size: 20px; font-weight: bold; color: #7BD389;');
console.log('%cWebsite dezvoltat cu ❤️ pentru copiii noștri', 'font-size: 14px; color: #73B8F0;');
console.log('%cDacă ai găsit vreun bug, te rugăm să ne contactezi la: contact@gradinita-model.ro', 'font-size: 12px; color: #6B7280;');