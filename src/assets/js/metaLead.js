/**
 * Port of metaLead.ts for Gulp/JS.
 * New libraries are not added: CAPI goes through native fetch.
 * Form keeps TWO events: `lead` and `meta_lead`.
 *
 * CAPI is fire-and-forget: PHP with ignore_user_abort finishes Graph API.
 * Telegram from the landing only if the request never left (network/CORS).
 * 502 / Meta errors — PHP only.
 */

import Cookies from 'js-cookie';
import service from './service.js';

const META_LEAD_EVENT = 'meta_lead';
const META_CAPI_URL = 'https://services.goiteens.com/meta/meta-capi.php';
const META_CAPI_HANDOFF_MS = 1000;

/**
 * After a successful Zoho response: GTM/Pixel + start CAPI.
 * Never throws. The user sees an error only if Zoho failed in the form.
 */
async function sendMetaLead(args) {
  const payload = buildMetaLeadPayload(args);

  try {
    const capiPromise = pushMetaLeadToCapi(payload, args);
    const [gtm] = await Promise.all([
      pushMetaLeadToGtm(payload),
      waitAtMost(capiPromise, META_CAPI_HANDOFF_MS),
    ]);

    if (gtm === 'error' || gtm === 'no dataLayer') {
      void reportMetaLeadIssue(`[meta_lead] gtm=${gtm}`, args, payload, { gtm });
    }

    return {
      eventId: payload.event_id,
      gtm,
      payload,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[meta_lead] unexpected error:', error);
    void reportMetaLeadIssue(`[meta_lead] unexpected: ${message}`, args, payload);

    return {
      eventId: payload.event_id,
      gtm: 'error',
      payload,
    };
  }
}

function buildMetaLeadPayload({ dealId, email, phone, name, ip }) {
  const externalId = toMetaString(dealId) || service.uid();

  return {
    event: META_LEAD_EVENT,
    event_name: META_LEAD_EVENT,
    event_id: `lead_${externalId}`,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: typeof window !== 'undefined' ? window.location.href : '',
    action_source: 'website',
    user_data: {
      em: toMetaString(email).toLowerCase(),
      ph: digitsOnlyPhone(toMetaString(phone)),
      fn: toMetaString(name).toLowerCase(),
      external_id: externalId,
      client_ip_address: toMetaString(ip),
      client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      fbc: Cookies.get('_fbc') || '',
      fbp: Cookies.get('_fbp') || '',
    },
  };
}

async function pushMetaLeadToGtm(payload) {
  try {
    const { event: eventName, ...eventData } = payload;
    return await service.pushGtmEvent(eventName, eventData);
  } catch (error) {
    console.error('[meta_lead] GTM push failed:', error);
    return 'error';
  }
}

/**
 * POST to PHP without abort and without waiting for Graph API.
 * HTTP 4xx/5xx / timeout are not reported — PHP finishes Meta and sends Telegram.
 * Telegram from the landing only if the request never left (network, CORS).
 */
async function pushMetaLeadToCapi(payload, args) {
  try {
    await fetch(META_CAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (error) {
    console.error('[meta_lead] CAPI unreachable:', error);
    void reportMetaLeadIssue('[meta_lead] capi unreachable', args, payload, {
      capi: 'unreachable',
    });
  }
}

function reportMetaLeadIssue(message, args, payload, extra) {
  return service.reportError(message, {
    name: toMetaString(args.name) || undefined,
    email: toMetaString(args.email) || undefined,
    phone: toMetaString(args.phone) || undefined,
    dealId: payload.user_data.external_id,
    event_id: payload.event_id,
    ...extra,
  });
}

function toMetaString(value) {
  if (value == null || value === '') {
    return '';
  }
  return String(value).trim();
}

function digitsOnlyPhone(value) {
  return value.replace(/\D/g, '');
}

function waitAtMost(promise, ms) {
  return new Promise(resolve => {
    const timer = window.setTimeout(() => resolve(), ms);

    promise.then(
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      () => {
        window.clearTimeout(timer);
        resolve();
      }
    );
  });
}

export { META_LEAD_EVENT, sendMetaLead, buildMetaLeadPayload };
