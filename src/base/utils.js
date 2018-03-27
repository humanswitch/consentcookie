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

function getObjectValue($object, $nameSpace, $default) {
  const defaultVal = $default || null;

  if (!$object) {
    return defaultVal;
  }
  if (typeof $nameSpace !== 'string') {
    return $object;
  }

  const nameSpaceArray = $nameSpace.split('.');
  let object = $object;
  for (let i = 0; i < nameSpaceArray.length; i += 1) {
    object = object[nameSpaceArray[i]];

    if (!object) {
      return object || defaultVal;
    }
  }
  return object;
}

function download($object, $type, $filename) {
  if (!window || !window.Blob) {
    throw new Error('Download is not supported.');
  }

  const objectVal = $object || {};
  const typeVal = $type || 'text/html';
  const filename = $filename || 'download';
  const blob = new Blob([objectVal], { type: typeVal });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function logErrorOrThrowException($message) {
  const error = new Error(($message));
  error.stack = null;
  if (console.error) {
    console.error(error);
  } else if (console.log) {
    console.log(error);
  } else {
    throw error;
  }
}

module.exports = {
  download,
  getObjectValue,
  logErrorOrThrowException,
};
