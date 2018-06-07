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

import VueServices from 'plugins/vueServices.js';

import mainService from 'services/mainService';
import configService from 'services/configService';
import viewService from 'services/viewService';
import consentService from 'services/consentService';
import applicationsService from 'services/applicationsService';
import pluginService from 'services/pluginService';
import scriptService from 'services/scriptService';

/**
 *
 * @param vue
 */
function configVueServices(vue) {
  // Dependencies

  // Init service loader
  vue.use(VueServices);

// Init the service
// Make sure to define the services in order of dependecy
// If a service depends on another, define it later in the order.
  const services = [{
    name: 'main',
    service: mainService,
  }, {
    name: 'config',
    service: configService,
  }, {
    name: 'view',
    service: viewService,
  }, {
    name: 'consent',
    service: consentService,
  }, {
    name: 'applications',
    service: applicationsService,
  }, {
    name: 'plugin',
    service: pluginService,
  }, {
    name: 'script',
    service: scriptService,
  }];

  return new VueServices(services);
}

export default configVueServices;
