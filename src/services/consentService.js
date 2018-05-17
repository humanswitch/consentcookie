/*
 * Copyright 2018 Asknow Solutions B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Dependencies
const _ = require('underscore');
const jsCookie = require('js-cookie');

// Defaults
const DEFAULT_CONSENTS_SEPERATOR = '&';
const DEFAULT_CONSENT_SEPERATOR = '=';

const DEFAULT_CONSENTCOOKIE_NAME = 'consentcookie';
const DEFAULT_CONSENTCOOKIE_TTL = (20 * 365); // Default expire time, 20 years from now in days
const DEFAULT_CONSENTCOOKIE_VAL_ACCEPTED = 1;
const DEFAULT_CONSENTCOOKIE_VAL_REJECTED = 0;
const DEFAULT_CONSENTCOOKIE_VAL_ALWAYSON = -1;

const DEFAULT_STATE_CONSENT_OPTIN = DEFAULT_CONSENTCOOKIE_VAL_REJECTED;
const DEFAULT_STATE_CONSENT_OPTOUT = DEFAULT_CONSENTCOOKIE_VAL_ACCEPTED;
const DEFAULT_STATE_CONSENT_ALWAYSON = DEFAULT_CONSENTCOOKIE_VAL_ALWAYSON;

const DEFAULT_CONSENT_STATE_LABEL_OPTIN = 'optin';
const DEFAULT_CONSENT_STATE_LABEL_OPTOUT = 'optout';
const DEFAULT_CONSENT_STATE_LABEL_ALWAYSON = 'alwayson';

const DEFAULT_CONSENT_STATE = DEFAULT_STATE_CONSENT_ALWAYSON;

const DEFAULT_CONFIG_KEY_APPS_CONSENT = 'apps.consent';

const DEFAULT_CONSENTCOOKIE_ID_CONSENTWALL = 'ccw';

class Consents {

  constructor($ccCookies) {
    this.consents = {};
    this.cookies = $ccCookies;
  }

  get($id) {
    return this.consents[$id] ? this.consents[$id] : null;
  }

  add($consent) {
    if ($consent instanceof Consent) {
      this.consents[$consent.id] = $consent;
    }
  }

  serialize() {
    const toSerialize = _.clone(this.consents);
    // Add all `stale` consents so that we aren`t overriding values
    _.each(this.cookies, ($ccAppValue, $ccAppId) => {
      if (!toSerialize[$ccAppId]) {
        toSerialize[$ccAppId] = new Consent($ccAppId, $ccAppValue);
      }
    });
    const serialized = _.map(_.values(toSerialize), $consent => $consent.serialize());
    return serialized.join(DEFAULT_CONSENTS_SEPERATOR);
  }

  static create($ccApps, $ccCookieMap) {
    const consents = new Consents($ccCookieMap);

    if (!(_.isObject($ccApps))) {
      return consents;
    }

    _.each($ccApps, ($ccAppVal, $ccAppId) => {
      if (_.isString($ccAppId) && _.isObject($ccAppVal)) {
        consents.add(Consent.create($ccAppId, $ccAppVal, $ccCookieMap));
      }
    });
    return consents;
  }
}

class Consent {

  constructor($id, $flag) {
    this.id = $id;
    this.flag = $flag;
  }

  serialize() {
    return this.id + DEFAULT_CONSENT_SEPERATOR + this.flag;
  }

  isAccepted() {
    return this.flag === DEFAULT_CONSENTCOOKIE_VAL_ACCEPTED;
  }

  isRejected() {
    return this.flag === DEFAULT_CONSENTCOOKIE_VAL_REJECTED;
  }

  isAlwaysOn() {
    return this.flag === DEFAULT_CONSENTCOOKIE_VAL_ALWAYSON;
  }

  isEnabled() {
    return this.isAccepted() || this.isAlwaysOn();
  }

  static create($ccAppId, $ccAppVal, $ccCookieMap) {
    if (!(_.isString($ccAppId)) && !(_.isObject($ccAppVal))) {
      return null;
    }
    return new Consent($ccAppId, getConsentValue($ccAppId, $ccAppVal, $ccCookieMap));
  }
}

let vue;
let consents;

function init(vueServices) {
  vue = vueServices.getVueInstance();
}

function getConsentValue($ccAppId, $ccAppVal, $ccCookieVal) {
  const $ccAppInitState = getInitState($ccAppVal.initstate);
  let $ccCookieConsentVal = $ccCookieVal[$ccAppId];

  if (typeof $ccCookieConsentVal === 'undefined' || $ccCookieConsentVal == null) {
    $ccCookieConsentVal = $ccAppInitState;
  } else if (DEFAULT_STATE_CONSENT_ALWAYSON === $ccAppInitState) {
    // New settings is, no optin or optout. Override setting
    $ccCookieConsentVal = $ccAppInitState;
  } else if (DEFAULT_STATE_CONSENT_ALWAYSON !== $ccAppInitState
    && $ccCookieConsentVal === DEFAULT_STATE_CONSENT_ALWAYSON) {
    // New setting is optin or optout and old was mandatory
    $ccCookieConsentVal = $ccAppInitState;
  }
  return $ccCookieConsentVal;
}

function getCCCookieMap() {
  const ccCookie = jsCookie.get(DEFAULT_CONSENTCOOKIE_NAME) || '';
  const map = _.reduce(ccCookie.split(DEFAULT_CONSENTS_SEPERATOR), ($memo, $ccCookieVal) => {
    if (!(_.isString($ccCookieVal))) {
      return $memo;
    }

    const parsed = $ccCookieVal.split(DEFAULT_CONSENT_SEPERATOR);
    if (_.isString(parsed[0]) && !(_.isNaN(Number(parsed[1])))) {
      $memo[parsed[0]] = Number(parsed[1]);
    }
    return $memo;
  }, {});
  return map;
}

function getCCApps() {
  const configuredApps = _.clone(vue.$services.config.get(DEFAULT_CONFIG_KEY_APPS_CONSENT));
  if (vue.$services.main.isConsentWallEnabled()) {
    configuredApps[DEFAULT_CONSENTCOOKIE_ID_CONSENTWALL] = { initstate: DEFAULT_CONSENT_STATE_LABEL_OPTIN };
  }
  return configuredApps;
}

function load() {
  const ccCookieMap = getCCCookieMap();
  const ccApps = getCCApps();
  consents = Consents.create(ccApps, ccCookieMap);
  save();
}

function getInitState($stateName) {
  if (DEFAULT_CONSENT_STATE_LABEL_OPTIN === $stateName) {
    return DEFAULT_STATE_CONSENT_OPTIN;
  }
  if (DEFAULT_CONSENT_STATE_LABEL_OPTOUT === $stateName) {
    return DEFAULT_STATE_CONSENT_OPTOUT;
  }
  if (DEFAULT_CONSENT_STATE_LABEL_ALWAYSON === $stateName) {
    return DEFAULT_STATE_CONSENT_ALWAYSON;
  }
  return DEFAULT_CONSENT_STATE;
}

function save() {
  jsCookie.set(DEFAULT_CONSENTCOOKIE_NAME, consents.serialize(), { expires: DEFAULT_CONSENTCOOKIE_TTL });
}

function update($id, $flag) {
  if (consents.get($id)) {
    consents.get($id).flag = $flag;
  } else {
    consents.add(new Consent($id, $flag));
  }
  save();

  vue.$events.$emit('consent', {
    id: $id,
    state: getState($flag),
  });
}

function get($id) {
  if (!$id) {
    return consents;
  }
  return consents.get($id);
}

function getFlag($id) {
  return consents.get($id) ? consents.get($id).flag : null;
}

function isAccepted($id) {
  return getFlag($id) === DEFAULT_CONSENTCOOKIE_VAL_ACCEPTED;
}

function isRejected($id) {
  return getFlag($id) === DEFAULT_CONSENTCOOKIE_VAL_REJECTED;
}

function accept($id) {
  update($id, DEFAULT_CONSENTCOOKIE_VAL_ACCEPTED);
}

function reject($id) {
  update($id, DEFAULT_CONSENTCOOKIE_VAL_REJECTED);
}

function getState($flag) {
  switch ($flag) {
    case 0:
      return 'disabled';
    case 1:
      return 'enabled';
    default:
      return 'updated';
  }
}

module.exports = {
  init,
  load,
  update,
  get,
  getFlag,
  isAccepted,
  isRejected,
  accept,
  reject,
};
