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

import _ from 'underscore';
import * as constants from 'base/constants';

// Defaults
const DEFAULT_EVENT_WINDOW_RESIZE = 'windowResize';
const DEFAULT_EVENT_CONTENT_OPENED = 'contentOpened';
const DEFAULT_MAX_PHONE_WIDTH_PORTRAIT = 480;
const DEFAULT_MAX_PHONE_HEIGHT_LANDSCAPE = 480;

const window = global || null;

let vue;

function init($vueServices) {
  vue = $vueServices.getVueInstance();

  initRouteListener();
  initResizeListener();
  initInitialViewState();
  initEventListeners();
}

function initInitialViewState() {
  updateViewState();
}

function initRouteListener() {
  vue.$router.afterEach(($to) => {
    const isValidTo = ($to && $to.matched && $to.matched.length > 0);

    // No valid route
    if (!isValidTo) {
      return false;
    }

    // Open the content if it`s not opened yet, consent is accepted and its a valid route
    if (isValidTo && vue.$services.main.isConsentWallAccepted() && !(vue.$store.state.application.state.contentOpen)) {
      vue.$services.view.openContent();
    }
    return true;
  });
}

function initResizeListener() {
  if (!window || !window.addEventListener) {
    throw new Error('Expected to be running in a browser.');
  }

  window.addEventListener('resize', () => {
    const windowDimension = {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      outerHeight: window.outerHeight,
      outerWidth: window.outerWidth,
    };

    updateViewState();

    // Notify of change
    vue.$emit(DEFAULT_EVENT_WINDOW_RESIZE, windowDimension);
  });
}

function initEventListeners() {
  vue.$events.$on(constants.DEFAULT_EVENT_NAME_APP_OPENVIEW, ($payload) => {
    if ($payload && _.isString($payload.name)) {
      vue.$router.push($payload.name);
    }
  });
}

function updateViewState() {
  // Update the view state
  const width = getWindowWidth();
  const height = getWindowHeight();

  const isPhone = isPhoneMode(width, height);
  const isPortrait = isPortraitMode(width, height);

  let stateUpdate = null;

  // Optimise the updating of the state, to only update when its changed
  if (vue.$store.state.view.isPhone !== isPhone) {
    stateUpdate = stateUpdate || {};
    stateUpdate.isPhone = isPhone;
  }
  if (vue.$store.state.view.isPortrait !== isPortrait) {
    stateUpdate = stateUpdate || {};
    stateUpdate.isPortrait = isPortrait;
  }
  if (stateUpdate) {
    notifyViewChanged(stateUpdate);
  }
}

function getWindowHeight() {
  return window ? window.outerHeight : null;
}

function getWindowWidth() {
  return window ? window.outerWidth : null;
}

function getPosition() {
  return vue.$services.config.get(constants.CONFIG_KEY_DESIGN_LAYOUT_POSITION, null);
}

function getColorPrimary() {
  return vue.$services.config.get(constants.CONFIG_KEY_DESIGN_COLORSCHEME_PRIMARY, null);
}

function getColorSecondary() {
  return vue.$services.config.get(constants.CONFIG_KEY_DESIGN_COLORSCHEME_SECONDARY, null);
}

function isPhoneMode($width, $height) {
  if (typeof $width !== 'number' || typeof $height !== 'number') {
    return false;
  }

  const isPortrait = isPortraitMode($width, $height);
  return isPortrait ? ($width <= DEFAULT_MAX_PHONE_WIDTH_PORTRAIT) : ($height <= DEFAULT_MAX_PHONE_HEIGHT_LANDSCAPE);
}

function isPortraitMode($width, $height) {
  if (typeof $width !== 'number' || typeof $height !== 'number') {
    return false;
  }
  return $height > $width;
}

function show($showContent, $showMenu) {
  vue.$store.commit('updateApplication', {
    contentOpen: $showContent,
    menuOpen: $showMenu,
  });

  if ($showContent === true) {
    vue.$emit(DEFAULT_EVENT_CONTENT_OPENED);
  }
}

function enable($enableContent, $enableMenu) {
  vue.$store.commit('updateApplication', {
    contentActive: $enableContent,
    menuActive: $enableMenu,
  });
}

function toggleMenu() {
  const isOpen = (vue.$store.state.application.state.menuOpen === true);
  const isContentActive = (vue.$store.state.application.state.contentActive === true);

  // Close the content also when we have open content and we are closing the menu
  // Open the content when a content was already active
  show((isOpen ? false : (isContentActive ? true : null)), !(vue.$store.state.application.state.menuOpen));

  /* Disabled
  if (vue.$store.state.application.state.menuOpen) {
    // Go to last opened view or the welcome view
    // var lastPath = this.$store.state.application.state.lastPath;
    return this.$router.push({path: lastPath});
  }
  */
}

function onOpen($fn) {
  vue.$on(DEFAULT_EVENT_CONTENT_OPENED, $fn);
}

function onResize($fn) {
  vue.$on(DEFAULT_EVENT_WINDOW_RESIZE, $fn);
}

function notifyViewChanged($update) {
  vue.$store.commit('updateView', $update);
}


export default {
  init,
  getWindowHeight,
  getWindowWidth,
  getPosition,
  getColorPrimary,
  getColorSecondary,
  open: () => show(true, true),
  openMenu: () => show(null, true),
  openContent: () => show(true, null),
  close: () => show(false, false),
  enable: () => enable(true, true),
  enableMenu: () => enable(null, true),
  enableContent: () => enable(true, null),
  disable: () => enable(false, false),
  disableMenu: () => enable(null, false),
  toggleMenu,
  onOpen,
  onResize,
  notifyViewChanged,
};
