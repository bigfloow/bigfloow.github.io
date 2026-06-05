// =========================================
// LIGHTBOX GLOBALE (corrigée)
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
// EFFET TILT 3D (comme Nordcraft)
// =========================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.expertise-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; // désactivé sur mobile
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 8;   // max ±8 degrés
            const rotateX = ((y - centerY) / centerY) * -8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
            // Met à jour la position de la brillance
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${percentX}%`);
            card.style.setProperty('--mouse-y', `${percentY}%`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.3s ease-out';
            setTimeout(() => { card.style.transition = ''; }, 300);
        });
    });
}

// =========================================
// ANIMATIONS AU SCROLL (fade-up)
// =========================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.expertise-card, .story-block, .founder-card, .stat-item, .story-logos-row > *');
    fadeElements.forEach(el => el.classList.add('fade-up'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => observer.observe(el));
}

// =========================================
// STATISTIQUES (améliorées)
// =========================================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                if (isNaN(target)) return;
                let count = 0;
                const step = target / 50;
                const update = () => {
                    count += step;
                    if (count < target) {
                        entry.target.innerText = Math.ceil(count) + '+';
                        requestAnimationFrame(update);
                    } else {
                        entry.target.innerText = target + '+';
                    }
                };
                update();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(s => observer.observe(s));
}

// =========================================
// GESTION DU THÈME (corrigée)
// =========================================
function initTheme() {
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
}

// =========================================
// GESTION DES COOKIES
// =========================================
function initCookies() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookie');
    if (cookieBanner && !localStorage.getItem('bigfloow_cookies')) cookieBanner.style.display = 'block';
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('bigfloow_cookies', 'true');
            if (cookieBanner) cookieBanner.style.display = 'none';
            showToast('🍪 Cookies acceptés !');
        });
    }
}

// =========================================
// CHATBOT (chargement au clic)
// =========================================
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

// =========================================
// INITIALISATION AU CHARGEMENT
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initStatsCounter();
    initCookies();
    initTiltEffect();      // ← NOUVEAU : effet 3D
    initScrollAnimations(); // ← NOUVEAU : fade-in au scroll

    // Lightbox global (déjà définie)
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
});
