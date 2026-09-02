(() => {
  'use strict';

  const GA_ID = 'G-GN34WFFLX2';
  const META_PIXEL_ID = '1863356931044141';
  const CONSENT_KEY = 'az_test_consent_v2';
  const CONSENT_VERSION = 2;
  const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const DEFAULT_PREFERENCES = Object.freeze({ analytics: false, marketing: false });

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  });
  window.gtag('set', 'ads_data_redaction', true);

  let preferences = { ...DEFAULT_PREFERENCES };
  let googleTagQueued = false;
  let metaPixelLoaded = false;
  let lastFocusedElement = null;

  function normalize(value) {
    return {
      analytics: value?.analytics === true,
      marketing: value?.marketing === true,
    };
  }

  function readConsent() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      if (!saved) return null;
      if (saved.version !== CONSENT_VERSION) return null;
      if (Date.now() - Number(saved.updatedAt || 0) >= CONSENT_MAX_AGE) {
        localStorage.removeItem(CONSENT_KEY);
        return null;
      }
      return normalize(saved.preferences);
    } catch {
      return null;
    }
  }

  function persistConsent(next) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        updatedAt: Date.now(),
        preferences: normalize(next),
      }));
    } catch (error) {
      console.warn('Nepavyko išsaugoti slapukų pasirinkimo.', error);
    }
  }

  function updateGoogleConsent(next) {
    const analytics = next.analytics ? 'granted' : 'denied';
    const marketing = next.marketing ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      analytics_storage: analytics,
      ad_storage: marketing,
      ad_user_data: marketing,
      ad_personalization: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
    });
  }

  function loadGoogleTag() {
    if (googleTagQueued || (!preferences.analytics && !preferences.marketing)) return;
    googleTagQueued = true;
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      send_page_view: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      linker: {
        domains: ['aurelijazitke.lt', 'sav-s-sabota-o-testas.vercel.app'],
        accept_incoming: true,
        decorate_forms: true,
      },
      debug_mode: location.hostname === 'localhost',
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);
  }

  function loadMetaPixel() {
    if (metaPixelLoaded || !preferences.marketing) return;
    metaPixelLoaded = true;
    ((factory, documentRef, tagName, source, pixel, firstScript, script) => {
      if (factory.fbq) return;
      pixel = factory.fbq = function fbq() {
        pixel.callMethod ? pixel.callMethod.apply(pixel, arguments) : pixel.queue.push(arguments);
      };
      if (!factory._fbq) factory._fbq = pixel;
      pixel.push = pixel;
      pixel.loaded = true;
      pixel.version = '2.0';
      pixel.queue = [];
      firstScript = documentRef.getElementsByTagName(tagName)[0];
      script = documentRef.createElement(tagName);
      script.async = true;
      script.src = source;
      firstScript.parentNode.insertBefore(script, firstScript);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('consent', 'grant');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function removeMeasurementCookies() {
    const names = document.cookie
      .split(';')
      .map((part) => part.split('=')[0].trim())
      .filter((name) => name === '_ga' || name.startsWith('_ga_') || name === '_gcl_au' || name === '_fbp' || name === '_fbc');
    names.forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`;
    });
  }

  function track(eventName, parameters = {}) {
    if (!preferences.analytics && !preferences.marketing) return;
    loadGoogleTag();
    window.gtag('event', eventName, {
      ...parameters,
      page_path: location.pathname,
      transport_type: 'beacon',
    });
  }

  function trackMeta(eventName, parameters = {}) {
    if (!preferences.marketing) return;
    loadMetaPixel();
    window.fbq?.('track', eventName, parameters);
  }

  function handlePendingLead() {
    if (!location.pathname.endsWith('/thank-you.html')) return;
    let pending = null;
    try {
      pending = JSON.parse(sessionStorage.getItem('az_test_signup') || 'null');
    } catch {}
    if (!pending) return;
    if (preferences.analytics || preferences.marketing) {
      track('sign_up', { method: 'test_email', archetype: pending.archetype || 'unknown' });
      track('generate_lead', { lead_source: 'self_sabotage_test', archetype: pending.archetype || 'unknown' });
    }
    if (preferences.marketing) trackMeta('Lead', { content_name: 'Savęs sabotažo testas' });
    try {
      sessionStorage.removeItem('az_test_signup');
    } catch {}
  }

  const banner = document.createElement('section');
  banner.className = 'az-consent-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-labelledby', 'az-consent-title');
  banner.innerHTML = `
    <div class="az-consent-copy">
      <strong id="az-consent-title">Tavo privatumo pasirinkimas</strong>
      <p>Statistikos ir reklamos rezultatų matavimą įjungsime tik tau leidus. <a href="/privacy.html">Plačiau</a>.</p>
    </div>
    <div class="az-consent-actions">
      <button class="az-consent-button" type="button" data-az-reject>Tik būtini</button>
      <button class="az-consent-button" type="button" data-az-customize>Pasirinkti</button>
      <button class="az-consent-button az-consent-button-primary" type="button" data-az-accept>Leisti visus</button>
    </div>`;

  const layer = document.createElement('div');
  layer.className = 'az-consent-layer';
  layer.hidden = true;
  layer.innerHTML = `
    <section class="az-consent-modal" role="dialog" aria-modal="true" aria-labelledby="az-modal-title">
      <button class="az-consent-close" type="button" data-az-close aria-label="Uždaryti slapukų nustatymus">×</button>
      <h2 id="az-modal-title">Slapukų nustatymai</h2>
      <p>Pasirinkimą bet kada galėsi pakeisti šio puslapio apačioje.</p>
      <div class="az-consent-options">
        <label class="az-consent-option az-consent-option-required">
          <span><strong>Būtinieji</strong><small>Reikalingi pasirinkimui ir testo veikimui.</small></span>
          <input type="checkbox" checked disabled aria-label="Būtinieji visada įjungti">
        </label>
        <label class="az-consent-option">
          <span><strong>Statistika</strong><small>„Google Analytics“ padeda matyti testo pradžią, pabaigą ir registracijas.</small></span>
          <input type="checkbox" data-az-toggle="analytics">
        </label>
        <label class="az-consent-option">
          <span><strong>Reklamos rezultatų matavimas</strong><small>„Google Ads“ ir „Meta Pixel“ padeda įvertinti reklamos rezultatą. „Google“ personalizuotos reklamos signalai išjungti.</small></span>
          <input type="checkbox" data-az-toggle="marketing">
        </label>
      </div>
      <div class="az-consent-modal-actions">
        <button class="az-consent-button" type="button" data-az-reject>Tik būtini</button>
        <button class="az-consent-button az-consent-button-primary" type="button" data-az-save>Išsaugoti pasirinkimą</button>
      </div>
      <p class="az-consent-legal"><a href="/privacy.html">Privatumo ir slapukų informacija</a></p>
    </section>`;

  const settingsButton = document.createElement('button');
  settingsButton.type = 'button';
  settingsButton.className = 'az-consent-settings';
  settingsButton.dataset.azCustomize = '';
  settingsButton.textContent = 'Slapukų nustatymai';

  document.body.append(banner, layer, settingsButton);

  function syncControls() {
    layer.querySelectorAll('[data-az-toggle]').forEach((input) => {
      input.checked = preferences[input.dataset.azToggle] === true;
    });
  }

  function openSettings() {
    lastFocusedElement = document.activeElement;
    syncControls();
    layer.hidden = false;
    document.body.classList.add('az-consent-open');
    layer.querySelector('[data-az-toggle="analytics"]')?.focus();
  }

  function closeSettings() {
    layer.hidden = true;
    document.body.classList.remove('az-consent-open');
    lastFocusedElement?.focus?.();
  }

  function applyPreferences(next, save = true) {
    const previous = { ...preferences };
    preferences = normalize(next);
    if (save) persistConsent(preferences);
    updateGoogleConsent(preferences);
    if (preferences.analytics || preferences.marketing) loadGoogleTag();
    if (preferences.marketing) loadMetaPixel();
    if ((previous.analytics && !preferences.analytics) || (previous.marketing && !preferences.marketing)) {
      window.fbq?.('consent', 'revoke');
      removeMeasurementCookies();
    }
    banner.hidden = true;
    closeSettings();
    handlePendingLead();
  }

  const stored = readConsent();
  if (stored) {
    preferences = stored;
    updateGoogleConsent(preferences);
    if (preferences.analytics || preferences.marketing) loadGoogleTag();
    if (preferences.marketing) loadMetaPixel();
    banner.hidden = true;
    handlePendingLead();
  } else {
    banner.hidden = false;
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.matches('[data-az-reject]')) {
      applyPreferences(DEFAULT_PREFERENCES);
    } else if (target.matches('[data-az-accept]')) {
      applyPreferences({ analytics: true, marketing: true });
    } else if (target.matches('[data-az-customize]')) {
      openSettings();
    } else if (target.matches('[data-az-close]')) {
      closeSettings();
    } else if (target.matches('[data-az-save]')) {
      const next = {};
      layer.querySelectorAll('[data-az-toggle]').forEach((input) => {
        next[input.dataset.azToggle] = input.checked;
      });
      applyPreferences(next);
    }
  });

  layer.addEventListener('click', (event) => {
    if (event.target === layer) closeSettings();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !layer.hidden) closeSettings();
  });

  window.azTrack = track;
  window.azTrackMeta = trackMeta;
  window.azStorePendingTestLead = (archetype) => {
    try {
      sessionStorage.setItem('az_test_signup', JSON.stringify({ archetype, createdAt: Date.now() }));
    } catch {}
  };
  window.azConsent = Object.freeze({
    openSettings,
    getConsent: () => ({ ...preferences }),
  });
})();
