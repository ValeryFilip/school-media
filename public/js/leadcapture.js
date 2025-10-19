// public/js/leadcapture.js
(() => {
  if (window.__leadCaptureInit) return;
  window.__leadCaptureInit = true;

  // Проверяем, есть ли формы LeadCapture на странице
  const leadForms = document.querySelectorAll('.lead-form');
  if (leadForms.length === 0) {
    return; // Нет форм - выходим
  }

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ======= Attribution (UTM / session / GA cid) - копируем из popup.js
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

    const forms = $$('.lead-form');

    // Инициализация каждой формы LeadCapture
    forms.forEach((form) => {
      const status = $('.lead-status', form.closest('.lead-capture'));
      const debug = $('.lead-debug', form.closest('.lead-capture'));
      const submit = $('button[type="submit"]', form);
      const endpoint = form.getAttribute('action') || 'https://script.google.com/macros/s/AKfycbwBa6ffRK05gATFowu7yBpdmJ28C4EUEFJdxFrPbA_ZqRNizN1JK_b94Hb8SuJ9KxuE/exec';

      const setStatus = (kind, msg, dbg) => {
        if (status) {
          status.hidden = false;
          status.className = 'lead-status ' + (kind || '');
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

      if (!endpoint) { 
        setStatus('err', 'Не задан endpoint формы (action)'); 
        return; 
      }

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

        // Дополнительная защита: проверяем ключевые поля вручную
        const fullNameRaw = String(fields.full_name || fields.fullName || '').trim();
        const phoneRaw    = String(fields.phone || '').trim();
        if (!fullNameRaw || !phoneRaw) {
          setStatus('err', 'Введите имя и телефон');
          lockBtn(false);
          form.__sending = false;
          return;
        }
        
        // Читаем UTM метки из data-атрибутов формы
        const formUtm = {
          utm_source: form.dataset.utmSource || '',
          utm_medium: form.dataset.utmMedium || '',
          utm_campaign: form.dataset.utmCampaign || '',
          utm_content: form.dataset.utmContent || '',
          utm_term: form.dataset.utmTerm || '',
        };
        
        const attr = readAttribution();

        // Генерируем уникальный ID для отправки
        const submissionId = crypto?.randomUUID?.() ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(16).slice(2));

        // Объединяем UTM из формы с UTM из атрибуции
        const lastTouch = attr.last_touch || {};
        const combinedUtm = {
          ...lastTouch.utm,
          ...formUtm
        };
        
        const meta = {
          ts: nowISO(),
          page: location.href,
          page_title: document.title,
          referrer: document.referrer || '',
          popup_id: 'lead-capture', // фиксированный ID для LeadCapture
          session_id: attr.session_id || '',
          ga_client_id: attr.ga_client_id || '',
          first_touch: attr.first_touch || null,
          last_touch:  { ...lastTouch, utm: Object.keys(combinedUtm).length ? combinedUtm : undefined },
          submission_id: submissionId,
          trigger_id: 'lead-capture-form',
          trigger_text: 'Отправить заявку',
          trigger: { 
            id: 'lead-capture-form', 
            text: 'Отправить заявку', 
            dataset: { source: 'lead-capture', variant: 'main' } 
          }
        };

        // Преобразуем поля формы в формат, ожидаемый Google Sheets
        const formData = {
          fullName: fullNameRaw,
          phone: phoneRaw,
          telegram: (fields.telegram || '').trim(),
          ...meta
        };
        
        // Отправляем форму без reCAPTCHA
        sendFormData('');

        function sendFormData(recaptchaToken) {
          const body = new URLSearchParams();
          Object.entries(formData).forEach(([k, v]) => body.append(k, String(v)));
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
          // reCAPTCHA убрана
          // JSON-полезная нагрузка
          body.append('payload', JSON.stringify({ ...formData, __meta: meta }));

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
