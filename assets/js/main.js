const header = document.querySelector('.site-header');
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');

// Sticky header state
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
});

// Mobile nav toggle
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Smooth scroll
const scrollLinks = document.querySelectorAll('a[href^="#"]');
scrollLinks.forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Stat counters
const counters = document.querySelectorAll('[data-count]');
const animateCount = (el) => {
  const target = +el.getAttribute('data-count');
  let current = 0;
  const step = Math.max(1, Math.floor(target / 80));
  const tick = () => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = current;
    requestAnimationFrame(tick);
  };
  tick();
};

const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));

// Slider
const slider = document.querySelector('[data-slider]');
if (slider) {
  const track = slider.querySelector('.slider-track');
  const slides = Array.from(slider.querySelectorAll('.case-card'));
  const dotsContainer = slider.querySelector('.slider-dots');
  let index = 0;
  let interval;

  const buildDots = () => {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  };

  const goToSlide = (i) => {
    index = i;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsContainer.querySelectorAll('button').forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
    resetInterval();
  };

  const nextSlide = () => goToSlide((index + 1) % slides.length);

  const resetInterval = () => {
    clearInterval(interval);
    interval = setInterval(nextSlide, 6000);
  };

  if (slides.length > 0) {
    buildDots();
    resetInterval();
  }
}
