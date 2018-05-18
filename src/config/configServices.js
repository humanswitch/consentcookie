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
 *
 * @param vue
 */
function configVueServices(vue) {
  // Dependencies
  const VueServices = require('plugins/vueServices.js');

  // Init service loader
  vue.use(VueServices);

  // Init the service
  // Make sure to define the services in order of dependecy
  // If a service depends on another, define it later in the order.
  const services = [{
    name: 'main',
    service: require('services/mainService.js'),
  }, {
    name: 'config',
    service: require('services/configService.js'),
  }, {
    name: 'view',
    service: require('services/viewService.js'),
  }, {
    name: 'consent',
    service: require('services/consentService.js'),
  }, {
    name: 'applications',
    service: require('services/applicationsService.js'),
  }, {
    name: 'plugin',
    service: require('services/pluginService.js'),
  }, {
    name: 'script',
    service: require('services/scriptService.js'),
  }];

  return new VueServices(services);
}

module.exports = configVueServices;
