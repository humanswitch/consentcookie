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
import _ from 'underscore';
import jsCookies from 'js-cookie';

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

function loadPlugin($id, $src) {
  return new Promise(($resolve, $reject) => {
    const uniqueId = ($id + '_' + new Date().getTime());
    const scriptElement = vue.$services.script.createScriptElement(uniqueId, $src, () => {
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

function getPlugin($application) {
  return new Promise(($resolve, $reject) => {
    if (!(_.isObject($application))) {
      return $reject(new Error('No plugin available. Invalid application'));
    }
    if (!(_.isString($application.id))) {
      return $reject(new Error('No plugin available. Missing id.'));
    }
    const pluginSrc = vue.$services.applications.getPluginSrc($application);
    if (_.isEmpty(_.trim(pluginSrc))) {
      return $reject(new Error('No plugin available. Missing plugin src.'));
    }
    if (pluginCache[$application.id]) {
      return $resolve(pluginCache[$application.id]);
    }
    return loadPlugin($application.id, pluginSrc)
      .then($plugin => $resolve($plugin), $error => $reject($error));
  });
}

export default {
  init,
  getPlugin,
  register,
};
