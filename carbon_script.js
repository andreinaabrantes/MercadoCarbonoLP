// Smooth scroll for hero CTA
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll functionality
    const heroCTA = document.getElementById('hero-cta');
    if (heroCTA) {
        heroCTA.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector('#form');
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Initialize countdown timer (7 days from first load)
    initCountdown();

    // Initialize FAQ accordion
    initFAQ();

    // Initialize form submission tracking
    initFormTracking();
});

// Countdown Timer (7 days scarcity)
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    // Get or set countdown end time (7 days from first visit)
    let countdownEndTime = localStorage.getItem('countdownEndTime');
    
    if (!countdownEndTime) {
        const now = new Date().getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        countdownEndTime = now + sevenDays;
        localStorage.setItem('countdownEndTime', countdownEndTime);
    } else {
        countdownEndTime = parseInt(countdownEndTime);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = countdownEndTime - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            countdownElement.innerHTML = 'Oferta expirada';
            clearInterval(countdownInterval);
        }
    }

    // Update countdown immediately and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// FAQ Accordion functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.parentElement.querySelector('.faq-answer').classList.remove('open');
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                faqAnswer.classList.remove('open');
            } else {
                this.setAttribute('aria-expanded', 'true');
                faqAnswer.classList.add('open');
            }
        });
    });
}

// Form submission tracking
function initFormTracking() {
    const leadForm = document.getElementById('lead-form');
    if (!leadForm) return;

    leadForm.addEventListener('submit', function(e) {
        // GTM/GA4 tracking
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: 'form_submit',
                form_name: 'lead_capture',
                form_location: 'carbon_guide_landing'
            });
        }

        // Basic form validation
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const lgpd = document.getElementById('lgpd').checked;

        if (!nome || !email || !lgpd) {
            e.preventDefault();
            alert('Por favor, preencha todos os campos obrigatórios.');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            alert('Por favor, insira um e-mail válido.');
            return false;
        }

        // If we reach here, form is valid and will submit normally
        // The dataLayer.push has already been called for tracking
    });

    // Real-time email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#dc3545';
                this.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.25)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    }
}

// Performance optimization: Lazy load images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Smooth reveal animations on scroll
function initScrollAnimations() {
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

    // Add animation to sections
    const sections = document.querySelectorAll('.benefits, .lead-magnet, .how-it-works, .social-proof, .faq');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
        initLazyLoading();
        initScrollAnimations();
    }, 100);
});

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Landing page error caught:', e.message);
    // Don't break the user experience, just log the error
});

// Analytics helper functions
window.trackEvent = function(eventName, parameters = {}) {
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            event: eventName,
            ...parameters
        });
    }
};

// Track scroll depth for conversion optimization
let maxScrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = Math.round((scrollTop / documentHeight) * 100);
    
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone scroll depths
        if (scrollDepth >= 25 && scrollDepth < 50 && maxScrollDepth < 50) {
            window.trackEvent('scroll_depth', { depth: '25%' });
        } else if (scrollDepth >= 50 && scrollDepth < 75 && maxScrollDepth < 75) {
            window.trackEvent('scroll_depth', { depth: '50%' });
        } else if (scrollDepth >= 75 && maxScrollDepth < 100) {
            window.trackEvent('scroll_depth', { depth: '75%' });
        }
    }
});

// CTA button click tracking
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button')) {
        const buttonText = e.target.textContent.trim();
        const buttonLocation = e.target.id || 'unknown';
        
        window.trackEvent('cta_click', {
            button_text: buttonText,
            button_location: buttonLocation
        });
    }
});