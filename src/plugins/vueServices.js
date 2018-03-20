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
 * vue-services
 * (c) 2017 Steven Choo
 *
 * Create your own plugin: https://alligator.io/vuejs/creating-custom-plugins/
 */

// eslint default override, vue common practise above airbnb
/* eslint no-underscore-dangle: 0 */

// Dependencies
const _ = require('underscore');

let Vue; // bind on install
let services;

function install($Vue) {
  if (Vue && $Vue === Vue) {
    return;
  }
  Vue = $Vue;

  const vueVersion = Number(Vue.version.split('.')[0]);

  if (vueVersion >= 2) {
    Vue.mixin({ beforeCreate: init });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const [_init] = Vue.prototype;
    Vue.prototype._init = function ($options) {
      const options = {
        init: ($options && $options.init) ? [init].concat($options.init) : init,
      };
      _init.call(this, options);
    };
  }
}

function init() {
  const options = this.$options;

  if (this.$services) {
    throw new Error('Services already intialized');
  }

  // services injection
  if (options.services) {
    this.$services = options.services;
    this.$services.init(this);
  } else if (options.parent && options.parent.$services) {
    this.$services = options.parent.$services;
  }
}

/**
 * Vue-Services class
 *
 * @param $services
 * @constructor
 */
class VueServices {

  constructor($services) {
    services = $services;
  }

  init($vueInstance) {
    if (!services || !(_.isArray(services))) {
      throw new Error('Unable to init vue-services. ' +
        'Make sure to properly init the vue-services instance with an array containing the to be loaded services.');
    }

    const vueServices = this;
    vueServices._vm = vueServices._vm || $vueInstance;

    const servicesToInit = [];

    _.each(services, function ($service) {
      if (!$service) {
        console.warn('Unable to init the service. No service defined.');
      } else if (typeof $service.name !== 'string' || typeof $service.service !== 'object') {
        console.warn('Unable to init the service: ' + ($service.name || 'null') +
          '. Make sure it is of the proper format {name:\'\',service:{}}.');
      } else if (typeof $service.service.init !== 'function') {
        console.warn('Unable to init the service: ' + $service.name + '. Service is missing init function. ');
      } else if (this[$service.name]) {
        console.warn('Unable to init the service: ' + ($service.name || 'null') + '.'
          + ' Its already been init. Make sure your not loading twice the same service');
      } else {
        vueServices[$service.name] = $service.service;
        servicesToInit.push($service.name);
      }
    });

    // We call the init from a 2e iteration so that the services can call the base functions of eachother
    _.each(servicesToInit, ($name) => {
      vueServices[$name].init(vueServices);
    });
  }

  getVueInstance() {
    return this._vm;
  }

}

VueServices.install = install;

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueServices);
}

module.exports = VueServices;
