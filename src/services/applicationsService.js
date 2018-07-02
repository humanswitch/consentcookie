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

// Dependencies
import _ from 'underscore';
import jsCookie from 'js-cookie';

import utils from 'base/utils';
import * as constants from 'base/constants';


let vue;
let applicationsPromise;
let activeApplications;

function init(vueServices) {
  vue = vueServices.getVueInstance();
}

function loadApplications() {
  if (!applicationsPromise) {
    const applicationsEndPoint = getApplicationEndPoint();
    const emptyResult = [];
    if (applicationsEndPoint === null) {
      applicationsPromise = new Promise(($resolve) => $resolve(processApplicationsResult(emptyResult)));
    } else {
      applicationsPromise = vue.$http.get(applicationsEndPoint)
        .then($request => ($request.status === 200 ? processApplicationsResult($request.body) : processApplicationsResult(emptyResult)));
    }
  }
  return applicationsPromise;
}

function processApplicationsResult($applications) {
  const staticApplications = getStaticApplications();

  if (!(_.isArray($applications)) || _.isEmpty($applications)) {
    return staticApplications;
  } else if (!(_.isArray(staticApplications)) || _.isEmpty(staticApplications)) {
    return $applications;
  }
  const staticApplicationsMap = _.reduce(staticApplications, ($memo, $app) => {
    if ($app.id) {
      $memo[$app.id] = $app;
    }
    return $app;
  }, {});

  return _.chain($applications)
    .filter(($application) => !(_.isObject(staticApplicationsMap[$application.id])))
    .union(staticApplications)
    .sortBy(($application) => $application.id)
    .value();
}

function getStaticApplications() {
  const emptyResult = [];
  const staticApplications = vue.$services.config.get(constants.CONFIG_KEY_APPS_STATIC, null);

  if (_.isArray(staticApplications)) {
    return staticApplications;
  }
  else if (_.isObject(staticApplications)) {
    const language = vue.$services.translate.getLanguage();
    return _.isArray(staticApplications[language]) ? staticApplications[language] : emptyResult;
  }
  return emptyResult;
}

function getApplicationEndPoint() {
  const endpoint = vue.$services.config.get(constants.CONFIG_KEY_APPS_ENDPOINT);

  if (!(_.isEmpty(_.trim(endpoint)))) {
    return endpoint;
  }
  if (_.isObject(endpoint)) {
    const language = vue.$services.translate.getLanguage();
    if (endpoint[language]) {
      return endpoint[language];
    }
  }
  if (endpoint === false) {
    return null;
  }
  return getDefaultApplicationEndPoint();
}

function getDefaultApplicationEndPoint() {
  return constants.DEFAULT_CONSENTCOOKIE_APPLICATION_RESOURCE_LOCATION;
}

function getActive() {
  if (!activeApplications) {
    activeApplications = loadApplications()
      .then(($applications) => {
        const consentConfig = vue.$services.config.get(constants.CONFIG_KEY_APPS_CONSENT);
        const active = [];
        const map = _.reduce($applications, ($memo, $application) => {
          $memo[$application.id] = $application;
          return $memo;
        }, {});

        _.each(consentConfig, ($consent, $id) => {
          const application = map[$id];

          if (application) {
            active.push(application);
          }
        });
        return active;
      });
  }
  return activeApplications;
}

function isEnabled($application) {
  return vue.$services.consent.getConsent($application.id)
    .isEnabled();
}

function isAccepted($application) {
  return vue.$services.consent.getConsent($application.id)
    .isAccepted();
}

function isAlwaysOn($application) {
  return vue.$services.consent.getConsent($application.id)
    .isAlwaysOn();
}

function setAccepted($application, $isAccepted) {
  if ($isAccepted === true) {
    vue.$services.consent.accept($application.id);
  } else {
    vue.$services.consent.reject($application.id);
    removeApplicationClientData($application);
  }
}

function removeApplicationData($application) {
  removeApplicationClientData($application);
  return removeApplicationProfile($application);
}

function removeApplicationClientData($application) {
  const cookiePatterns = _.chain($application.dataProcessing)
    .map($dataProcessing => (($dataProcessing.dataIds && _.isArray($dataProcessing.dataIds.cookies)) ?
      $dataProcessing.dataIds.cookies : null))
    .flatten()
    .compact()
    .value();

  if (_.isEmpty(cookiePatterns)) {
    return;
  }

  const cookies = jsCookie.get();
  _.each(cookies, ($cookieVal, $cookieName) => {
    let isMatch = false;
    _.each(cookiePatterns, ($dataId) => {
      isMatch = (isMatch === true || $cookieName.indexOf($dataId) === 0);
    });

    // Delete if match
    if (isMatch) {
      const domains = utils.getDomainTree();
      _.each(domains, ($domain) => {
        jsCookie.remove($cookieName, { domain: $domain });
      });
    }
  });
}

function hasPlugin($application) {
  return new Promise(($resolve) => {
    getPlugin($application)
      .then(() => $resolve(true), () => $resolve(false));
  });
}

function getPlugin($application) {
  return new Promise(($resolve, $reject) => {
    vue.$services.plugin.getPlugin($application)
      .then(($plugin) => {
        if ($plugin && !($plugin instanceof Error)) {
          return $resolve($plugin);
        }
        return $reject($reject);
      }, $error => $reject($error));
  });
}

function getApplicationProfile($application) {
  return new Promise(($resolve, $reject) => {
    getPlugin($application)
      .then($plugin => $resolve($plugin.getProfile($application)), $error => $reject($error));
  });
}

function getApplicationProfileInfo($application) {
  return new Promise(($resolve, $reject) => {
    getPlugin($application)
      .then($plugin => $resolve($plugin.getProfileInfo($application)), $error => $reject($error));
  });
}

function removeApplicationProfile($application) {
  return new Promise(($resolve, $reject) => {
    getPlugin($application)
      .then($plugin => $resolve($plugin.deleteProfile()), $error => $reject($error));
  });
}

function enabledApplication($application) {
  return setAccepted($application, true);
}

function disableApplication($application) {
  return setAccepted($application, false);
}

function downloadApplicationProfile($application) {
  return new Promise(($resolve, $reject) => {
    getApplicationProfile($application)
      .then(($profile) => {
        utils.download(JSON.stringify($profile, null, 3), 'application/json', $application.id + constants.DEFAULT_CONSENTCOOKIE_PROFILE_EXPORT_SUFFIX);
        return $resolve(true);
      }, $error => $reject($error));
  });
}

function getGDPRLink($application) {
  const gdprContactLink = vue.$services.config.get(constants.CONFIG_KEY_GENERAL_GDPR_CONTACTLINK);
  if (!gdprContactLink) {
    return null;
  }
  return gdprContactLink + '?' + constants.DEFAULT_CONSENTCOOKIE_APPLICATION_ID_URL_PARAM + '=' + $application.id;
}

function getLogo($application) {
  return $application.icon ? $application.icon : constants.DEFAULT_CONSENTCOOKIE_APPLICATION_LOGO_LOCATION +
    $application.id + constants.DEFAULT_CONSENTCOOKIE_APPLICATION_LOGO_EXTENSION;
}

export default {
  init,
  hasPlugin,
  getPlugin,
  getActive,
  getApplicationProfile,
  getApplicationProfileInfo,
  isEnabled,
  isAlwaysOn,
  isAccepted,
  setAccepted,
  removeApplicationData,
  removeApplicationClientData,
  removeApplicationProfile,
  enabledApplication,
  disableApplication,
  downloadApplicationProfile,
  getGDPRLink,
  getLogo,
};
