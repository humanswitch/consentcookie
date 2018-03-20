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
 * @return {Store<any>}
 */
function configState(vue) {
  // Dependencies
  const _ = require('underscore');
  const Vuex = require('vuex');
  const VuexPersistedState = require('vuex-persistedstate');

  // Defaults
  // Config which paths to persist automatically
  const pathsToPersist = [
    'application.state.lastPath',
    'settings',
  ];

  const vuexPlugins = [
    VuexPersistedState({
      key: 'consentcookie',
      paths: pathsToPersist,
    }),
  ];

  vue.use(Vuex);

  // Init the Vuex Store with the default config
  return new Vuex.Store({
    plugins: vuexPlugins,
    state: {
      view: {
        title: '',
        content: {
          size: null,
        },
        isPhone: false,
        isPortrait: false,
      },
      application: {
        state: {
          lastPath: null,
          menuActive: false,
          menuOpen: false,
          contentActive: false,
          contentOpen: false,
        },
      },
    },
    mutations: {
      // Based on payload property a different value is updated
      updateView: ($state, $payload) => {
        if (!_.isObject($payload)) {
          return;
        }

        // View update
        $state.view.title = _.isString($payload.title) ?
          $payload.title : $state.view.title;

        // View update
        $state.view.isPhone = _.isBoolean($payload.isPhone) ? $payload.isPhone : $state.view.isPhone;
        $state.view.isPortrait = _.isBoolean($payload.isPortrait) ? $payload.isPortrait : $state.view.isPortrait;

        // View Content update
        $state.view.content.size = _.isObject($payload.content) && _.isNumber($payload.content.size) ?
          $payload.content.size : $state.view.content.size;
      },
      // Based on payload property a different value is updated
      updateApplication: ($state, $payload) => {
        if (!_.isObject($payload)) {
          return;
        }
        const applicationState = $state.application.state;
        applicationState.lastPath = _.isObject($payload.lastPath) ?
          $payload.lastPath : applicationState.lastPath;
        applicationState.menuActive = _.isBoolean($payload.menuActive) ?
          $payload.menuActive : applicationState.menuActive;
        applicationState.menuOpen = _.isBoolean($payload.menuOpen) ?
          $payload.menuOpen : applicationState.menuOpen;
        applicationState.contentOpen = _.isBoolean($payload.contentOpen) ?
          $payload.contentOpen : applicationState.contentOpen;
        applicationState.contentActive = _.isBoolean($payload.contentActive) ?
          $payload.contentActive : applicationState.contentActive;
      },
      toggleView: ($state) => {
        $state.application.state.isOpen = !$state.application.state.isOpen;
      },
    },
  });
}

module.exports = configState;
