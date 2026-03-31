(() => {
  if (window.__popupInit) return;
  window.__popupInit = true;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const isPopup = (element) => !!(element && element.hasAttribute && element.hasAttribute('data-popup'));

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  };

  ready(() => {
    let lockCount = 0;
    let htmlPrev = '';
    let bodyPrev = '';

    const lockScroll = (locked) => {
      if (locked) {
        if (lockCount === 0) {
          htmlPrev = document.documentElement.style.overflow;
          bodyPrev = document.body.style.overflow;
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
        }
        lockCount += 1;
        return;
      }

      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.documentElement.style.overflow = htmlPrev;
        document.body.style.overflow = bodyPrev;
      }
    };

    const open = (popup, trigger) => {
      if (!isPopup(popup) || popup.classList.contains('is-open')) return;
      popup.classList.add('is-open');
      popup.setAttribute('aria-hidden', 'false');
      popup.__lastTrigger = trigger || null;
      lockScroll(true);
      const firstInput = $('input,select,textarea,button', popup);
      if (firstInput?.focus) setTimeout(() => firstInput.focus(), 0);
    };

    const close = (popup) => {
      if (!isPopup(popup) || !popup.classList.contains('is-open')) return;
      popup.classList.remove('is-open');
      popup.setAttribute('aria-hidden', 'true');
      const trigger = popup.__lastTrigger;
      if (trigger?.focus) setTimeout(() => trigger.focus(), 0);
      lockScroll(false);
    };

    document.addEventListener('click', (event) => {
      const trigger = event.target?.closest?.('.popup-btn,[data-popup-open]');
      if (!trigger) return;

      event.preventDefault();
      const popupId =
        trigger.getAttribute('data-popup-id') ||
        trigger.getAttribute('data-popup-open') ||
        'lead-popup';
      const popup = document.getElementById(popupId);
      if (!isPopup(popup)) {
        console.error('[Popup] not found or no data-popup:', popupId);
        return;
      }

      open(popup, trigger);
    }, true);

    $$('[data-popup]').forEach((popup) => {
      const card = $('.popup__card', popup);

      popup.addEventListener('click', (event) => {
        const target = event.target;
        const clickBackdrop = target === popup || target?.hasAttribute?.('data-popup-close');
        const outsideCard = card && !card.contains(target);
        if (clickBackdrop || outsideCard) {
          event.preventDefault();
          close(popup);
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && popup.classList.contains('is-open')) {
          close(popup);
        }
      });
    });
  });
})();
