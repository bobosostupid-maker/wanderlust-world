document.addEventListener('DOMContentLoaded', function () {
    // ---------- Hamburger menu ----------
    const navContainer = document.querySelector('.nav-container');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mainNav = document.querySelector('.main-nav');

    if (navContainer && hamburgerBtn && mainNav) {
        function toggleMenu() {
            const isOpen = navContainer.classList.toggle('nav-open');
            hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        function closeMenu() {
            navContainer.classList.remove('nav-open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }

        hamburgerBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });

        hamburgerBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', function (e) {
            if (!navContainer.contains(e.target)) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
    }

    // ---------- Hero typing effect (homepage only) ----------
    const typingTitle = document.querySelector('.typing-title');
    if (typingTitle) {
        const fullText = typingTitle.getAttribute('data-text') || '';
        let index = 0;
        const speed = 65;

        function typeNext() {
            if (index <= fullText.length) {
                typingTitle.textContent = fullText.slice(0, index);
                index += 1;
                setTimeout(typeNext, speed);
            } else {
                typingTitle.classList.add('typing-done');
            }
        }

        setTimeout(typeNext, 350);
    }

    // ---------- Staggered card entrance ----------
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0 && 'IntersectionObserver' in window) {
        const cardObserver = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        const order = Number(card.dataset.order || 0);
                        setTimeout(function () {
                            card.classList.add('is-visible');
                        }, order * 140);
                        obs.unobserve(card);
                    }
                });
            },
            { threshold: 0.15 }
        );

        cards.forEach(function (card, i) {
            card.dataset.order = String(i);
            cardObserver.observe(card);
        });
    } else {
        cards.forEach(function (card) {
            card.classList.add('is-visible');
        });
    }

    // ---------- Scroll reveal for content blocks ----------
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealEls.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    // ---------- Back to top button ----------
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- Carousels on destination pages ----------
    document.querySelectorAll('.carousel').forEach(function (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const dotsWrap = carousel.querySelector('.carousel-dots');
        if (!track || slides.length === 0) return;

        let index = 0;

        function goTo(i) {
            index = (i + slides.length) % slides.length;
            track.style.transform = 'translateX(-' + index * 100 + '%)';
            if (dotsWrap) {
                dotsWrap.querySelectorAll('button').forEach(function (dot, di) {
                    dot.classList.toggle('active', di === index);
                });
            }
        }

        if (dotsWrap) {
            slides.forEach(function (_, i) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                if (i === 0) btn.classList.add('active');
                btn.addEventListener('click', function () { goTo(i); });
                dotsWrap.appendChild(btn);
            });
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

        // Auto-advance every 5s
        setInterval(function () { goTo(index + 1); }, 5000);
    });

});
