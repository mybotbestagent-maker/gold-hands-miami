// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ===== MOBILE MENU =====
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
let menuOpen = false;

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('active', menuOpen);
    const spans = mobileToggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('active');
    const spans = mobileToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
  observer.observe(el);
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('open');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// ===== FLOATING CTA VISIBILITY =====
const floatingCta = document.querySelector('.floating-cta');

if (floatingCta) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===== FORM HANDLING =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.name || !data.phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    // SMS consent checkbox validation
    const smsConsent = document.getElementById('smsConsent');
    if (smsConsent && !smsConsent.checked) {
      alert('Please agree to receive SMS messages to continue.');
      smsConsent.focus();
      return;
    }

    const btn = this.querySelector('.btn-primary');
    const originalText = btn.innerHTML;

    // Show sending state
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10" stroke-dasharray="30 70"/></svg> Sending...';
    btn.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      // Success
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Request Sent!';
      btn.style.background = '#28a745';
      this.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);

    } catch (err) {
      // Fallback: open mailto with form data
      const subject = encodeURIComponent('Quote Request from ' + data.name);
      const body = encodeURIComponent(
        'Name: ' + data.name + '\n' +
        'Phone: ' + data.phone + '\n' +
        'Email: ' + (data.email || 'N/A') + '\n' +
        'Service: ' + (data.service || 'N/A') + '\n' +
        'Message: ' + (data.message || 'N/A')
      );
      window.location.href = 'mailto:handymangoldhands@gmail.com?subject=' + subject + '&body=' + body;

      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.hero-stat-num');
  counters.forEach(counter => {
    const target = counter.getAttribute('data-target');
    if (!target) return;
    const targetNum = parseInt(target);
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = targetNum / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current >= targetNum) {
        counter.textContent = targetNum.toLocaleString() + suffix;
        return;
      }
      counter.textContent = Math.floor(current).toLocaleString() + suffix;
      requestAnimationFrame(update);
    };

    update();
  });
}

// Start counter animation when hero is in view
const heroSection = document.querySelector('.hero');
if (heroSection) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  heroObserver.observe(heroSection);
}
