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

// Polyfils to support up from IE9 and up
require('mutationobserver-shim');
require('promise-polyfill');

// Static assets included in bundle
require('assets/fonts/fontello/css/fontello.css');
require('assets/scss/_icookie.scss');

// Defaults
const DEFAULT_INFO_LINK = 'https://www.consentcookie.nl/';
const DEFAULT_APP_NAME = 'ConsentCookie';

// Vue dependencies
const vue = require('vue');
const vueState = require('config/configState.js');
const vueRouter = require('config/configRouter.js');
const vueServices = require('config/configServices.js');
const vueResources = require('vue-resource');
const vueEvents = require('vue-events').default; // ES6 plugin workaround
const vueAsyncComputed = require('vue-async-computed');

// Helpers
const utils = require('base/utils');
const _ = require('mixins/underscore');

let mainInstance;

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
  const services = vueServices(vue);
  vue.use(vueResources);
  vue.use(vueEvents);
  vue.use(vueAsyncComputed);

  vue.directive('theme', require('directives/ccTheme.js'));

  vue.component('ic-switch', require('components/general/icSwitch.vue'));
  vue.component('ic-toggle-icon', require('components/general/icToggleIcon.vue'));

  const MainComponent = vue.extend(require('./views/main.vue'));
  mainInstance = new MainComponent({
    router,
    store,
    services,
    propsData: {
      config: $config,
    },
    created() {
      bootstrapApp.call(this);
    }
  });

  return onReady(() => {
    initBaseView();
    mainInstance.$mount('#ConsentCookie');
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
  if (!mainInstance) {
    return utils.logErrorOrThrowException('Unable to unregister event. ConsentCookie is not yet initialized.');
  }
  return mainInstance.off($event, $callback);
}

function on($event, $callback) {
  if (!mainInstance) {
    return utils.logErrorOrThrowException('Unable to register event. ConsentCookie is not yet initialized.');
  }
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
    return getConsents();
  }
  return getConsent($id);
}

function getConsent($id) {
  return mainInstance.$services.consent.getConsent($id);
}

function getConsents() {
  return mainInstance.$services.consent.getConsents();
}


function registerPlugin($plugin) {
  if (!mainInstance) {
    return utils.logErrorOrThrowException('Unable to register plugin. ConsentCookie is not yet initialized.');
  }
  return mainInstance.$services.plugin.register($plugin);
}

module.exports = (function () {
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
    ver: VERSION,
  };
}());
