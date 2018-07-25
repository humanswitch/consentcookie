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
 */

/* eslint-disable no-param-reassign */

import _ from 'underscore';

let vue;

function setTheme($el, $mapping, $type, $color) {
  if (!(_.isObject($mapping))) {
    return;
  }

  _.each($mapping, ($val, $key) => {
    if ($val.indexOf($type) >= 0) {
      const force = $val.indexOf('?force=true') >= 0;
      $el.style[$key] = $color + (force ? ' !important;' : '');
    }
  });
}

export default {

  // Create reference to vue on bind
  bind($el, $binding, $vnode) {
    vue = $vnode.context;
  },
  // Update element styling based on config
  inserted($el, $binding, $vnode) {
    const primaryColor = vue.$services.view.getColorPrimary();

    if (primaryColor) {
      setTheme($el, $binding.value, 'primary', primaryColor);
    }

    const secondaryColor = vue.$services.view.getColorSecondary();

    if (secondaryColor) {
      setTheme($el, $binding.value, 'secondary', secondaryColor);
    }
  },
  unbind() {
    vue = null;
  },
};
