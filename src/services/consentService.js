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

const DEFAULT_STATE_CONSENT_OPTIN = 0;
const DEFAULT_STATE_CONSENT_OPTOUT = 1;
const DEFAULT_STATE_CONSENT_ALWAYSON = -1;

const DEFAULT_CONSENT_STATE_LABEL_OPTIN = 'optin';
const DEFAULT_CONSENT_STATE_LABEL_OPTOUT = 'optout';
const DEFAULT_CONSENT_STATE_LABEL_ALWAYSON = 'alwayson';

const DEFAULT_CONSENT_STATE = DEFAULT_STATE_CONSENT_ALWAYSON;

const DEFAULT_CONFIG_KEY_APPS_CONSENT = 'apps.consent';

class Consents {

  constructor($consents) {
    this.consents = $consents || {};
  }

  get($id) {
    return this.consents[$id] ? this.consents[$id] : null;
  }

  add($consent) {
    this.consents[$consent.id] = $consent;
  }

  serialize() {
    const serialized = _.map(_.values(this.consents), $consent => $consent.serialize());
    return serialized.join(DEFAULT_CONSENTS_SEPERATOR);
  }

  static parse($val) {
    const consents = new Consents();

    if (typeof $val !== 'string') {
      return consents;
    }

    const $parsed = $val.split(DEFAULT_CONSENTS_SEPERATOR);

    if (_.isEmpty($parsed)) {
      return consents;
    }

    _.each($parsed, ($parsedPart) => {
      const consent = Consent.parse($parsedPart);
      if (consent) {
        consents.add(consent);
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

  static parse($val) {
    if (!(_.isString($val))) {
      return null;
    }
    const parsed = $val.split(DEFAULT_CONSENT_SEPERATOR);
    if (_.isString(parsed[0]) && !(_.isNaN(Number(parsed[1])))) {
      return new Consent(parsed[0], Number(parsed[1]));
    }
    return null;
  }

}

let vue;
let consents;

function init(vueServices) {
  vue = vueServices.getVueInstance();
}

function load() {
  const connectionsConfig = _.clone(vue.$services.config.get(DEFAULT_CONFIG_KEY_APPS_CONSENT));
  const consentCookie = jsCookie.get(DEFAULT_CONSENTCOOKIE_NAME);

  consents = Consents.parse(consentCookie);

  _.each(connectionsConfig, ($connectionConfig, $connectionId) => {
    const curConsent = consents.get($connectionId);
    const initState = getInitState($connectionConfig.initstate);

    if (curConsent === null) {
      update($connectionId, initState);
    } else if (DEFAULT_STATE_CONSENT_ALWAYSON === initState) {
      // New settings is, no optin or optout. Override setting
      update($connectionId, initState);
    } else if (DEFAULT_STATE_CONSENT_ALWAYSON !== initState
      && curConsent.flag === DEFAULT_STATE_CONSENT_ALWAYSON) {
      // New setting is optin or optout and old was mandatory
      update($connectionId, initState);
    }
  });
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

  vue.$events.$emit('connection', {
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
