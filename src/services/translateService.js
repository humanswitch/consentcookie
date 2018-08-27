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
import utils from 'base/utils';
import * as constants from 'base/constants';

const DEFAULT_LEGACY_LANGUAGE_PROPERTIES = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
const DEFAULT_I18N_PROPERTY_LOCALE = 'locale';
const DEFAULT_I18N_PROPERTY_FALLBACK_LOCALE = 'fallbackLocale';

const DEFAULT_AVAILABLE_LANGUAGES = [];

let vue;
let manualConfiguredLanguage;
let languageAliases;

function init(vueServices) {
  vue = vueServices.getVueInstance();
  vue.$set(vue.$i18n, DEFAULT_I18N_PROPERTY_LOCALE, getLanguage());
  vue.$set(vue.$i18n, DEFAULT_I18N_PROPERTY_FALLBACK_LOCALE, constants.DEFAULT_RESOURCE_LANGUAGE);
  vue.$events.on(constants.DEFAULT_EVENT_NAME_APP_CREATED, () => {
    initDefaultResources();
    initLanguage();
  });
}

function initDefaultResources() {
  DEFAULT_AVAILABLE_LANGUAGES.splice(0, DEFAULT_AVAILABLE_LANGUAGES.length);
  languageAliases = {};
  const resources = vue.$services.config.get('resources');
  _.each(resources, ($val, $key) => {
    if (addLanguage($key, $val)) {
      DEFAULT_AVAILABLE_LANGUAGES.push($key);
    } else if (_.isString(_.trim($val))) {
      languageAliases[$key] = $val;
    }
  });
}

function initLanguage() {
  vue.$set(vue.$i18n, DEFAULT_I18N_PROPERTY_LOCALE, getLanguage());
}

function addLanguage($lang, $resouce) {
  if (_.isEmpty(_.trim($lang)) || !(_.isObject($resouce))) {
    return false;
  }
  const merged = _.extendDeep(vue.$i18n.getLocaleMessage($lang), $resouce, ($target, $source) => {
    if ((_.isObject($source)) || !(_.isEmpty(_.trim($source)))) {
      return $source;
    }
    return undefined;
  });
  vue.$i18n.mergeLocaleMessage($lang, merged);
  return true;
}

function setLanguage($lang, $force) {
  manualConfiguredLanguage = $lang;
  if ($force === true || (DEFAULT_AVAILABLE_LANGUAGES.indexOf($lang) > -1)) {
    vue.$set(vue.$i18n, DEFAULT_I18N_PROPERTY_LOCALE, $lang);
  }
}

function getLanguage() {
  if (manualConfiguredLanguage && isLanguageAvailable(getAlias(manualConfiguredLanguage))) {
    return getAlias(manualConfiguredLanguage);
  }
  let selected = vue.$services.config.get(constants.CONFIG_KEY_GENERAL_LANGUAGE_DEFAULT, null);

  if (isLanguageAvailable(getAlias(selected))) {
    return getAlias(selected);
  }

  selected = getBrowserLanguage();

  if (isLanguageAvailable(getAlias(selected))) {
    return getAlias(selected);
  }

  selected = vue.$services.config.get(constants.CONFIG_KEY_GENERAL_LANGUAGE_FALLBACK, null);

  if (isLanguageAvailable(getAlias(selected))) {
    return getAlias(selected);
  }

  return constants.DEFAULT_RESOURCE_LANGUAGE;
}

function getAlias($language) {
  return (languageAliases && languageAliases[$language]) ? languageAliases[$language] : $language;
}

function isLanguageAvailable($language) {
  return !(_.isEmpty(_.trim($language))) && (DEFAULT_AVAILABLE_LANGUAGES.indexOf($language) > -1);
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
  addLanguage,
};
