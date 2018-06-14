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
 * Translate service for handling i18n business
 */
import _ from 'underscore';
import utils from 'base/utils.js';
import * as constants from 'base/constants';

const DEFAULT_LEGACY_LANGUAGE_PROPERTIES = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];

let vue;
let configuredLanguage;

function init(vueServices) {
  vue = vueServices.getVueInstance();
  vue.$i18n.locale = getLanguage();
  vue.$events.on(constants.DEFAULT_EVENT_NAME_APP_CREATED, () => initDefaultResources());
}

function initDefaultResources() {
  const resources = vue.$services.config.get('resources');
  _.each(resources, ($val, $key) => {
    const merged = _.extendDeep(vue.$i18n.getLocaleMessage($key), $val, ($target, $source) => {
      if ((_.isObject($source)) || !(_.isEmpty(_.trim($source)))) {
        return $source;
      }
      return undefined;
    });
    vue.$i18n.mergeLocaleMessage($key, merged);
  });
}

function setLanguage($lang) {
  configuredLanguage = $lang;
  vue.$i18n.locale = $lang;
}

function getLanguage() {
  if (configuredLanguage) {
    return configuredLanguage;
  }
  return getBrowserLanguage() || constants.DEFAULT_RESOURCE_LANGUAGE;
}

function getBrowserLanguage() {
  if (!window || !window.navigator) {
    return null;
  }
  const navLanguages = utils.getObjectValue(window, 'navigator.languages');
  if (!(_.isEmpty(navLanguages))) {
    return navLanguages[0];
  }
  for (let i = 0; i < DEFAULT_LEGACY_LANGUAGE_PROPERTIES.length; i++) {
    const language = window.navigator[DEFAULT_LEGACY_LANGUAGE_PROPERTIES[i]];
    if (language && language.length) {
      return language;
    }
  }
  return null;
}

export default {
  init,
  setLanguage,
  getLanguage,
};
