(function () {
  const panels = document.querySelectorAll('.quiz-panel');
  const dots = document.querySelectorAll('.quiz-step-dot');
  const expBox = document.getElementById('experience-box');
  const expText = document.getElementById('experience-text');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const form = document.getElementById('quiz-form');

  let step = 0;
  const total = panels.length;

  const drakeExperiences = {
    sail: 'Three days out of Ushuaia. Albatross off the bow, Southern Ocean swell, the usual Drake rhythm. When the South Shetlands show on the radar, you have done the crossing under sail.',
    punta: 'DAP Airlines puts you over the Drake in about two hours. Request starboard for the Andes side. If Punta Arenas weather delays the flight, we cover up to two hotel nights there. You land on King George and board the same day.',
    buenos: 'Night in Buenos Aires, morning flight down the Andes to Ushuaia, board the yacht at the pier. After the peninsula you fly King George to Punta Arenas. Less sea time, same landings.',
    total: 'Punta Arenas to King George Island and back, both legs by air with DAP. No Drake. The yacht sits in calm water at the ice edge. Good if you want an easy boarding day and an early first landing.'
  };

  const cruiseExperiences = {
    vinson: 'Helicopter day with Antarctica Logistics & Expeditions to the Vinson base area, 4,200 m. Weather dependent, booked around your sailing dates.',
    kayak: 'Guided paddles between floes when wind and swell allow. You kit up on deck, launch from the yacht, and stay within radio range of the Zodiac cover boat.',
    huts: 'Guided entry at Cape Royds or Cape Evans. Cold inside, smell of old canvas and oil. Boots, tins, and labels left by Shackleton\'s men still on the shelves.',
    emperors: 'Emperor colony landings need stable sea ice and the right month. When it works, you are on the ice with birds that have never seen a land predator.',
    whales: 'Humpbacks and orcas in the floe edge. The guide kills the engine. You sit in the Zodiac and wait. Often they come back around on their own line.'
  };

  const quizIntro = document.querySelector('.quiz-intro');
  const quizStage = document.getElementById('quiz-stage');

  function showStep(n) {
    step = n;
    panels.forEach((p, i) => p.classList.toggle('active', i === step));
    dots.forEach((d, i) => {
      d.classList.toggle('done', i < step);
      d.classList.toggle('active', i === step);
    });
    if (quizIntro) quizIntro.classList.toggle('quiz-intro--hidden', step > 0);
    btnBack.style.visibility = step === 0 ? 'hidden' : 'visible';
    btnNext.textContent = step === total - 1 ? 'Submit' : 'Continue';
    btnNext.disabled = false;
    if (step < total - 1) updateNextDisabled();
    if (step === total - 1) {
      buildSummary();
      const tier = document.querySelector('input[name="tier"]:checked');
      if (tier) {
        const msgs = {
          waitlist: 'No payment now. We add you to the alert list and call when dates firm up.',
          soft: '$500 holds a soft place. Refundable if your plans change. A manager is assigned to your file.',
          hard: '15% deposit locks price and cabin order. Best if you already have travel dates in mind.'
        };
        showExperience(msgs[tier.value], 'Reservation');
      }
    } else if (step === 0) {
      const drake = document.querySelector('input[name="drake"]:checked');
      if (drake) showExperience(drakeExperiences[drake.value], 'Your crossing');
      else expBox.classList.remove('visible');
    } else if (step === 1) {
      const checked = [...document.querySelectorAll('input[name="cruise"]:checked')];
      if (checked.length) {
        const last = checked[checked.length - 1];
        showExperience(cruiseExperiences[last.value], 'Added to your voyage');
      } else {
        showExperience('Standard peninsula landings, Zodiac runs, and meals on board are already included. Add extras above if you want them noted on your file.', 'Your voyage');
      }
    }
    if (quizStage) {
      requestAnimationFrame(() => {
        quizStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function updateNextDisabled() {
    if (step === 0) {
      btnNext.disabled = !document.querySelector('input[name="drake"]:checked');
    } else if (step === 1) {
      btnNext.disabled = false;
    } else {
      btnNext.disabled = false;
    }
  }

  function showExperience(text, tag) {
    if (!expBox || !expText) return;
    expText.innerHTML = tag ? `<span class="tag">${tag}</span>${text}` : text;
    expBox.classList.add('visible');
  }

  document.querySelectorAll('input[name="drake"]').forEach(radio => {
    radio.addEventListener('change', () => {
      showExperience(drakeExperiences[radio.value], 'Your crossing');
      updateNextDisabled();
    });
  });

  document.querySelectorAll('input[name="cruise"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...document.querySelectorAll('input[name="cruise"]:checked')];
      if (checked.length === 0) {
        showExperience('Standard peninsula landings, Zodiac runs, and meals on board are already included. Add extras above if you want them noted on your file.', 'Your voyage');
        return;
      }
      const last = checked[checked.length - 1];
      showExperience(cruiseExperiences[last.value], 'Added to your voyage');
    });
  });

  document.querySelectorAll('input[name="tier"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const msgs = {
        waitlist: 'No payment now. We add you to the alert list and call when dates firm up.',
        soft: '$500 holds a soft place. Refundable if your plans change. A manager is assigned to your file.',
        hard: '15% deposit locks price and cabin order. Best if you already have travel dates in mind.'
      };
      showExperience(msgs[radio.value], 'Reservation');
    });
  });

  function buildSummary() {
    const drake = document.querySelector('input[name="drake"]:checked');
    const tier = document.querySelector('input[name="tier"]:checked');
    const cruises = [...document.querySelectorAll('input[name="cruise"]:checked')].map(c => c.dataset.label);

    const drakeLabels = {
      sail: 'Sail the Drake Passage',
      punta: 'Punta Arenas → King George → Ushuaia → Buenos Aires',
      buenos: 'Buenos Aires → Ushuaia → King George → Punta Arenas',
      total: 'Total Fly & Cruise (Punta Arenas roundtrip)'
    };
    const tierLabels = {
      waitlist: 'Waitlist ($0)',
      soft: 'Soft Reserve ($500)',
      hard: 'Hard Reserve (15%)'
    };

    document.getElementById('sum-drake').textContent = drake ? drakeLabels[drake.value] : 'Not selected';
    document.getElementById('sum-cruise').textContent = cruises.length ? cruises.join(', ') : 'Standard expedition programme';
    document.getElementById('sum-tier').textContent = tier ? tierLabels[tier.value] : 'Not selected';
  }

  btnBack.addEventListener('click', () => {
    if (step > 0) showStep(step - 1);
  });

  btnNext.addEventListener('click', () => {
    if (step < total - 1) {
      showStep(step + 1);
      return;
    }
    if (form && form.reportValidity()) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (step !== total - 1) return;
      btnNext.textContent = 'Sent. We\'ll be in touch.';
      btnNext.disabled = true;
      setTimeout(() => {
        btnNext.textContent = 'Submit';
        btnNext.disabled = false;
        form.reset();
        showStep(0);
        expBox.classList.remove('visible');
      }, 4000);
    });
  }

  showStep(0);
})();
