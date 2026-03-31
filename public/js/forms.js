(() => {
  if (window.__formsInit) return;
  window.__formsInit = true;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "wbraid", "gbraid"];
  const REF_KEYS = ["ref", "ref_code", "ref_slug", "partner", "partner_code", "partner_slug"];
  const LS_FT = "attr:first_touch";
  const LS_LT = "attr:last_touch";
  const LS_SID = "attr:session_id";
  const LS_REF_FT = "attr:ref_first_touch";
  const LS_REF_LT = "attr:ref_last_touch";
  const DEFAULT_ENDPOINT = "https://script.google.com/macros/s/AKfycbzTaPkWHfzh1LI3igio8RXqNgX4DcIuWIiDHEMM_5qo5huDfu_TuNv8VcBnlQ0yVi5A/exec";
  const RECAPTCHA_SITE_KEY = "6LdH2McrAAAAAAjXZeXVKTAtKoGwJCjS4d9wVe4Z";

  const nowISO = () => new Date().toISOString();
  const hasKeys = (value) => value && Object.keys(value).length > 0;
  const tryParse = (value, fallback = null) => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };
  const uuid = () =>
    crypto?.randomUUID?.() ||
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const rand = (Math.random() * 16) | 0;
      const next = char === "x" ? rand : (rand & 0x3) | 0x8;
      return next.toString(16);
    });

  const parseCSV = (value) =>
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const isDebugEnabled = (form) =>
    window.__formsDebug === true || form.dataset.debugPayload === "true";

  const storeDebugPayload = (entry) => {
    window.__formsDebugLastPayload = entry;
    if (!Array.isArray(window.__formsDebugPayloads)) {
      window.__formsDebugPayloads = [];
    }
    window.__formsDebugPayloads.push(entry);
    if (window.__formsDebugPayloads.length > 10) {
      window.__formsDebugPayloads.shift();
    }
  };

  const parseUTMFromSearch = (search) => {
    const params = new URLSearchParams(search || "");
    const out = {};
    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) out[key] = value;
    });
    return out;
  };

  const parseReferralFromSearch = (search) => {
    const params = new URLSearchParams(search || "");
    for (const key of REF_KEYS) {
      const value = String(params.get(key) || "").trim();
      if (value) {
        return {
          code: value,
          key,
        };
      }
    }
    return null;
  };

  const readCookie = (name) => {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${name.replace(/([$?*|{}\\]\\^])/g, "\\$1")}=([^;]*)`),
    );
    return match ? decodeURIComponent(match[1]) : "";
  };

  const readGaClientId = () => {
    const ga = readCookie("_ga");
    if (!ga) return "";
    const parts = ga.split(".");
    return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : ga;
  };

  const ensureSessionId = () => {
    let sid = localStorage.getItem(LS_SID);
    if (!sid) {
      sid = uuid();
      localStorage.setItem(LS_SID, sid);
    }
    return sid;
  };

  const initAttribution = () => {
    ensureSessionId();
    const utm = parseUTMFromSearch(location.search);
    const referral = parseReferralFromSearch(location.search);
    const ref = document.referrer || "";
    const lastTouch = {
      ts: nowISO(),
      page: location.href,
      referrer: ref,
      utm: hasKeys(utm) ? utm : undefined,
    };
    localStorage.setItem(LS_LT, JSON.stringify(lastTouch));

    if (!localStorage.getItem(LS_FT) && hasKeys(utm)) {
      const firstTouch = {
        ts: nowISO(),
        landing_page: location.href,
        referrer: ref,
        utm,
      };
      localStorage.setItem(LS_FT, JSON.stringify(firstTouch));
    }

    if (referral) {
      const lastReferralTouch = {
        ts: nowISO(),
        page: location.href,
        referrer: ref,
        code: referral.code,
        key: referral.key,
      };
      localStorage.setItem(LS_REF_LT, JSON.stringify(lastReferralTouch));

      if (!localStorage.getItem(LS_REF_FT)) {
        const firstReferralTouch = {
          ts: nowISO(),
          landing_page: location.href,
          referrer: ref,
          code: referral.code,
          key: referral.key,
        };
        localStorage.setItem(LS_REF_FT, JSON.stringify(firstReferralTouch));
      }
    }
  };

  const readAttribution = () => ({
    session_id: localStorage.getItem(LS_SID) || "",
    first_touch: tryParse(localStorage.getItem(LS_FT)) || null,
    ref_first_touch: tryParse(localStorage.getItem(LS_REF_FT)) || null,
    ref_last_touch: tryParse(localStorage.getItem(LS_REF_LT)) || null,
    last_touch:
      tryParse(localStorage.getItem(LS_LT)) || {
        ts: nowISO(),
        page: location.href,
        referrer: document.referrer || "",
      },
    ga_client_id: readGaClientId(),
  });

  const getStatusNode = (form) =>
    $("[data-form-status], .status, .lead-status", form);
  const getDebugNode = (form) =>
    $("[data-form-debug], .debug, .lead-debug", form);

  const setStatus = (form, kind, message, debugMessage) => {
    const status = getStatusNode(form);
    const debug = getDebugNode(form);

    if (status) {
      status.hidden = false;
      status.className = `${status.className.split(" ")[0]} ${kind || ""}`.trim();
      status.textContent = message || "";
    }

    if (debug) {
      if (debugMessage) {
        debug.hidden = false;
        debug.textContent = debugMessage;
      } else {
        debug.hidden = true;
        debug.textContent = "";
      }
    }
  };

  const lockSubmit = (form, locked) => {
    const submit = $('button[type="submit"]', form);
    if (!submit) return;
    submit.dataset.label ??= submit.textContent || "";
    submit.disabled = !!locked;
    submit.textContent = locked ? "Отправляем..." : submit.dataset.label;
  };

  const normalizeTelegram = (value) => String(value || "").trim().replace(/^@+/, "");

  const normalizeFields = (entries) => {
    const out = {};

    Object.entries(entries).forEach(([key, rawValue]) => {
      const value = String(rawValue ?? "").trim();
      if (!value) return;

      if (key === "telegram") {
        const normalized = normalizeTelegram(value);
        if (normalized) out.telegram = normalized;
        return;
      }

      out[key] = value;
    });

    return out;
  };

  const buildMetaFields = (form, trigger, attr) => {
    const popup = form.closest("[data-popup]");
    const lastTouch = attr.last_touch || {};
    const lastTouchUtm = lastTouch.utm || {};
    const firstTouch = attr.first_touch || {};
    const firstTouchUtm = firstTouch.utm || {};
    const refFirstTouch = attr.ref_first_touch || {};
    const refLastTouch = attr.ref_last_touch || {};

    return {
      page: location.href,
      page_title: document.title,
      referrer: document.referrer || "",
      session_id: attr.session_id || "",
      ga_client_id: attr.ga_client_id || "",
      popup_id: popup?.id || "",
      trigger_id: trigger?.id || "",
      trigger_text: (trigger?.textContent || "").trim(),
      trigger_source: trigger?.dataset?.source || "",
      trigger_variant: trigger?.dataset?.variant || "",
      trigger_campaign: trigger?.dataset?.campaign || trigger?.dataset?.utmCampaign || "",
      lt_source: lastTouchUtm.utm_source || "",
      lt_medium: lastTouchUtm.utm_medium || "",
      lt_campaign: lastTouchUtm.utm_campaign || "",
      lt_content: lastTouchUtm.utm_content || "",
      lt_term: lastTouchUtm.utm_term || "",
      ft_source: firstTouchUtm.utm_source || "",
      ft_medium: firstTouchUtm.utm_medium || "",
      ft_campaign: firstTouchUtm.utm_campaign || "",
      ft_content: firstTouchUtm.utm_content || "",
      ft_term: firstTouchUtm.utm_term || "",
      ref_code: refLastTouch.code || refFirstTouch.code || "",
      ref_first_code: refFirstTouch.code || "",
      ref_last_code: refLastTouch.code || "",
    };
  };

  const validateCustomRules = (form, fields) => {
    const requiredAll = parseCSV(form.dataset.requiredAll);
    if (requiredAll.length && requiredAll.some((field) => !String(fields[field] || "").trim())) {
      return "Заполните обязательные поля";
    }

    const requiredAny = parseCSV(form.dataset.requiredAny);
    if (requiredAny.length && !requiredAny.some((field) => String(fields[field] || "").trim())) {
      return "Заполните хотя бы одно контактное поле";
    }

    const fallbackAny = ["phone", "telegram", "email"];
    if (!fallbackAny.some((field) => String(fields[field] || "").trim())) {
      return "Укажите хотя бы один способ связи";
    }

    return "";
  };

  const buildPayload = (form, rawFields, trigger, recaptchaToken) => {
    const attr = readAttribution();
    const fields = normalizeFields(rawFields);
    const formType = form.dataset.formType || "lead";
    const formId = form.dataset.formId || form.id || form.getAttribute("name") || "form";
    const submissionId = uuid();
    const metaFields = buildMetaFields(form, trigger, attr);

    return {
      ...fields,
      form_type: formType,
      form_id: formId,
      submission_id: submissionId,
      recaptcha_token: recaptchaToken || "",
      ...metaFields,
    };
  };

  const debugPayload = (form, payload) => {
    if (!isDebugEnabled(form)) return;
    const debugEntry = {
      created_at: nowISO(),
      form_id: payload.form_id,
      form_type: payload.form_type,
      payload,
    };
    storeDebugPayload(debugEntry);
    console.groupCollapsed(`[forms] ${payload.form_id}`);
    console.log("payload", payload);
    console.groupEnd();
  };

  const sendRequest = async (endpoint, payload) => {
    const body = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value == null) return;
      body.append(key, String(value));
    });
    body.append("raw_json", JSON.stringify(payload));

    await fetch(endpoint, {
      method: "POST",
      body,
      mode: "no-cors",
    });
  };

  const getRecaptchaToken = async (form) => {
    if (form.dataset.recaptcha !== "true") return "";
    if (typeof grecaptcha === "undefined" || window.location.hostname.includes("localhost")) return "";

    return new Promise((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const handleSuccess = (form) => {
    const successMessage = form.dataset.successMessage || "Заявка отправлена!";
    setStatus(form, "ok", successMessage);
    form.reset();

    const redirect = form.dataset.successRedirect;
    if (!redirect) return;

    const delay = Number(form.dataset.successDelay || 1500);
    setTimeout(() => {
      const url = new URL(redirect, window.location.origin);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "ref_code", "ref_slug", "partner", "partner_code", "partner_slug"].forEach((param) => {
        const value = new URLSearchParams(window.location.search).get(param);
        if (value) url.searchParams.set(param, value);
      });
      window.location.href = url.toString();
    }, Number.isFinite(delay) ? delay : 1500);
  };

  const initForm = (form) => {
    if (form.__unifiedBound) return;
    form.__unifiedBound = true;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.__sending) return;

      if (form.reportValidity && !form.reportValidity()) {
        setStatus(form, "err", "Проверьте обязательные поля");
        return;
      }

      const rawFields = Object.fromEntries(new FormData(form).entries());
      const popup = form.closest("[data-popup]");
      const trigger = popup?.__lastTrigger || null;
      const basePayload = buildPayload(form, rawFields, trigger, "");
      const validationError = validateCustomRules(form, basePayload);

      if (validationError) {
        setStatus(form, "err", validationError);
        return;
      }

      form.__sending = true;
      lockSubmit(form, true);
      setStatus(form, "", "Отправляем...");

      try {
        const recaptchaToken = await getRecaptchaToken(form);
        const payload = buildPayload(form, rawFields, trigger, recaptchaToken);
        debugPayload(form, payload);
        const endpoint = form.dataset.endpoint || form.getAttribute("action") || DEFAULT_ENDPOINT;
        await sendRequest(endpoint, payload);
        handleSuccess(form);
      } catch (error) {
        setStatus(form, "err", "Не удалось отправить заявку", String(error));
      } finally {
        lockSubmit(form, false);
        form.__sending = false;
      }
    });
  };

  const ready = (fn) => {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  };

  ready(() => {
    initAttribution();
    $$("form[data-form]").forEach(initForm);
  });
})();
