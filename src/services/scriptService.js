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

// Depencencies
const utils = require('base/utils.js');
const _ = require('underscore');

// Defaults
const SCRIPT_ELEMENT_ATTRIBUTE_CC_ID = 'cc-id';
const SCRIPT_ELEMENT_ATTRIBUTE_CC_UUID = 'cc-uuid';

const window = global || null;
const executed = [];

let vue;

function init($vueServices) {
  vue = $vueServices.getVueInstance();
}

function findConsentScriptFilter($element, $consentId) {
  if (!($element instanceof Element) || !$consentId) {
    return false;
  }
  const ccId = $element.getAttribute(SCRIPT_ELEMENT_ATTRIBUTE_CC_ID);

  if (_.isEmpty(_.trim(ccId))) {
    return false;
  }

  if (_.isString($consentId)) {
    return $consentId === ccId;
  }
  if (_.isArray($consentId)) {
    return _.contains($consentId, ccId);
  }
  return false;
}

function getScriptElements($consentId) {
  return utils.getElementsByTagName('script', $element => findConsentScriptFilter($element, $consentId));
}

function enableScript($element) {
  if (executed.indexOf($element.getAttribute(SCRIPT_ELEMENT_ATTRIBUTE_CC_UUID)) >= 0) {
    return;
  }
  if (!(_.isEmpty($element.getAttribute('src')))) {
    loadScript($element);
  } else {
    executeScript($element);
  }
}

function loadScript($element) {
  const scriptElement = createScriptElement(utils.uuidv4(), $element.src, null, true);
  window.document.getElementsByTagName('head')[0].appendChild(scriptElement);
  setScriptExecuted($element);
}

function executeScript($element) {
  const script = (_.isString($element.innerHTML) && !(_.isEmpty($element.innerHTML.trim()))) ? $element.innerHTML.trim() : '';
  try {
    (window.execScript || function ($script) {
      window['eval'].call(window, $script);
    })(script);
  } catch ($e) {
    console.error($e);
  }
  setScriptExecuted($element);
}

function setScriptExecuted($element) {
  const uuid = utils.uuidv4();
  $element.setAttribute(SCRIPT_ELEMENT_ATTRIBUTE_CC_UUID, uuid);
  executed.push(uuid);
}

function cleanupScriptElement($id) {
  const scriptTag = window.document.getElementById($id);
  if (scriptTag && scriptTag.remove) {
    // No support for IE. Its nice to have
    scriptTag.remove();
  }
}

function enableScripts($consentId) {
  const consentScriptElements = getScriptElements($consentId);
  consentScriptElements.forEach($element => {
    enableScript($element);
  });
}

function enableOptOutScripts() {
  const optOutConsentIds = _.map(vue.$services.consent.getConsents()
    .getAccepted(), ($consent) => $consent.id);
  enableScripts(optOutConsentIds);
}

function enableAlwaysOnScripts() {
  const alwaysOnConsentIds = _.map(vue.$services.consent.getConsents()
    .getAlwaysOn(), ($consent) => $consent.id);
  enableScripts(alwaysOnConsentIds);
}

function enableEnabledScripts() {
  enableAlwaysOnScripts();
  if (vue.$services.main.isConsentWallEnabled() && vue.$services.main.isConsentWallAccepted()) {
    enableOptOutScripts();
  }
}

function createScriptElement($uniqueId, $path, $callback, $async) {
  const self = this;
  const scriptTag = window.document.createElement('script');
  scriptTag.id = $uniqueId;
  scriptTag.src = $path;
  if ($async === true) {
    scriptTag.async = 'true';
  }
  scriptTag.addEventListener('load', ($event) => {
    cleanupScriptElement($uniqueId);
    if (_.isFunction($callback)) {
      $callback.call(self);
    }
  });
  return scriptTag;
}

module.exports = {
  init,
  enableScripts,
  enableOptOutScripts,
  enableAlwaysOnScripts,
  enableEnabledScripts,
  createScriptElement,
};
