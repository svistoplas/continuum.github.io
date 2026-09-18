document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
      menuToggle.textContent = open ? '✕' : '☰';
      if (header) header.classList.toggle('menu-open', open);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
        if (header) header.classList.remove('menu-open');
      });
    });
  }

  document.querySelectorAll('.option-header').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('open');
    });
  });

  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Thank you — we\'ll be in touch';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
        if (form.id === 'booking-form') updateBookingSubmit();
      }, 3000);
    });
  });

  const tierLabels = {
    waitlist: { text: 'Join Waitlist — Free', btnClass: 'btn-dark' },
    soft: { text: 'Soft Reserve — $500', btnClass: 'btn-primary' },
    hard: { text: 'Hard Reserve — 15%', btnClass: 'btn-primary' }
  };

  function updateBookingSubmit() {
    const form = document.getElementById('booking-form');
    const submit = document.getElementById('booking-submit');
    if (!form || !submit) return;
    const tier = form.querySelector('input[name="tier"]:checked')?.value || 'waitlist';
    const cfg = tierLabels[tier];
    submit.textContent = cfg.text;
    submit.className = `btn ${cfg.btnClass}`;
    submit.style.width = '100%';
  }

  document.querySelectorAll('#booking-form input[name="tier"]').forEach(radio => {
    radio.addEventListener('change', updateBookingSubmit);
  });

  document.querySelectorAll('.tier-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.dataset.tier;
      const radio = document.getElementById(`tier-${tier}`);
      if (radio) {
        radio.checked = true;
        updateBookingSubmit();
      }
    });
  });

  updateBookingSubmit();
});
