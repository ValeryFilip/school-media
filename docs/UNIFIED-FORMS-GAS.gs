const SHEET_ID = 'PUT_YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Leads';

const RECAPTCHA_SECRET_KEY = 'PUT_YOUR_RECAPTCHA_SECRET_HERE';
const RECAPTCHA_MIN_SCORE = 0.5;

const HEADERS = [
  'created_at',
  'form_type',
  'form_id',
  'name',
  'phone',
  'telegram',
  'email',
  'message',
  'consent_privacy',
  'consent_personal_data',
  'consent_marketing',
  'page',
  'page_title',
  'referrer',
  'session_id',
  'submission_id',
  'ga_client_id',
  'popup_id',
  'trigger_id',
  'trigger_text',
  'trigger_source',
  'trigger_variant',
  'trigger_campaign',
  'lt_source',
  'lt_medium',
  'lt_campaign',
  'lt_content',
  'lt_term',
  'ft_source',
  'ft_medium',
  'ft_campaign',
  'ft_content',
  'ft_term',
  'ref_code',
  'ref_first_code',
  'ref_last_code',
  'recaptcha_score',
  'recaptcha_success',
  'raw_json',
];

function doPost(e) {
  try {
    const incoming = parseIncoming_(e);
    const data = normalizePayload_(incoming);

    const contactError = validateContacts_(data);
    if (contactError) {
      return respond_({ ok: false, error: contactError });
    }

    const recaptchaRequired = isRecaptchaRequired_(data);
    let recaptcha = { success: false, score: '', error: '' };

    if (recaptchaRequired) {
      if (!data.recaptcha_token) {
        return respond_({ ok: false, error: 'reCAPTCHA token missing' });
      }
      recaptcha = validateRecaptcha_(data.recaptcha_token);
      if (!recaptcha.success) {
        return respond_({ ok: false, error: 'reCAPTCHA validation failed: ' + (recaptcha.error || 'unknown') });
      }
      if (Number(recaptcha.score || 0) < RECAPTCHA_MIN_SCORE) {
        return respond_({ ok: false, error: 'reCAPTCHA score too low: ' + recaptcha.score });
      }
    }

    if (!registerOnce_(data.submission_id)) {
      return respond_({ ok: true, dedup: true });
    }

    data.recaptcha_score = recaptcha.success ? recaptcha.score : '';
    data.recaptcha_success = recaptcha.success ? 'true' : '';
    data.raw_json = JSON.stringify(data);

    const row = mapRow_(data);
    const rowNumber = appendRow_(row);
    return respond_({ ok: true, row: rowNumber });
  } catch (error) {
    return respond_({ ok: false, error: String(error) });
  }
}

function doGet() {
  return respond_({ ok: true, hint: 'POST form data here' });
}

function parseIncoming_(e) {
  let payload = {};

  if (!e || !e.postData) return payload;

  const type = String(e.postData.type || '').toLowerCase();
  const contents = e.postData.contents || '';

  if (type.indexOf('application/json') >= 0) {
    payload = JSON.parse(contents || '{}');
  } else if (type.indexOf('application/x-www-form-urlencoded') >= 0) {
    payload = Object.assign({}, e.parameter || {});
    if (typeof payload.payload === 'string') {
      const parsedPayload = tryParseJson_(payload.payload);
      if (parsedPayload) payload = parsedPayload;
    }
  } else {
    payload = tryParseJson_(contents) || Object.assign({}, e.parameter || {});
  }

  return payload || {};
}

function normalizePayload_(input) {
  const safe = (value) => (value == null ? '' : String(value).trim());
  const source = Object.assign({}, input || {});

  if (source.__meta && source.__meta.contract) {
    return normalizePayload_(source.__meta.contract);
  }

  if (!source.raw_json && typeof source.payload === 'string') {
    const parsed = tryParseJson_(source.payload);
    if (parsed) return normalizePayload_(parsed);
  }

  const output = {
    created_at: new Date().toISOString(),
    form_type: safe(source.form_type),
    form_id: safe(source.form_id),
    name: safe(source.name || source.fullName || source.full_name),
    phone: safe(source.phone),
    telegram: safe(source.telegram).replace(/^@+/, ''),
    email: safe(source.email),
    message: safe(source.message),
    consent_privacy: normalizeCheckbox_(source.consent_privacy),
    consent_personal_data: normalizeCheckbox_(source.consent_personal_data),
    consent_marketing: normalizeCheckbox_(source.consent_marketing),
    page: safe(source.page),
    page_title: safe(source.page_title),
    referrer: safe(source.referrer),
    session_id: safe(source.session_id),
    submission_id: safe(source.submission_id),
    ga_client_id: safe(source.ga_client_id),
    popup_id: safe(source.popup_id),
    trigger_id: safe(source.trigger_id),
    trigger_text: safe(source.trigger_text),
    trigger_source: safe(source.trigger_source),
    trigger_variant: safe(source.trigger_variant),
    trigger_campaign: safe(source.trigger_campaign),
    lt_source: safe(source.lt_source),
    lt_medium: safe(source.lt_medium),
    lt_campaign: safe(source.lt_campaign),
    lt_content: safe(source.lt_content),
    lt_term: safe(source.lt_term),
    ft_source: safe(source.ft_source),
    ft_medium: safe(source.ft_medium),
    ft_campaign: safe(source.ft_campaign),
    ft_content: safe(source.ft_content),
    ft_term: safe(source.ft_term),
    ref_code: safe(source.ref_code || source.ref || source.ref_slug || source.partner || source.partner_code || source.partner_slug),
    ref_first_code: safe(source.ref_first_code),
    ref_last_code: safe(source.ref_last_code),
    recaptcha_token: safe(source.recaptcha_token),
    recaptcha_score: '',
    recaptcha_success: '',
    raw_json: '',
  };

  if (!output.form_type) output.form_type = 'lead';
  if (!output.form_id) output.form_id = 'form';
  if (!output.submission_id) output.submission_id = Utilities.getUuid();

  return output;
}

function validateContacts_(data) {
  if (data.phone || data.telegram || data.email) return '';
  return 'At least one contact field is required';
}

function isRecaptchaRequired_(data) {
  return !!data.recaptcha_token;
}

function validateRecaptcha_(token) {
  const url = 'https://www.google.com/recaptcha/api/siteverify';
  const payload = {
    secret: RECAPTCHA_SECRET_KEY,
    response: token,
  };

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      payload: payload,
      muteHttpExceptions: true,
    });
    const result = JSON.parse(response.getContentText() || '{}');
    return {
      success: !!result.success,
      score: result.score || 0,
      error: result['error-codes'] ? result['error-codes'].join(', ') : '',
    };
  } catch (error) {
    return {
      success: false,
      score: 0,
      error: String(error),
    };
  }
}

function mapRow_(data) {
  return HEADERS.map(function(header) {
    if (header === 'created_at') return new Date();
    return data[header] == null ? '' : data[header];
  });
}

function appendRow_(row) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    ensureHeader_(sh);
    const nextRow = sh.getLastRow() + 1;
    sh.getRange(nextRow, 1, 1, HEADERS.length).setValues([row]);
    return nextRow;
  } finally {
    lock.releaseLock();
  }
}

function ensureHeader_(sheet) {
  const width = HEADERS.length;
  const range = sheet.getRange(1, 1, 1, width);
  const current = range.getValues()[0] || [];

  if (!current.length || current.join('|') !== HEADERS.join('|')) {
    sheet.clear();
    sheet.getRange(1, 1, 1, width).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, width);
  }
}

function registerOnce_(submissionId) {
  if (!submissionId) return true;

  const key = 'sub:' + submissionId;
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const cache = CacheService.getScriptCache();
    if (cache.get(key)) return false;

    const props = PropertiesService.getScriptProperties();
    if (props.getProperty(key)) return false;

    cache.put(key, '1', 6 * 3600);
    props.setProperty(key, '1');
    return true;
  } finally {
    lock.releaseLock();
  }
}

function normalizeCheckbox_(value) {
  const normalized = String(value == null ? '' : value).trim().toLowerCase();
  if (!normalized) return '';
  if (normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes') return 'true';
  return '';
}

function tryParseJson_(value) {
  try {
    return JSON.parse(value || '{}');
  } catch (_) {
    return null;
  }
}

function respond_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
