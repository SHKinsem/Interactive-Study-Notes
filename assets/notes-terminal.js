/* Interactive Study Notes · Shared Behaviors */

(function () {
  'use strict';

  /* ---------- Flip-cards ---------- */
  function initFlipcards() {
    document.querySelectorAll('.flipcard').forEach(card => {
      const toggle = () => card.classList.toggle('flipped');
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
    });
  }

  /* ---------- MCQ with instant feedback ---------- */
  function initMCQs() {
    document.querySelectorAll('.mcq').forEach(mcq => {
      const correct = mcq.dataset.correct;
      const buttons = mcq.querySelectorAll('.mcq-options button');
      const explanation = mcq.querySelector('.mcq-explanation');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const picked = btn.dataset.option;
          buttons.forEach(b => {
            b.disabled = true;
            if (b.dataset.option === correct) b.classList.add('correct');
            else if (b.dataset.option === picked) b.classList.add('incorrect');
          });
          if (explanation) explanation.hidden = false;
        });
      });
    });
  }

  /* ---------- Stepped diagrams ---------- */
  function initSteppedDiagrams() {
    document.querySelectorAll('.stepped-diagram').forEach(diagram => {
      const narration = diagram.querySelector('.step-narration');
      const buttons = diagram.querySelectorAll('.step-controls button[data-step-btn]');
      const showStep = targetStep => {
        diagram.querySelectorAll('.step').forEach(step => {
          step.classList.toggle('visible', parseInt(step.dataset.step) <= targetStep);
        });
        buttons.forEach(b => b.classList.toggle('active', parseInt(b.dataset.stepBtn) === targetStep));
        if (narration) {
          const customText = diagram.querySelector(`[data-narration="${targetStep}"]`);
          if (customText) narration.textContent = customText.textContent;
        }
      };
      buttons.forEach(btn => {
        btn.addEventListener('click', () => showStep(parseInt(btn.dataset.stepBtn)));
      });
      // Auto-show step 1 on load
      if (buttons.length) showStep(1);
    });
  }

  /* ---------- Sidebar nav highlighting + progress bar ---------- */
  function initNavigation() {
    const navLinks = Array.from(document.querySelectorAll('.sidebar nav a'));
    const sections = navLinks.map(a => {
      const id = a.getAttribute('href');
      if (id && id.startsWith('#')) return document.querySelector(id);
      return null;
    }).filter(Boolean);

    if (sections.length) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const link = document.querySelector(`.sidebar nav a[href="#${entry.target.id}"]`);
            if (link) link.classList.add('active');
          }
        });
      }, { rootMargin: '-25% 0px -65% 0px' });
      sections.forEach(s => observer.observe(s));
    }

    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      const updateProgress = () => {
        const scrolled = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressFill.style.width = max > 0 ? Math.min(100, (scrolled / max) * 100) + '%' : '0%';
      };
      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();
    }
  }

  /* ---------- Init ---------- */
  function init() {
    initFlipcards();
    initMCQs();
    initSteppedDiagrams();
    initNavigation();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
