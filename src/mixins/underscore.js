import _ from 'underscore';

function assign($target, $source, $assigner) {
  if (_.isFunction($assigner)) {
    const assignment = $assigner($target, $source);
    return _.isUndefined(assignment) ? $target : assignment;
  } else {
    return $source;
  }
}

_.mixin({
  trim: $string => (typeof $string === 'string') ? $string.trim() : null,
  extendDeep: ($target, $source, $assigner) => {
    if (!(_.isObject($source))) {
      return $target;
    } else {
      for (let key in $source) {
        if (key in $target && _.isObject($target[key])) {
          _.extendDeep($target[key], $source[key], $assigner);
        } else {
          const assignment = assign($target[key], $source[key], $assigner);
          if(typeof assignment !== 'undefined'){
            $target[key] = assignment;
          }
        }
      }
    }
    return $target;
  }
});

export default _;
