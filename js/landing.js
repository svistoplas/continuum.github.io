(function () {
  const progress = document.querySelector('.scroll-progress');
  const morphPanel = document.querySelector('.morph-panel');
  const morphSlides = document.querySelectorAll('.morph-slide');
  const morphCounter = document.querySelector('.morph-counter span');
  const morphBgWord = document.querySelector('.morph-bg-word');

  function onScroll() {
    const scrollY = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (scrollY / docH) * 100 + '%';

    document.querySelectorAll('.float-img').forEach(el => {
      const rect = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.speed || 0.2);
      const offset = (rect.top - window.innerHeight / 2) * speed;
      const rot = offset * 0.04;
      const base = el.dataset.baseTransform || '';
      el.style.transform = `${base} translateY(${offset}px) rotate(${rot}deg)`;
    });

    if (morphPanel && morphSlides.length) {
      const rect = morphPanel.getBoundingClientRect();
      const total = morphPanel.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress01 = Math.min(1, scrolled / total);
      const step = Math.min(morphSlides.length - 1, Math.floor(progress01 * morphSlides.length));
      morphSlides.forEach((s, i) => s.classList.toggle('active', i === step));
      if (morphCounter) morphCounter.textContent = String(step + 1).padStart(2, '0');
      if (morphBgWord) morphBgWord.style.transform = `translateX(${-progress01 * 200}px)`;
    }

    const routePin = document.querySelector('.route-pin');
    const eggLayer = document.querySelector('.route-img-layer.route-egg');
    if (routePin) {
      const rect = routePin.getBoundingClientRect();
      const total = routePin.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress01 = Math.min(1, scrolled / total);
      const steps = document.querySelectorAll('.route-step');
      const layers = document.querySelectorAll('.route-img-layer:not(.route-egg)');
      const step = Math.min(steps.length - 1, Math.floor(progress01 * steps.length));
      steps.forEach((s, i) => s.classList.toggle('active', i === step));
      layers.forEach((l, i) => l.classList.toggle('active', i === step));

      if (eggLayer) {
        const peekStart = 0.86;
        const peekP = Math.max(0, Math.min(1, (progress01 - peekStart) / (1 - peekStart)));
        eggLayer.style.opacity = String(peekP * 0.9);
        eggLayer.style.transform = `translateX(${94 - peekP * 7}%)`;
      }
    }

    const heroBg = document.querySelector('.ld-hero-bg');
    if (heroBg) {
      heroBg.style.transform = `scale(${1.1 + scrollY * 0.0002}) translateY(${scrollY * 0.35}px)`;
    }

    document.querySelectorAll('.split-visual-inner').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (window.innerWidth <= 900) {
        el.style.transform = 'none';
        return;
      }
      const p = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      el.style.transform = `rotateY(${-8 + p * 8}deg) rotateX(${4 - p * 4}deg) scale(${0.9 + p * 0.1})`;
    });

    document.querySelectorAll('.interlude img').forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      const p = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.transform = `scale(1.2) translateY(${p * -80}px)`;
    });
  }

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .stat-item, .option-card-ld, .tier-block').forEach(el => revealObs.observe(el));

  const crewSection = document.querySelector('.crew-scroll-section');
  const crewTrack = document.querySelector('.crew-track');
  if (crewSection && crewTrack) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 900) {
        crewTrack.style.transform = '';
        return;
      }
      const rect = crewSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const crewX = p * (crewTrack.scrollWidth - window.innerWidth) * 0.4;
        crewTrack.style.transform = `translateX(${-crewX}px)`;
      }
    }, { passive: true });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const form = document.querySelector('.ld-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.ld-submit');
      btn.textContent = 'Received. We\'ll be in touch.';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send request';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  }
})();
