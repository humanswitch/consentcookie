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
const jsCookies = require('js-cookie');

// Defaults
const DEFAULT_PLUGIN_PROTOTYPE_FUNCTIONS = ['deleteProfile', 'getId', 'getProfile',
  'getProfileId', 'getProfileIds', 'getProfileInfo', 'register'];

class Context {

  constructor($vue) {
    this.libs = {
      http: $vue.$http,
      cookie: jsCookies,
      _,
    };
  }

  getLib($id) {
    return this.libs[$id];
  }

}

const pluginCache = {};

let vue;

function isValid($plugin) {
  if (!(_.isObject($plugin))) {
    return false;
  }
  const functions = _.functions($plugin);

  for (let n = 0; n < functions.length; n += 1) {
    if (!(_.contains(DEFAULT_PLUGIN_PROTOTYPE_FUNCTIONS, functions[n]))) {
      return false;
    }
  }

  if (!(_.isString($plugin.getId())) || _.isEmpty($plugin.getId())) {
    return false;
  }
  return true;
}

function register($plugin) {
  if (!isValid($plugin)) {
    return;
  }

  $plugin.register(new Context(vue));
  pluginCache[$plugin.getId()] = $plugin;
}

function init(vueServices) {
  vue = vueServices.getVueInstance();
}

function createAsyncScriptTag($uniqueId, $path, $callback) {
  const scriptTag = window.document.createElement('script');
  scriptTag.id = $uniqueId;
  scriptTag.src = $path;
  scriptTag.async = 'true';
  scriptTag.addEventListener('load', function () {
    $callback(this);
  });
  return scriptTag;
}

function cleanupScriptTag($id) {
  const scriptTag = window.document.getElementById($id);
  if (scriptTag && scriptTag.remove) {
    // No support for IE. Its nice to have
    scriptTag.remove();
  }
}

function loadPlugin($id, $path) {
  return new Promise(($resolve, $reject) => {
    const uniqueId = ($id + '_' + new Date().getTime());
    const scriptElement = vue.$services.script.createScriptElement(uniqueId, $path, () => {
      // Check if plugin is registered
      const plugin = pluginCache[$id];

      if (!plugin) {
        return $reject(new Error('Unable to load plugin.'));
      } else if (plugin instanceof Error) {
        return $reject(plugin);
      }
      return $resolve(plugin);
    }, true);
    window.document.getElementsByTagName('head')[0].appendChild(scriptElement);
  });
}

function getPlugin($connection) {
  return new Promise(($resolve, $reject) => {
    if (!(_.isObject($connection))) {
      return $reject(new Error('No plugin available. Invalid connection'));
    }
    if (!(_.isString($connection.id))) {
      return $reject(new Error('No plugin available. Missing id.'));
    }
    if (!(_.isString($connection.plugin))) {
      return $reject(new Error('No plugin available. Missing path.'));
    }
    if (pluginCache[$connection.id]) {
      return $resolve(pluginCache[$connection.id]);
    }
    return loadPlugin($connection.id, $connection.plugin)
      .then($plugin => $resolve($plugin), $error => $reject($error));
  });
}

module.exports = {
  init,
  getPlugin,
  register,
};
