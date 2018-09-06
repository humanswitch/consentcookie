/*
 * Copyright 2018 Asknow Solutions B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless export defaultd by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Polyfils to support up from IE9 and up
import mutationObserverShim from 'mutationobserver-shim';
import promisePolyfill from 'promise-polyfill';

import icons from 'assets/fonts/fontello/css/fontello.css';
import css from 'assets/scss/_consentcookie.scss';

// Vue Framework
import vue from 'vue';
import vueState from 'config/configState';
import vueRouter from 'config/configRouter';
import vueServices from 'config/configServices';
import vueI18n from 'config/configI18n';
import vueResources from 'vue-resource';
import vueEvents from 'vue-events';
import vueAsyncComputed from 'vue-async-computed';

import _ from 'mixins/underscore';
import utils from 'base/utils';
import * as constants from 'base/constants';

// Default Directives
import ccTheme from 'directives/ccTheme';

// Views
import mainView from 'views/main';

// Defaults
const DEFAULT_INFO_LINK = 'https://www.consentcookie.nl/';
const DEFAULT_APP_NAME = 'ConsentCookie';

// Instance variables
let mainInstance;

function validate() {
  if (!mainInstance) {
    return utils.logErrorOrThrowException('ConsentCookie is not yet initialized. Call failed.');
  }
  return true;
}

function init($config) {
  if (typeof $config !== 'object') {
    return utils.logErrorOrThrowException('Unable to initialize ConsentCookie.' +
      'Missing required config for initialization. Visit: ' + DEFAULT_INFO_LINK + ' for more information.');
  } else if (mainInstance) {
    return utils.logErrorOrThrowException('Unable to initialize ConsentCookie.' +
      'ConsentCookie already initialized. Visit: ' + DEFAULT_INFO_LINK + ' for more information.');
  }
  return initVue($config);
}

function initBaseView() {
  const ConsentCookie = document.createElement('div');
  ConsentCookie.id = 'ConsentCookie';
  ConsentCookie.className = 'ConsentCookie';
  document.body.appendChild(ConsentCookie);
}

function initVue($config) {
  const store = vueState(vue);
  const router = vueRouter(vue);
  const i18n = vueI18n(vue);
  const services = vueServices(vue);
  vue.use(vueResources);
  vue.use(vueEvents);
  vue.use(vueAsyncComputed);

  vue.directive('theme', ccTheme);

  const MainComponent = vue.extend(mainView);
  mainInstance = new MainComponent({
    router,
    store,
    i18n,
    services,
    propsData: {
      config: $config,
    },
    created() {
      bootstrapApp.call(this);
    },
  });
  setTimeout(() => mainInstance.$events.$emit(constants.DEFAULT_EVENT_NAME_APP_CREATED), 0);

  return onReady(() => {
    initBaseView();
    mainInstance.$mount('#ConsentCookie');
    setTimeout(() => mainInstance.$events.$emit(constants.DEFAULT_EVENT_NAME_APP_MOUNTED), 0);
  });
}

function onReady($fn) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    $fn();
  } else {
    document.addEventListener('DOMContentLoaded', $fn);
  }
}

function bootstrapApp() {
  this.$services.config.load(this.config);
  this.$services.consent.load();
  this.$services.script.enableEnabledScripts();
  enableScriptsOnReady.call(this);
}

function enableScriptsOnReady() {
  onReady(() => this.$services.script.enableEnabledScripts());
}

function off($event, $callback) {
  validate();
  return mainInstance.$events.$off($event, $callback);
}

function on($event, $callback) {
  validate();
  return mainInstance.$events.$on($event, $callback);
}

/**
 * @deprecated
 *
 * @param $id
 * @return {*}
 */
function get($id) {
  if (!$id) {
    // Backwards compatibility fix
    return (($consents) => {
      // eslint-disable-next-line no-param-reassign
      $consents.consents = $consents.getConsentMap();
      return $consents;
    })(getConsents());
  }
  return getConsent($id);
}

function getConsent($id) {
  validate();
  return mainInstance.$services.consent.getConsent($id);
}

function getConsents() {
  validate();
  return mainInstance.$services.consent.getConsents();
}

function registerPlugin($plugin) {
  validate();
  return mainInstance.$services.plugin.register($plugin);
}

function setLanguage($lang, $force) {
  validate();
  return mainInstance.$services.translate.setLanguage($lang, $force);
}

function addLanguage($lang, $resource) {
  validate();
  return mainInstance.$services.translate.addLanguage($lang, $resource);
}

export default (function () {
  if (global[DEFAULT_APP_NAME]) {
    const error = new Error('Unable to initialize ConsentCookie. ConsentCookie already initialized. ' +
      'Check if the you have not included the library twice.');
    error.stack = null; // We don`t need the stack. Its only confusing
    throw error;
  }

  return {
    init,
    on,
    off,
    get,
    getConsent,
    getConsents,
    registerPlugin,
    setLanguage,
    addLanguage,
    // eslint-disable-next-line no-undef
    ver: VERSION,
  };
}());
