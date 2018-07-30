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
import jsCookie from 'js-cookie';
import _ from 'underscore';
import * as constants from 'base/constants';

class Consents {

  constructor($ccCookies) {
    const consents = {};

    this.getCookieValues = function () {
      return _.clone($ccCookies);
    };
    this.get = function ($id) {
      return _.isString($id) ? consents[$id] : _.values(consents);
    };
    this.getConsentMap = function () {
      return consents;
    };
  }

  getAccepted() {
    return _.filter(this.get(), ($consent => $consent.isAccepted()));
  }

  getAlwaysOn() {
    return _.filter(this.get(), ($consent => $consent.isAlwaysOn()));
  }

  add($consent) {
    if ($consent instanceof Consent) {
      this.getConsentMap()[$consent.id] = $consent;
    }
  }

  serialize() {
    const toSerialize = _.clone(this.getConsentMap());
    // Add all `stale` consents so that we aren`t overriding values
    _.each(this.getCookieValues(), ($ccAppValue, $ccAppId) => {
      if (!toSerialize[$ccAppId]) {
        toSerialize[$ccAppId] = new Consent($ccAppId, $ccAppValue);
      }
    });
    const serialized = _.map(_.values(toSerialize), $consent => $consent.serialize());
    return serialized.join(constants.DEFAULT_CONSENTS_SEPERATOR);
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
    return this.id + constants.DEFAULT_CONSENT_SEPERATOR + this.flag;
  }

  isAccepted() {
    return this.flag === constants.DEFAULT_CONSENTCOOKIE_COOKIE_VAL_ACCEPTED;
  }

  isRejected() {
    return this.flag === constants.DEFAULT_CONSENTCOOKIE_COOKIE_VAL_REJECTED;
  }

  isAlwaysOn() {
    return this.flag === constants.DEFAULT_CONSENTCOOKIE_COOKIE_VAL_ALWAYSON;
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
  } else if (constants.DEFAULT_CONSENT_INIT_STATE_ALWAYSON === $ccAppInitState) {
    // New settings is, no optin or optout. Override setting
    $ccCookieConsentVal = $ccAppInitState;
  } else if (constants.DEFAULT_CONSENT_INIT_STATE_ALWAYSON !== $ccAppInitState
    && $ccCookieConsentVal === constants.DEFAULT_CONSENT_INIT_STATE_ALWAYSON) {
    // New setting is optin or optout and old was mandatory
    $ccCookieConsentVal = $ccAppInitState;
  }
  return $ccCookieConsentVal;
}

function getCCCookieMap() {
  const ccCookie = jsCookie.get(constants.DEFAULT_CONSENTCOOKIE_COOKIE_NAME) || '';
  const map = _.reduce(ccCookie.split(constants.DEFAULT_CONSENTS_SEPERATOR), ($memo, $ccCookieVal) => {
    if (!(_.isString($ccCookieVal))) {
      return $memo;
    }

    const parsed = $ccCookieVal.split(constants.DEFAULT_CONSENT_SEPERATOR);
    if (_.isString(parsed[0]) && !(_.isNaN(Number(parsed[1])))) {
      $memo[parsed[0]] = Number(parsed[1]);
    }
    return $memo;
  }, {});
  return map;
}

function getCCApps() {
  const configuredApps = _.clone(vue.$services.config.get(constants.CONFIG_KEY_APPS_CONSENT));
  if (vue.$services.main.isConsentWallEnabled()) {
    configuredApps[constants.DEFAULT_CONSENTWALL_COOKIE_ID] = { initstate: constants.DEFAULT_CONSENT_STATE_LABEL_OPTIN };
  }
  return configuredApps;
}

function getInitState($stateName) {
  if (constants.DEFAULT_CONSENT_STATE_LABEL_OPTIN === $stateName) {
    return constants.DEFAULT_CONSENT_INIT_STATE_OPTIN;
  }
  if (constants.DEFAULT_CONSENT_STATE_LABEL_OPTOUT === $stateName) {
    return constants.DEFAULT_CONSENT_INIT_STATE_OPTOUT;
  }
  if (constants.DEFAULT_CONSENT_STATE_LABEL_ALWAYSON === $stateName) {
    return constants.DEFAULT_CONSENT_INIT_STATE_ALWAYSON;
  }
  return constants.DEFAULT_CONSENT_INIT_STATE;
}

function save() {
  jsCookie.set(constants.DEFAULT_CONSENTCOOKIE_COOKIE_NAME, consents.serialize(), { expires: constants.DEFAULT_CONSENTCOOKIE_COOKIE_TTL });
}

function load() {
  const ccCookieMap = getCCCookieMap();
  const ccApps = getCCApps();
  consents = Consents.create(ccApps, ccCookieMap);
  if (vue.$services.main.isConsentWallAccepted()) {
    save();
  }
}

function update($id, $flag) {
  if (consents.get($id)) {
    consents.get($id).flag = $flag;
  } else {
    consents.add(new Consent($id, $flag));
  }
  save();

  vue.$events.$emit(constants.DEFAULT_EVENT_NAME_CONSENT, {
    id: $id,
    state: getState($flag),
  });
}

function getConsent($id) {
  return consents.get($id) || new Consent($id, null);
}

function getConsents() {
  return consents;
}

function getFlag($id) {
  return consents.get($id).flag;
}

function isAccepted($id) {
  return getFlag($id) === constants.DEFAULT_CONSENTCOOKIE_COOKIE_VAL_ACCEPTED;
}

function isRejected($id) {
  return getFlag($id) === constants.DEFAULT_CONSENTCOOKIE_COOKIE_VAL_REJECTED;
}

function accept($id) {
  update($id, constants.DEFAULT_CONSENTCOOKIE_COOKIE_VAL_ACCEPTED);
  vue.$services.script.enableScripts($id);
}

function reject($id) {
  update($id, constants.DEFAULT_CONSENTCOOKIE_COOKIE_VAL_REJECTED);
}

function getState($flag) {
  switch ($flag) {
    case 0:
      return constants.DEFAULT_EVENT_CONSENT_STATE_VAL_REJECTED;
    case 1:
      return constants.DEFAULT_EVENT_CONSENT_STATE_VAL_ACCEPTED;
    default:
      return constants.DEFAULT_EVENT_CONSENT_STATE_DEFAULT;
  }
}

export default {
  init,
  load,
  save,
  update,
  getConsent,
  getConsents,
  getFlag,
  isAccepted,
  isRejected,
  accept,
  reject,
};
