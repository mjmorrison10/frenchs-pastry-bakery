// ============================================
// FRENCH'S PASTRY BAKERY — Script
// "A Little Piece of Paris in Orange"
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // SCROLL PROGRESS BAR
    // ========================================
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ========================================
    // NAVBAR SCROLL BEHAVIOR
    // ========================================
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });

    // ========================================
    // MOBILE MENU
    // ========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
        mobileToggle.classList.toggle('active', menuOpen);
        mobileMenu.classList.toggle('open', menuOpen);
        document.body.style.overflow = menuOpen ? 'hidden' : '';
    }

    function closeMenu() {
        menuOpen = false;
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', toggleMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) {
            closeMenu();
        }
    });

    // ========================================
    // OPEN / CLOSED STATUS INDICATOR
    // ========================================
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    function updateStatus() {
        const now = new Date();
        const day = now.getDay(); // 0=Sun, 1=Mon, ...
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time = hours + minutes / 60;

        // Hours: Tue-Sun 6AM-3PM, Mon Closed
        // day 1 = Monday (closed)
        const isOpen = day !== 1 && time >= 6 && time < 15;

        if (statusDot && statusText) {
            statusDot.className = isOpen ? 'status-dot' : 'status-dot closed';
            if (isOpen) {
                statusText.textContent = 'Open Now';
                statusText.style.color = '#16a34a';
            } else {
                statusText.textContent = 'Closed';
                statusText.style.color = '';
            }
        }
    }

    updateStatus();
    setInterval(updateStatus, 60000);

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once revealed
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================
    // COUNTER ANIMATION (Years)
    // ========================================
    const yearsCounter = document.getElementById('yearsCounter');
    let yearsAnimated = false;

    function animateCounter(element, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * eased);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    if (yearsCounter) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !yearsAnimated) {
                    yearsAnimated = true;
                    animateCounter(yearsCounter, 25, 1800);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(yearsCounter);
    }

    // ========================================
    // MOBILE CTA BAR
    // ========================================
    const mobileCtaBar = document.getElementById('mobileCtaBar');

    function updateMobileCta() {
        if (window.innerWidth < 1024 && mobileCtaBar) {
            mobileCtaBar.classList.toggle('visible', window.scrollY > 400);
        }
    }

    window.addEventListener('scroll', updateMobileCta, { passive: true });
    window.addEventListener('resize', () => {
        if (mobileCtaBar && window.innerWidth >= 1024) {
            mobileCtaBar.classList.remove('visible');
        }
    });

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }

    window.addEventListener('scroll', updateBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========================================
    // HERO SCROLL INDICATOR
    // ========================================
    const heroScroll = document.getElementById('heroScroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', () => {
            const ovenSection = document.getElementById('from-our-oven');
            if (ovenSection) {
                ovenSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // FORM VALIDATION
    // ========================================
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    if (form) {
        // Real-time validation: remove error on input
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                if (formError) formError.classList.remove('show');
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            form.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('error'));

            const name = form.querySelector('#name');
            const phone = form.querySelector('#phone');
            const email = form.querySelector('#email');

            let hasError = false;

            // Validate name
            if (!name.value.trim()) {
                name.classList.add('error');
                hasError = true;
            }

            // Validate phone
            if (!phone.value.trim() || phone.value.trim().length < 7) {
                phone.classList.add('error');
                hasError = true;
            }

            // Validate email if provided
            if (email && email.value.trim() && !isValidEmail(email.value.trim())) {
                email.classList.add('error');
                hasError = true;
            }

            if (hasError) {
                formError.classList.add('show');
                formSuccess.classList.remove('show');

                // Scroll to first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }

                setTimeout(() => {
                    if (formError) formError.classList.remove('show');
                }, 4000);
                return;
            }

            // Success
            formSuccess.classList.add('show');
            formError.classList.remove('show');
            form.reset();

            setTimeout(() => {
                if (formSuccess) formSuccess.classList.remove('show');
            }, 6000);
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ========================================
    // PERFORMANCE: Throttled scroll handler
    // ========================================
    // All scroll handlers use { passive: true } for performance
    // IntersectionObserver handles reveal animations (no scroll listener needed)

    // ========================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 20;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ========================================
    // PARALLAX-LIKE HERO EFFECT (subtle)
    // ========================================
    const heroContent = document.querySelector('.hero-content');
    const heroAwning = document.querySelector('.hero-awning');

    function updateHeroParallax() {
        if (window.innerWidth > 768 && heroContent && heroAwning) {
            const scrollY = window.scrollY;
            const heroHeight = document.getElementById('hero').offsetHeight;

            if (scrollY < heroHeight) {
                const progress = scrollY / heroHeight;
                heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                heroContent.style.opacity = 1 - progress * 0.8;
                heroAwning.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        }
    }

    window.addEventListener('scroll', updateHeroParallax, { passive: true });

    // Reset hero on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && heroContent && heroAwning) {
            heroContent.style.transform = '';
            heroContent.style.opacity = '';
            heroAwning.style.transform = '';
        }
    });

});
