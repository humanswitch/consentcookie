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

import _ from 'underscore';

function assign($target, $source, $assigner) {
  if (_.isFunction($assigner)) {
    const assignment = $assigner($target, $source);
    return _.isUndefined(assignment) ? $target : assignment;
  }
  return $source;
}

_.mixin({
  trim: $string => ((typeof $string === 'string') ? $string.trim() : null),
  extendDeep: ($target, $source, $assigner) => {
    if (!(_.isObject($source))) {
      return $target;
    }
    for (const key of Object.keys($source)) {
      if (key in $target && _.isObject($target[key])) {
        _.extendDeep($target[key], $source[key], $assigner);
      } else {
        const assignment = assign($target[key], $source[key], $assigner);
        if (typeof assignment !== 'undefined') {
          // eslint-disable-next-line no-param-reassign
          $target[key] = assignment;
        }
      }
    }
    return $target;
  },
});

export default _;
