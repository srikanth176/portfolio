/**
 * Portfolio Website - Main JavaScript
 * Senior Backend Developer Portfolio
 */

(function () {
  'use strict';

  // DOM Elements
  const loader = document.getElementById('loader');
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const revealElements = document.querySelectorAll('.reveal');
  const statNumbers = document.querySelectorAll('.stat-card__number');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const yearEl = document.getElementById('year');
  const typingEl = document.getElementById('typing-text');

  // Typing effect phrases
  const typingPhrases = [
    'Node.js, Microservices, Scalable APIs',
    'AI Integrations & Cloud Applications',
    'Real-Time Systems & WebSockets',
    'Payment Gateways & Stripe',
    'Team Leadership & Architecture'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  // ============================================
  // Loader
  // ============================================
  function initLoader() {
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        initRevealAnimations();
      }, 2000);
    });

    // Fallback if load event already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        initRevealAnimations();
      }, 2000);
    }
  }

  // ============================================
  // Typing Effect
  // ============================================
  function typeText() {
    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      typeSpeed = 500;
    }

    typingTimeout = setTimeout(typeText, typeSpeed);
  }

  function initTypingEffect() {
    if (!typingEl) return;
    typeText();
  }

  // ============================================
  // Sticky Header & Active Nav
  // ============================================
  function initHeader() {
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      let current = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================
  // Mobile Navigation
  // ============================================
  function initMobileNav() {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      const isExpanded = navToggle.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================
  // Scroll Reveal Animations
  // ============================================
  function initRevealAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);

          // Trigger stat counter if stat card is visible
          if (entry.target.classList.contains('about__stats')) {
            animateStats();
          }
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
  }

  // ============================================
  // Animated Stats Counter
  // ============================================
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        stat.textContent = Math.floor(easeOut * target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ============================================
  // Smooth Scroll for anchor links
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================
  // Contact Form
  // ============================================
  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      formStatus.className = 'form-status';
      formStatus.textContent = '';

      if (!name || !email || !subject || !message) {
        formStatus.classList.add('error');
        formStatus.textContent = 'Please fill in all fields.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.classList.add('error');
        formStatus.textContent = 'Please enter a valid email address.';
        return;
      }

      // Simulate form submission (replace with actual backend/API)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        formStatus.classList.add('success');
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  // ============================================
  // Footer Year
  // ============================================
  function initFooter() {
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ============================================
  // Skill Cards Stagger Animation
  // ============================================
  function initSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
      card.style.transitionDelay = `${(index % 6) * 0.05}s`;
    });
  }

  // ============================================
  // Initialize
  // ============================================
  function init() {
    initLoader();
    initTypingEffect();
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initContactForm();
    initFooter();
    initSkillCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearTimeout(typingTimeout);
  });
})();
