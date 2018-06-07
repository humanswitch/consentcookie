import _ from 'underscore';

_.mixin({
  trim: $string => (typeof $string === 'string') ? $string.trim() : null
});

export default _;
