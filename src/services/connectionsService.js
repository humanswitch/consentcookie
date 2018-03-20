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

const connectionsDef = require('assets/json/trackers.json');

let vue;
let connections;
let connectionsMap;

function init(vueServices) {
  vue = vueServices.getVueInstance();
  loadConnections();
}

function loadConnections() {
  connections = connectionsDef;
  connectionsMap = {};

  _.each(connections, ($connection) => {
    connectionsMap[$connection.id] = $connection;
  });
}

function getPlugin($connection) {
  return vue.$services.plugin.getPlugin($connection);
}

function getActive() {
  const consents = vue.$services.consent.get();
  const activeConnections = [];

  _.each(consents.consents, ($consent) => {
    const connection = connectionsMap[$consent.id];

    if (connection) {
      activeConnections.push(connection);
    }
  });
  return activeConnections;
}

module.exports = {
  init,
  getPlugin,
  getActive,
};
