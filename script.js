// =========================================
// AMÉLIORATIONS BiG FlooW - JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', function() {

    // ---------- PRELOADER ----------
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hide');
            }, 800);
        });
    }

    // ---------- SCROLL PROGRESS BAR ----------
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // ---------- BACK TO TOP ----------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- MOBILE MENU ----------
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

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMenu);
    }
    
    // Fermer le menu quand on clique sur un lien
    const menuLinks = document.querySelectorAll('.nav-links a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (navLinks && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ---------- REVEAL ANIMATIONS ----------
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    }

    // ---------- NAVBAR SCROLL EFFECT (GLASSMORPHISM) ----------
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ---------- RIPPLE EFFECT ----------
    const rippleButtons = document.querySelectorAll('.btn-contact, .footer-devis-btn, .newsletter-btn, .footer-whatsapp-btn, .back-to-top');
    rippleButtons.forEach(function(btn) {
        btn.classList.add('ripple');
    });

    // ---------- TOAST NOTIFICATION ----------
    function showToast(message, isSuccess = true) {
        const toast = document.getElementById('toastNotification');
        if (toast) {
            toast.innerHTML = '<i class="fas ' + (isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i> ' + message;
            toast.classList.add('show');
            setTimeout(function() {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Exposer au global
    window.showToast = showToast;

    // ---------- NEWSLETTER AMÉLIORÉE ----------
    window.subscribeNewsletter = function() {
        const email = document.getElementById('newsletter-email');
        if (email) {
            const emailValue = email.value.trim();
            if (!emailValue || !emailValue.includes('@')) {
                showToast('Veuillez entrer une adresse email valide.', false);
                return;
            }
            const msg = 'Bonjour BiG FlooW,\nJe souhaite m\'inscrire à la newsletter avec l\'email : ' + emailValue;
            window.open('https://wa.me/22890498680?text=' + encodeURIComponent(msg), '_blank');
            email.value = '';
            showToast('Demande d\'inscription envoyée !');
        }
    };

    // ---------- DEVIS FORM AMÉLIORÉ ----------
    window.sendFooterDevis = function(e) {
        if (e) e.preventDefault();
        const name = document.getElementById('devis-name');
        const service = document.getElementById('devis-service');
        const budget = document.getElementById('devis-budget');
        
        if (name && service) {
            const nameValue = name.value.trim();
            const serviceValue = service.value;
            const budgetValue = budget ? budget.value.trim() : '';
            
            if (!nameValue || !serviceValue) {
                showToast('Veuillez remplir votre nom et le type de service.', false);
                return;
            }
            
            let msg = 'Bonjour BiG FlooW 👋\n\nJe souhaite un devis pour :\n- Nom : ' + nameValue + '\n- Service : ' + serviceValue;
            if (budgetValue) msg += '\n- Budget estimé : ' + budgetValue + ' FCFA';
            msg += '\n\nMerci !';
            
            window.open('https://wa.me/22890498680?text=' + encodeURIComponent(msg), '_blank');
            showToast('Demande de devis envoyée !');
            
            name.value = '';
            if (service) service.value = '';
            if (budget) budget.value = '';
        }
    };

    // =========================================
    // THEME TOGGLE CORRIGÉ - MODE SOMBRE
    // =========================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function updateIcon(isDark) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('bigfloow-theme');

    // Appliquer le thème
    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
        updateIcon(isDark);
        localStorage.setItem('bigfloow-theme', isDark ? 'dark' : 'light');
    }

    // Charger le thème au démarrage
    if (savedTheme === 'dark') {
        applyTheme(true);
    } else if (savedTheme === 'light') {
        applyTheme(false);
    } else {
        // Détecter les préférences système
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark);
    }

    // Écouter le clic sur le bouton
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = !body.classList.contains('dark-theme');
            applyTheme(isDark);
        });
    }

    // Écouter les changements de thème système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('bigfloow-theme')) {
            applyTheme(e.matches);
        }
    });

    // ---------- STATS COUNTER ----------
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    let count = 0;
                    function updateCount() {
                        const speed = target / 50;
                        if (count < target) {
                            count += speed;
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
        stats.forEach(function(s) {
            statsObserver.observe(s);
        });
    }

    // ---------- COOKIE BANNER ----------
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookie = document.getElementById('accept-cookie');
    if (cookieBanner && !localStorage.getItem('bigfloow_cookies')) {
        cookieBanner.style.display = 'block';
    }
    if (acceptCookie) {
        acceptCookie.addEventListener('click', function() {
            localStorage.setItem('bigfloow_cookies', 'true');
            if (cookieBanner) cookieBanner.style.display = 'none';
            showToast('Cookies acceptés !', true);
        });
    }

    // ---------- CUSTOM CURSOR (Desktop seulement) ----------
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    if (window.innerWidth > 768 && cursor && cursorDot) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
    }
