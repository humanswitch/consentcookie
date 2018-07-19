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

    if (typeof object === 'undefined' || object === null) {
      return (typeof object !== 'undefined' && object !== null) ? object : defaultVal;
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

function getElementsByTagName($tagname, $filter, $global) {
  const found = [];
  const global = $global || window;

  if (!global || !global.document || !global.document.getElementsByTagName || typeof $tagname !== 'string') {
    return found;
  }
  const elements = global.document.getElementsByTagName($tagname);

  if (!elements || elements.length === 0) {
    return found;
  }
  if (typeof $filter !== 'function') {
    return Array.prototype.slice.call(elements);
  }

  for (let n = 0; n < elements.length; n++) {
    if ($filter(elements[n])) {
      found.push(elements[n]);
    }
  }
  return found;
}

/**
 *
 * @return {string}
 */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function getDomainTree() {
  const domainTree = [];

  if (!window || !window.location || typeof window.location.hostname !== 'string') {
    return domainTree;
  }
  const hostParts = window.location.hostname.split('.');

  for (let n = 0; n < hostParts.length; n++) {
    const domain = hostParts.slice(n)
      .join('.');
    if (n === hostParts.length - 2) {
      // Host portion current domain
      domainTree.push('.' + domain);
      return domainTree;
    }
    domainTree.push(domain);
  }
  return domainTree;
}

export default {
  download,
  logErrorOrThrowException,
  getObjectValue,
  getElementsByTagName,
  getDomainTree,
  uuidv4,
};
