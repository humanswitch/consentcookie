/* eslint-disable no-param-reassign */

const _ = require('underscore');

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

module.exports = {

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
