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

/**
 * The main applications service. One to rule them all!
 */
const DEFAULT_CONSENTCOOKIE_ID_CONSENTWALL = 'ccw';
const DEFAULT_CONFIG_CONSENTWALL_ENABLED = 'general.consentwall.enabled';
const DEFAULT_CONFIG_CONSENTWALL_TIMEOUT = 'general.consentwall.timeout';

const DEFAULT_CONFIG_TIMEOUT_CONSENTWALL = 300; // ms

let vueInstance;

function init(vueServices) {
  vueInstance = vueServices.getVueInstance();
}

function showConsentWall() {
  // Show consent after 300ms
  setTimeout(() => {
    vueInstance.$router.push({ path: '/consent' });
    vueInstance.$services.view.openContent();
  }, vueInstance.$services.config.get(DEFAULT_CONFIG_CONSENTWALL_TIMEOUT, DEFAULT_CONFIG_TIMEOUT_CONSENTWALL));
}

function acceptConsentWall() {
  vueInstance.$services.consent.accept(DEFAULT_CONSENTCOOKIE_ID_CONSENTWALL);
  vueInstance.$services.view.close();
  vueInstance.$services.view.enableMenu();
}

function isConsentWallEnabled() {
  return vueInstance.$services.config.get(DEFAULT_CONFIG_CONSENTWALL_ENABLED, false);
}

function isConsentWallAccepted() {
  return !(isConsentWallEnabled()) ||
    (vueInstance.$services.consent.getFlag(DEFAULT_CONSENTCOOKIE_ID_CONSENTWALL) === 1);
}

module.exports = {
  init,
  showConsentWall,
  acceptConsentWall,
  isConsentWallAccepted,
};
