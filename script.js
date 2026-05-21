// =========================================
// LIGHTBOX GLOBALE
// =========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

window.openLightbox = function(src, cap) {
    if (lightboxImg && lightboxCaption) {
        lightboxImg.src = src;
        lightboxCaption.textContent = cap || 'Création BiG FlooW';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeLightbox = function() {
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
};

// =========================================
// FONCTIONS GLOBALES
// =========================================
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    const icons = { success: '😊', error: '❌', warning: '⚠️' };
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        </div>
        <div class="toast-progress"></div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    const timeout = setTimeout(() => closeToast(toast), 5000);
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        closeToast(toast);
    });
}

function closeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.parentNode && toast.remove(), 300);
}

window.subscribeNewsletter = function() {
    const email = document.getElementById('newsletter-email')?.value.trim();
    if (!email || !email.includes('@')) {
        showToast('❌ Veuillez entrer une adresse email valide.', 'error');
        return;
    }
    const btn = document.querySelector('.newsletter-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> En cours...';
    btn.disabled = true;
    fetch('https://formspree.io/f/mnjrjqaa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(response => {
        if (response.ok) {
            showToast('✅ Merci de votre abonnement 😊 Vous serez informé de nos prochaines actualités !', 'success');
            document.getElementById('newsletter-email').value = '';
        } else {
            showToast('❌ Une erreur est survenue. Réessayez plus tard.', 'error');
        }
    })
    .catch(() => showToast('❌ Erreur réseau. Vérifiez votre connexion.', 'error'))
    .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
};

window.sendFooterDevis = function(e) {
    e.preventDefault();
    const name = document.getElementById('devis-name')?.value.trim();
    const service = document.getElementById('devis-service')?.value;
    const budget = document.getElementById('devis-budget')?.value.trim();
    if (!name || !service) {
        showToast('Veuillez remplir nom et service', 'warning');
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

// =========================================
// GESTION DU MENU DÉROULANT SERVICES (mobile + desktop)
// =========================================
const dropdown = document.querySelector('.dropdown');
const toggle = document.getElementById('servicesToggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

function closeDropdown() {
    if (dropdown) dropdown.classList.remove('open');
}

function toggleDropdown(e) {
    if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('open');
    }
}

if (dropdown && toggle) {
    // Clic sur le bouton "Services"
    toggle.addEventListener('click', toggleDropdown);
    toggle.addEventListener('touchstart', toggleDropdown, { passive: false });

    // Fermeture si on clique en dehors (sur document)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
    document.addEventListener('touchstart', function(e) {
        if (window.innerWidth <= 768 && !dropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    // Évite que le clic sur un lien du menu ne ferme immédiatement (optionnel)
    dropdownMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // Laisse le temps à la navigation de se faire
                setTimeout(closeDropdown, 150);
            }
        });
    });
}

// Réinitialiser l'état du dropdown lors du redimensionnement
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && dropdown) {
        dropdown.classList.remove('open');
    }
});

// =========================================
// INITIALISATION AU CHARGEMENT
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    // Thème (clair/sombre)
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
    const saved = localStorage.getItem('bigfloow-theme');
    if (saved === 'dark') applyTheme(true);
    else if (saved === 'light') applyTheme(false);
    else applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (themeToggle) {
        themeToggle.addEventListener('click', () => applyTheme(!body.classList.contains('dark-theme')));
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('bigfloow-theme')) applyTheme(e.matches);
    });

    // Stats counter
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    let count = 0;
                    const update = () => {
                        if (count < target) {
                            count += target / 50;
                            entry.target.innerText = Math.ceil(count) + '+';
                            requestAnimationFrame(update);
                        } else entry.target.innerText = target + '+';
                    };
                    update();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        stats.forEach(s => observer.observe(s));
    }

    // Cookies
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

    // Lightbox
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }
    document.querySelectorAll('.story-logo-img, .mini-logo').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            if (lightbox && lightboxImg && lightboxCaption) {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
                lightboxCaption.innerText = img.alt || 'Création BiG FlooW';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Ripple effect sur certains boutons
    document.querySelectorAll('.btn-contact, .footer-devis-btn, .newsletter-btn, .footer-whatsapp-btn').forEach(btn => {
        btn.classList.add('ripple');
    });
});

// === CHATBOT (chargement au clic) ===
let chatbaseLoaded = false;
window.toggleChatbot = function() {
    if (!chatbaseLoaded) {
        const script = document.createElement('script');
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "lamcS_rk7GxldSZ8_1qHN";
        script.domain = "www.chatbase.co";
        script.onload = () => {
            if (window.chatbase) {
                window.chatbase('show');
                window.chatbase('open');
            }
        };
        document.body.appendChild(script);
        chatbaseLoaded = true;
        window.chatbaseConfig = { chatbotId: "lamcS_rk7GxldSZ8_1qHN", defaultOpen: false, hideButton: true };
    } else {
        if (window.chatbase) {
            window.chatbase('show');
            window.chatbase('open');
        }
    }
};
