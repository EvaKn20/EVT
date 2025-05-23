document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initMobileMenu();
    initScrollToTop();
    initThemeSwitcher();
    initCarousel();
    initDestinationFilter();
    initFaqAccordion();
    initFormNotifications();
});

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });
                document.querySelector('.mobile-nav').classList.remove('active');
            }
        });
    });
}

function initMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (burgerMenu && mobileNav) {
        burgerMenu.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            const spans = this.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
    }
}

function initScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            scrollToTopBtn.classList.toggle('active', window.pageYOffset > 300);
        });
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        }
        themeToggle.addEventListener('click', function() {
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}

function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() { showSlide(currentSlide + 1); }
        function prevSlide() { showSlide(currentSlide - 1); }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() { prevSlide(); resetInterval(); });
            nextBtn.addEventListener('click', function() { nextSlide(); resetInterval(); });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() { showSlide(index); resetInterval(); });
        });

        function startInterval() { slideInterval = setInterval(nextSlide, 5000); }
        function resetInterval() { clearInterval(slideInterval); startInterval(); }
        startInterval();
    }
}

function initDestinationFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const destinationItems = document.querySelectorAll('.destination-item');
    
    if (filterBtns.length && destinationItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');
                destinationItems.forEach(item => {
                    item.style.display = (filterValue === 'all' || item.getAttribute('data-category') === filterValue) 
                        ? 'block' : 'none';
                });
            });
        });
    }
}

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', function() {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        });
    }
}

function initFormNotifications() {
    const burgerMenu = document.querySelector('.burger-menu');
    if (burgerMenu) {
        const spans = burgerMenu.querySelectorAll('span');
        burgerMenu.addEventListener('click', function() {
            spans.forEach(span => span.classList.toggle('active'));
            if (spans[0].classList.contains('active')) {
                spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            const requiredFields = feedbackForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            const emailField = feedbackForm.querySelector('#email');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }

            if (isValid) {
                showNotification('Спасибо за сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
                feedbackForm.reset();
            } else {
                showNotification('Пожалуйста, заполните все обязательные поля корректно.', 'error');
            }
        });

        feedbackForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }

    const subscribeForms = document.querySelectorAll('.subscribe-form');
    subscribeForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]');
            if (email && email.value) {
                showNotification('Спасибо за подписку!', 'success');
                this.reset();
            }
        });
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
