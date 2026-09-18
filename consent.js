/* Shared consent-gated measurement. Never send answers, result profiles or contact data. */
(function () {
  'use strict';
  if (window.azMeasurement) return;
  var GA = 'G-GN34WFFLX2';
  var PIXEL = '1863356931044141';
  var KEY = 'az_measurement_v1';
  var preferences = { analytics: false, marketing: false };
  var gaLoaded = false, metaLoaded = false, seen = new Set();
  var funnel = document.querySelector('[data-az-funnel]')?.getAttribute('data-az-funnel') || 'geros_mergaites';
  var eligible = location.pathname === '/' || location.pathname === '/embed' || location.pathname === '/thank-you.html';
  var debug = new URLSearchParams(location.search).get('measurement_debug') === '1';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  var denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  window.gtag('consent', 'default', denied);
  window.gtag('set', 'ads_data_redaction', true);
  function script(src) {
    var el = document.createElement('script'); el.async = true; el.src = src; document.head.appendChild(el);
  }

  function sourceReferrer() { try { return document.referrer ? new URL(document.referrer).origin + '/' : ''; } catch { return ''; } }
  function campaignFields() {
    var params = new URLSearchParams(location.search), fields = {};
    var map = { utm_source: 'campaign_source', utm_medium: 'campaign_medium', utm_campaign: 'campaign_name', utm_content: 'campaign_content', utm_id: 'campaign_id', utm_term: 'campaign_term' };
    Object.keys(map).forEach(function(key) {
      var value = params.get(key);
      if (value && /^[a-zA-Z0-9_. -]{1,120}$/.test(value)) fields[map[key]] = value;
    });
    return fields;
  }
  function cleanLocation() { return location.origin + location.pathname; }
  function loadTags() {
    if (!eligible) return;
    if (preferences.analytics && !gaLoaded) {
      gaLoaded = true;
      window.gtag('js', new Date());
      window.gtag('config', GA, {
        send_page_view: false, content_group: funnel, ...campaignFields(), linker: { domains: ['aurelijazitke.lt', 'testas.aurelijazitke.lt', 'daugiau.aurelijazitke.lt', 'geros-mergaites-testas.vercel.app', 'sav-s-sabota-o-testas.vercel.app'], accept_incoming: true }, allow_google_signals: false, allow_ad_personalization_signals: false,
        page_location: cleanLocation(), page_referrer: sourceReferrer(), page_title: funnel !== 'waitlist' ? 'Testas' : 'Laukiančiųjų sąrašas',
        ...(debug ? { debug_mode: true } : {})
      });
      window.gtag('event', 'page_view', { send_to: GA, page_location: cleanLocation(), page_referrer: sourceReferrer() });
      script('https://www.googletagmanager.com/gtag/js?id=' + GA);
    }
    if (preferences.marketing && !metaLoaded) {
      metaLoaded = true;
      var q = function () { if (q.callMethod) q.callMethod.apply(q, arguments); else q.queue.push(arguments); };
      q.queue = []; q.push = q; q.loaded = true; q.version = '2.0';
      window.fbq = q; window._fbq = q;
      q('consent', 'grant'); q('set', 'autoConfig', false, PIXEL); q('init', PIXEL);
      script('https://connect.facebook.net/en_US/fbevents.js');
      q('trackSingle', PIXEL, 'PageView');
      // Form conversions are emitted only by explicit success handlers below.
    }
  }
  function read() {
    try {
      var value = document.cookie.split('; ').find(function (x) { return x.startsWith(KEY + '='); });
      if (!value) return null;
      var saved = JSON.parse(decodeURIComponent(value.slice(KEY.length + 1)));
      return typeof saved.analytics === 'boolean' && typeof saved.marketing === 'boolean' ? saved : null;
    } catch { return null; }
  }
  function apply(next) {
    preferences = next;
    window['ga-disable-' + GA] = !next.analytics;
    window.gtag('consent', 'update', {
      analytics_storage: next.analytics ? 'granted' : 'denied',
      ad_storage: next.marketing ? 'granted' : 'denied',
      ad_user_data: next.marketing ? 'granted' : 'denied',
      ad_personalization: 'denied'
    });
    if (window.fbq) window.fbq('consent', next.marketing ? 'grant' : 'revoke');
    loadTags();
  }
  function clearCookies() {
    document.cookie.split(';').forEach(function (item) {
      var name = item.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat|_gcl|_fbp|_fbc)/.test(name)) return;
      ['', location.hostname, '.aurelijazitke.lt'].forEach(function (domain) {
        document.cookie = name + '=;Max-Age=0;Path=/' + (domain ? ';Domain=' + domain : '') + ';SameSite=Lax';
      });
    });
  }
  function save(next) {
    var revoked = (preferences.analytics && !next.analytics) || (preferences.marketing && !next.marketing);
    var domain = /(^|\.)aurelijazitke\.lt$/.test(location.hostname) ? ';Domain=.aurelijazitke.lt' : '';
    document.cookie = KEY + '=' + encodeURIComponent(JSON.stringify(next)) + ';Max-Age=15552000;Path=/;SameSite=Lax' + domain + (location.protocol === 'https:' ? ';Secure' : '');
    if (revoked) {
      preferences = next;
      window['ga-disable-' + GA] = true;
      if (window.fbq) window.fbq('consent', 'revoke');
      clearCookies();
      location.reload();
      return;
    }
    apply(next); panel.hidden = true; settings.focus();
  }
  function track(name) {
    if (!eligible || !['quiz_start', 'quiz_complete', 'email_submitted', 'waitlist_signup'].includes(name)) return;
    // Do not queue actions performed before consent; a later opt-in is not retroactive.
    if (preferences.analytics && !seen.has('ga:' + name)) {
      seen.add('ga:' + name);
      window.gtag('event', name, { send_to: GA, funnel: funnel, page_location: cleanLocation(), page_referrer: sourceReferrer(), ...(debug ? {debug_mode: true} : {}) });
    }
    if (preferences.marketing && !seen.has('meta:' + name)) {
      seen.add('meta:' + name);
      var names = { quiz_start: 'QuizStart', quiz_complete: 'QuizComplete', email_submitted: 'Lead', waitlist_signup: 'CompleteRegistration' };
      window.fbq(name === 'email_submitted' || name === 'waitlist_signup' ? 'trackSingle' : 'trackSingleCustom', PIXEL, names[name], { funnel: funnel });
    }
  }
  window.azMeasurement = { track: track, open: function () { panel.hidden = false; panel.querySelector('button').focus(); } };
  window.addEventListener('aurelija:quiz-event', function (event) {
    var name = event.detail?.event;
    track(name === 'lead_submit_success' ? 'email_submitted' : name);
  });
  var style = document.createElement('style');
  style.textContent = '#az-consent{position:fixed;bottom:16px;left:16px;right:16px;max-width:650px;margin:auto;z-index:9999;background:#fffdf9;color:#302332;border:1px solid #c9aec9;border-radius:16px;padding:24px;box-shadow:0 8px 40px #0003;font:16px/1.5 system-ui;max-height:85vh;overflow:auto}#az-consent[hidden]{display:none}#az-consent h2{font:600 22px/1.3 system-ui;margin:0 0 10px}#az-consent p{margin:8px 0}#az-consent .az-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}#az-consent button,#az-settings{font:600 14px system-ui;cursor:pointer;border:1px solid #70536d;border-radius:8px;padding:12px 16px;background:#fffdf9;color:#3e2436}#az-consent button:focus-visible,#az-settings:focus-visible{outline:3px solid #be8a4a;outline-offset:3px}#az-consent label{display:block;margin:8px 0}#az-consent input{appearance:auto;width:18px;height:18px;margin-right:8px}#az-settings{position:fixed;bottom:8px;left:8px;z-index:9998;font-size:12px;padding:8px}';
  document.head.appendChild(style);
  var panel = document.createElement('section'); panel.id = 'az-consent'; panel.setAttribute('aria-label', 'Slapukų pasirinkimai');
  panel.innerHTML = '<h2>Slapukai</h2><p>Naudojame slapukus svetainės lankomumui ir reklamos rezultatams matuoti. Pasirinkus „Tik būtini“, šis matavimas neįjungiamas.</p><p><a href="/privacy.html">Slapukų ir privatumo politika</a></p><div class="az-actions"><button type="button" data-choice="all">Sutinku su visais</button><button type="button" data-choice="none">Tik būtini</button></div>';
  var settings = document.createElement('button'); settings.id = 'az-settings'; settings.type = 'button'; settings.textContent = 'Slapukų nustatymai'; settings.onclick = window.azMeasurement.open;
  document.body.appendChild(settings); document.body.appendChild(panel);
  panel.querySelectorAll('button').forEach(function (button) { button.onclick = function () {
    var choice = button.getAttribute('data-choice');
    save({ analytics: choice === 'all', marketing: choice === 'all' });
  }; });
  window.azTrack = function (name) {
    var map = { test_start: 'quiz_start', test_restart: 'quiz_start', test_complete: 'quiz_complete' };
    if (map[name]) track(map[name]);
  };
  window.azStorePendingTestLead = function () {
    try { sessionStorage.setItem('az_measurement_pending_lead', JSON.stringify({ at: Date.now(), analytics: preferences.analytics, marketing: preferences.marketing })); } catch {}
  };
  document.addEventListener('click', function(event) { if (event.target.closest('[data-az-customize]')) window.azMeasurement.open(); });
  var saved = read();
  if (saved) { panel.hidden = true; apply(saved); }
  if (location.pathname === '/thank-you.html') {
    try {
      var pending = JSON.parse(sessionStorage.getItem('az_measurement_pending_lead') || 'null');
      sessionStorage.removeItem('az_measurement_pending_lead');
      sessionStorage.removeItem('az_test_signup');
      if (pending && Date.now() - pending.at < 120000) {
        var current = preferences;
        preferences = { analytics: current.analytics && pending.analytics, marketing: current.marketing && pending.marketing };
        track('email_submitted'); preferences = current;
      }
    } catch {}
  }
})();
