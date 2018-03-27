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


const DEFAULT_APPS_ENDPOINT = 'https://www.consentcookie.nl/consentcookie/latest/consentcookie.json';
const DEFAULT_CONFIG_KEY_APPS_ENDPOINT = 'apps.endpoint';

let vue;
let connections;
let activeConnections;

function init(vueServices) {
  vue = vueServices.getVueInstance();
}

function loadConnections() {
  if (!connections) {
    const connectionsUrl = vue.$services.config.get(DEFAULT_CONFIG_KEY_APPS_ENDPOINT, DEFAULT_APPS_ENDPOINT);
    connections = vue.$http.get(connectionsUrl)
      .then($connection => ($connection.status === 200 ? $connection.body : []));
  }
  return connections;
}

function getPlugin($connection) {
  return vue.$services.plugin.getPlugin($connection);
}

function getActive() {
  if (!activeConnections) {
    activeConnections = loadConnections().then(($connections) => {
      const consents = vue.$services.consent.get();
      const active = [];
      const map = _.reduce($connections, ($memo, $connection) => {
        $memo[$connection.id] = $connection;
        return $memo;
      }, {});

      _.each(consents.consents, ($consent) => {
        const connection = map[$consent.id];

        if (connection) {
          active.push(connection);
        }
      });
      return active;
    });
  }
  return activeConnections;
}

module.exports = {
  init,
  getPlugin,
  getActive,
};
