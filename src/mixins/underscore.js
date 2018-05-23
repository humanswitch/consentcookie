const _ = require('underscore');

_.mixin({
  trim: $string => (typeof $string === 'string') ? $string.trim() : null
});

module.exports = _;
