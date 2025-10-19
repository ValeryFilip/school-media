// public/js/popup.js
(() => {
  if (window.__popupInit) return;
  window.__popupInit = true;

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const isPopup = el => !!(el && el.hasAttribute && el.hasAttribute('data-popup'));

  // ======= Attribution (UTM / session / GA cid)
  const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','wbraid','gbraid'];
  const LS_FT = 'attr:first_touch';
  const LS_LT = 'attr:last_touch';
  const LS_SID = 'attr:session_id';

  const nowISO = () => new Date().toISOString();
  const hasKeys = (o) => o && Object.keys(o).length > 0;
  const tryParse = (s, d = null) => { try { return s ? JSON.parse(s) : d; } catch { return d; } };
  const uuid = () =>
    (crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }));

  const parseUTMFromSearch = (search) => {
    const p = new URLSearchParams(search || '');
    const out = {};
    UTM_KEYS.forEach(k => { const v = p.get(k); if (v) out[k] = v; });
    return out;
  };

  const readCookie = (name) => {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([$?*|{}\]\\^])/g,'\\$1') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  };
  const readGaClientId = () => {
    const ga = readCookie('_ga');
    if (!ga) return '';
    const parts = ga.split('.');
    return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : ga;
  };
  const ensureSessionId = () => {
    let sid = localStorage.getItem(LS_SID);
    if (!sid) { sid = uuid(); localStorage.setItem(LS_SID, sid); }
    return sid;
  };

  const initAttribution = () => {
    const sid = ensureSessionId();
    const utm = parseUTMFromSearch(location.search);
    const ref = document.referrer || '';

    // обновляем last_touch на каждой странице
    const last_touch = { ts: nowISO(), page: location.href, referrer: ref, utm: hasKeys(utm) ? utm : undefined };
    localStorage.setItem(LS_LT, JSON.stringify(last_touch));

    // фиксируем first_touch при первом заходе с UTM
    if (!localStorage.getItem(LS_FT) && hasKeys(utm)) {
      const first_touch = { ts: nowISO(), landing_page: location.href, referrer: ref, utm };
      localStorage.setItem(LS_FT, JSON.stringify(first_touch));
    }
    return { sid, last_touch, first_touch: tryParse(localStorage.getItem(LS_FT)) };
  };

  const readAttribution = () => ({
    session_id: localStorage.getItem(LS_SID) || '',
    first_touch: tryParse(localStorage.getItem(LS_FT)) || null,
    last_touch:  tryParse(localStorage.getItem(LS_LT)) || { ts: nowISO(), page: location.href, referrer: document.referrer || '' },
    ga_client_id: readGaClientId()
  });

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  };

  ready(() => {
    initAttribution();

    // ===== Scroll lock
    let lockCnt = 0, htmlPrev = '', bodyPrev = '';
    const lock = (on) => {
      if (on) {
        if (lockCnt === 0) {
          htmlPrev = document.documentElement.style.overflow;
          bodyPrev = document.body.style.overflow;
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
        }
        lockCnt++;
      } else {
        lockCnt = Math.max(0, lockCnt - 1);
        if (lockCnt === 0) {
          document.documentElement.style.overflow = htmlPrev;
          document.body.style.overflow = bodyPrev;
        }
      }
    };

    const open = (box, trig) => {
      if (!isPopup(box) || box.classList.contains('is-open')) return;
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      box.__lastTrigger = trig || null;
      // idempotency — один токен на одно открытие
      box.__submissionId = crypto?.randomUUID?.() ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(16).slice(2));
      lock(true);
      const fi = $('input,select,textarea,button', box);
      if (fi && fi.focus) setTimeout(() => fi.focus(), 0);
    };

    const close = (box) => {
      if (!isPopup(box) || !box.classList.contains('is-open')) return;
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      const t = box.__lastTrigger;
      if (t && t.focus) setTimeout(() => t.focus(), 0);
      lock(false);
    };

    // Делегатор открытия
    document.addEventListener('click', (ev) => {
      const btn = ev.target?.closest?.('.popup-btn,[data-popup-open]');
      if (!btn) return;
      ev.preventDefault();
      const id  = btn.getAttribute('data-popup-id') || btn.getAttribute('data-popup-open') || 'lead-popup';
      const box = document.getElementById(id);
      if (!isPopup(box)) { console.error('[Popup] not found or no data-popup:', id); return; }

      // UTM override с кнопки (для различения кнопок на странице)
      const override = {};
      ['source','medium','campaign','content','term'].forEach(k => {
        const v = btn.dataset['utm' + k[0].toUpperCase() + k.slice(1)];
        if (v) override['utm_' + k] = v;
      });
      if (Object.keys(override).length) {
        const lt = readAttribution().last_touch || {};
        lt.utm = Object.assign({}, lt.utm || {}, override);
        localStorage.setItem(LS_LT, JSON.stringify(lt));
      }

      open(box, btn);
    }, true);

    // Инициализация каждого попапа
    $$('[data-popup]').forEach((box) => {
      const card   = $('.popup__card', box);
      const form   = $('.popup__form', box);
      const status = $('.status', box);
      const debug  = $('.debug', box);
      const submit = $('.submit', box);
      const endpoint = form?.getAttribute('data-endpoint') || '';

      const setStatus = (kind, msg, dbg) => {
        if (status) {
          status.hidden = false;
          status.className = 'status ' + (kind || '');
          status.textContent = msg || '';
        }
        if (debug) {
          if (dbg) { debug.hidden = false; debug.textContent = dbg; }
          else { debug.hidden = true; debug.textContent = ''; }
        }
      };

      const lockBtn = (on) => {
        if (!submit) return;
        submit.dataset.label ??= submit.textContent || '';
        submit.disabled = !!on;
        submit.textContent = on ? 'Отправляем…' : submit.dataset.label;
      };

      // Закрытие по фону / крестику / клику вне карточки
      box.addEventListener('click', (ev) => {
        const t = ev.target;
        const clickBackdrop = (t === box) || t?.hasAttribute?.('data-popup-close');
        const outsideCard = card && !card.contains(t);
        if (clickBackdrop || outsideCard) { ev.preventDefault(); close(box); }
      });

      // ESC
      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && box.classList.contains('is-open')) close(box);
      });

      if (!form) return;
      if (!endpoint) { setStatus('err', 'Не задан endpoint формы (data-endpoint)'); return; }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (form.__sending) return; // антидубль
        form.__sending = true;

        if (form.reportValidity && !form.reportValidity()) {
          setStatus('err', 'Проверьте обязательные поля');
          form.__sending = false;
          return;
        }

        lockBtn(true);
        setStatus('', 'Отправляем…');

        const fields = Object.fromEntries(new FormData(form).entries());
        const attr = readAttribution();
        const trig = box.__lastTrigger;

        // Читаем UTM метки из data-атрибутов формы
        const formUtm = {
          utm_source: form.dataset.utmSource || '',
          utm_medium: form.dataset.utmMedium || '',
          utm_campaign: form.dataset.utmCampaign || '',
          utm_content: form.dataset.utmContent || '',
          utm_term: form.dataset.utmTerm || '',
        };

        // Читаем UTM метки с кнопки-триггера
        const triggerUtm = {
          utm_source: trig?.dataset?.utmSource || '',
          utm_medium: trig?.dataset?.utmMedium || '',
          utm_campaign: trig?.dataset?.utmCampaign || '',
          utm_content: trig?.dataset?.utmContent || '',
          utm_term: trig?.dataset?.utmTerm || '',
        };

        // Объединяем UTM: приоритет у кнопки, потом форма, потом атрибуция
        const lastTouch = attr.last_touch || {};
        const combinedUtm = {
          ...lastTouch.utm,
          ...formUtm,
          ...triggerUtm
        };

        const meta = {
          ts: nowISO(),
          page: location.href,
          page_title: document.title,
          referrer: document.referrer || '',
          popup_id: box.id || '',
          session_id: attr.session_id || '',
          ga_client_id: attr.ga_client_id || '',
          first_touch: attr.first_touch || null,
          last_touch:  { ...lastTouch, utm: Object.keys(combinedUtm).length ? combinedUtm : undefined },
          submission_id: box.__submissionId || '',
          trigger_id: trig?.id || '',
          trigger_text: (trig?.textContent || '').trim(),
          trigger: trig ? { id: trig.id || '', text: (trig.textContent || '').trim(), dataset: { ...trig.dataset } } : {}
        };

        const body = new URLSearchParams();
        Object.entries(fields).forEach(([k, v]) => body.append(k, String(v)));
        // плоские поля (для удобной фильтрации на стороне GAS)
        body.append('page', meta.page);
        body.append('page_title', meta.page_title);
        body.append('referrer', meta.referrer);
        body.append('popup_id', meta.popup_id);
        body.append('session_id', meta.session_id);
        body.append('ga_client_id', meta.ga_client_id);
        body.append('trigger_id', meta.trigger_id);
        body.append('trigger_text', meta.trigger_text);
        body.append('submission_id', meta.submission_id);
        // JSON-полезная нагрузка
        body.append('payload', JSON.stringify({ ...fields, __meta: meta }));

        // Получаем токен reCAPTCHA
        if (typeof grecaptcha !== 'undefined' && !window.location.hostname.includes('localhost')) {
          grecaptcha.ready(() => {
            grecaptcha.execute('6LdH2McrAAAAAAjXZeXVKTAtKoGwJCjS4d9wVe4Z', { action: 'submit' }).then((token) => {
              sendFormData(token);
            });
          });
        } else {
          // Fallback для localhost или если reCAPTCHA не загрузилась
          console.log('reCAPTCHA пропущена для localhost');
          sendFormData('');
        }

        function sendFormData(recaptchaToken) {
          body.append('recaptcha_token', recaptchaToken); // Добавляем токен reCAPTCHA
          
          fetch(endpoint, { 
            method: 'POST', 
            body: body,
            mode: 'no-cors' // Обходим CORS
          }).then(() => {
            setStatus('ok', 'Заявка отправлена!', 'Данные отправлены');
            form.reset();
            
            // Редирект на страницу благодарности с UTM параметрами
            setTimeout(() => {
              const url = new URL('/thank-you', window.location.origin);
              const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
              utmParams.forEach(param => {
                const value = new URLSearchParams(window.location.search).get(param);
                if (value) url.searchParams.set(param, value);
              });
              window.location.href = url.toString();
            }, 1500);
          }).catch(() => {
            setStatus('err', 'Не удалось отправить заявку', 'Ошибка отправки');
          });
        }
        
        lockBtn(false);
        form.__sending = false;
      });
    });
  });
})();
