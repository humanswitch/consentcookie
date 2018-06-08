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

import VueI18n from 'vue-i18n';

import * as constants from 'base/constants.js';
import utils from 'base/utils.js';

function configI18n(vue) {

  vue.use(VueI18n);

  return new VueI18n({
    locale: constants.DEFAULT_RESOURCE_LANGUAGE, // set locale
    fallbackLocale: constants.DEFAULT_RESOURCE_LANGUAGE,
    messages: utils.getObjectValue(constants.DEFAULT_CONFIG,constants.CONFIG_KEY_RESOURCES,{}),
  });
}

export default configI18n;
