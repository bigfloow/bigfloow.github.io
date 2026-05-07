// =========================================
// AMÉLIORATIONS BiG FlooW - JavaScript (version stable)
// =========================================

document.addEventListener('DOMContentLoaded', function() {

    // ---------- PRELOADER ----------
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => setTimeout(() => preloader.classList.add('hide'), 800));
    }

    // ---------- SCROLL PROGRESS ----------
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const percent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = percent + '%';
        });
    }

    // ---------- BACK TO TOP ----------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 500));
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ---------- MENU MOBILE ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    function toggleMenu() {
        if (navLinks && navOverlay) {
            navLinks.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        }
    }
    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (navOverlay) navOverlay.addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) toggleMenu();
        });
    });

    // ---------- ANIMATIONS REVEAL ----------
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => e.isIntersecting && e.target.classList.add('active'));
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    // ---------- GLASSMORPHISM NAVBAR ----------
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
    }

    // ---------- RIPPLE EFFECT ----------
    document.querySelectorAll('.btn-contact, .footer-devis-btn, .newsletter-btn, .footer-whatsapp-btn, .back-to-top')
        .forEach(btn => btn.classList.add('ripple'));

    // ---------- TOAST ----------
    function showToast(msg, success = true) {
        const toast = document.getElementById('toastNotification');
        if (toast) {
            toast.innerHTML = `<i class="fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${msg}`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
    window.showToast = showToast;

    // ---------- NEWSLETTER ----------
    window.subscribeNewsletter = function() {
        const email = document.getElementById('newsletter-email');
        if (email && email.value.trim() && email.value.includes('@')) {
            window.open(`https://wa.me/22890498680?text=${encodeURIComponent('Newsletter : ' + email.value.trim())}`, '_blank');
            email.value = '';
            showToast('Demande d\'inscription envoyée !');
        } else showToast('Email invalide', false);
    };

    // ---------- DEVIS ----------
    window.sendFooterDevis = function(e) {
        e.preventDefault();
        const name = document.getElementById('devis-name')?.value.trim();
        const service = document.getElementById('devis-service')?.value;
        const budget = document.getElementById('devis-budget')?.value.trim();
        if (!name || !service) {
            showToast('Veuillez remplir nom et service', false);
            return;
        }
        let msg = `Bonjour BiG FlooW 👋\n\nDevis :\nNom : ${name}\nService : ${service}`;
        if (budget) msg += `\nBudget : ${budget} FCFA`;
        msg += '\n\nMerci !';
        window.open(`https://wa.me/22890498680?text=${encodeURIComponent(msg)}`, '_blank');
        showToast('Demande de devis envoyée !');
        document.getElementById('devis-name').value = '';
        document.getElementById('devis-service').value = '';
        if (document.getElementById('devis-budget')) document.getElementById('devis-budget').value = '';
    };

    // ---------- MODE SOMBRE AMÉLIORÉ ----------
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    function updateIcon(isDark) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (isDark) icon?.classList.replace('fa-moon', 'fa-sun');
        else icon?.classList.replace('fa-sun', 'fa-moon');
    }
    function applyTheme(isDark) {
        body.classList.toggle('dark-theme', isDark);
        updateIcon(isDark);
        localStorage.setItem('bigfloow-theme', isDark ? 'dark' : 'light');
    }
    const savedTheme = localStorage.getItem('bigfloow-theme');
    if (savedTheme === 'dark') applyTheme(true);
    else if (savedTheme === 'light') applyTheme(false);
    else applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => applyTheme(!body.classList.contains('dark-theme')));
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('bigfloow-theme')) applyTheme(e.matches);
    });

    // ---------- STATS COUNTER ----------
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    let count = 0;
                    function updateCount() {
                        if (count < target) {
                            count += target / 50;
                            entry.target.innerText = Math.ceil(count) + '+';
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.innerText = target + '+';
                        }
                    }
                    updateCount();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        stats.forEach(s => statsObserver.observe(s));
    }

    // ---------- COOKIES ----------
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookie');
    if (cookieBanner && !localStorage.getItem('bigfloow_cookies')) cookieBanner.style.display = 'block';
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('bigfloow_cookies', 'true');
            if (cookieBanner) cookieBanner.style.display = 'none';
            showToast('Cookies acceptés !');
        });
    }

    // ---------- CURSEUR PERSONNALISÉ (DESKTOP) ----------
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    if (window.innerWidth > 768 && cursor && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
    }

    // ---------- PAS DE SKELETON LOADER ----------
    // Les images s'affichent normalement sans délai ni opacité forcée.
});
