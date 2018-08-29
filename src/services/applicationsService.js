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

const DEFAULT_PURPOSE_UNDEFINED = {
  id: 'ccp-ot',
  name: 'Other',
};

let vue;
let applicationListAsync;

class ApplicationGroup {

  constructor($groupDefinition, $items) {
    this.definition = $groupDefinition;
    this.items = _.isArray($items) ? $items : [];
  }

  getTotalCount() {
    return this.items.length;
  }

}

class ApplicationList {

  constructor($remoteApps, $staticApps, $consentConfigs) {
    this.remoteApps = _.map($remoteApps, $app => new Application($app));
    this.staticApps = _.map($staticApps, $app => new Application($app));
    this.consentConfigs = $consentConfigs;

    this.remoteAppsMap = _.indexBy(this.remoteApps, $app => $app.id);
    this.staticAppsMap = _.indexBy(this.staticApps, $app => $app.id);
  }

  get($id) {
    return utils.getObjectValue(this.staticApps, $id, utils.getObjectValue(this.remoteAppsMap, $id, null));
  }

  getConfigureUniquePurposes($id) {
    const app = this.get($id);

    if (!(app instanceof Application)) {
      return [];
    }
    const selectedDataProcessings = this.getConfiguredDataProcessings($id);
    return _.chain(app.dataProcessings)
      .filter($dataProcessing => (_.isEmpty(selectedDataProcessings) ? true : _.contains(selectedDataProcessings, $dataProcessing.id)))
      .map($dataProcessing => $dataProcessing.purposes)
      .flatten()
      .unique(false, $purpose => $purpose.id)
      .value();
  }

  getConfiguredDataProcessings($id) {
    return utils.getObjectValue(this.consentConfigs, $id + '.dataProcessings', []);
  }

  getMerged = utils.cacheResult(() => _.chain(this.remoteApps)
    .filter($app => !(_.isObject(this.staticAppsMap[$app.id])))
    .union(this.staticApps)
    .sortBy($app => $app.id)
    .value());

  getActive = utils.cacheResult(() => _.chain(this.getMerged())
    .filter(($app => $app && $app.id && this.consentConfigs[$app.id]))
    .value());

  getActiveGroupedByPurpose = utils.cacheResult(() => _.chain(this.getActive())
    .reduce(($memo, $app) => {
      const uniquePurposes = this.getConfigureUniquePurposes($app.id);
      if (_.isEmpty(uniquePurposes)) {
        utils.getOrCreateAndReturn($memo, DEFAULT_PURPOSE_UNDEFINED.id, new ApplicationGroup(DEFAULT_PURPOSE_UNDEFINED))
          .items
          .push($app);
      } else {
        _.each(uniquePurposes, ($purpose) => {
          utils.getOrCreateAndReturn($memo, $purpose.id, new ApplicationGroup($purpose))
            .items
            .push($app);
        });
      }
      return $memo;
    }, {})
    .map($group => $group)
    .sortBy($group => $group.definition.name)
    .value());


  getPurposes = utils.cacheResult(() => _.chain(this.getGroupedByPurpose())
    .map($group => $group.definition)
    .value());

}

class Application {

  constructor($application) {
    // Not using setPrototype because its not supported by IE9
    _.extend(this, $application);
  }

  getCookiePatterns() {
    return _.chain(this.dataProcessings)
      .map($dataProcessing => $dataProcessing.identifications)
      .flatten()
      .filter($identification => $identification.fileSystem && $identification.fileSystem.id === 'persistent-cookie')
      .map($identification => $identification.pattern)
      .compact()
      .value();
  }

  // Todo workaround for https://github.com/humanswitch/consentcookie/issues/73
  getPluginPath() {
    return _.chain(this.plugins)
      .map($plugin => $plugin.url)
      .first()
      .value();
  }

}

function init(vueServices) {
  vue = vueServices.getVueInstance();
}

function getApplicationListAsync() {
  if (!applicationListAsync) {
    const applicationsEndPoint = getApplicationEndPoint();
    const emptyResult = [];
    if (applicationsEndPoint === null) {
      applicationListAsync = new Promise($resolve => $resolve(new ApplicationList(emptyResult, getStaticApplications(), getApplicationsConfig())));
    } else {
      applicationListAsync = vue.$http.get(applicationsEndPoint)
        .then($request => ($request.status === 200 ? new ApplicationList($request.body, getStaticApplications(), getApplicationsConfig()) :
          new ApplicationList(emptyResult, getStaticApplications(), getApplicationsConfig())));
    }
  }
  return applicationListAsync;
}

function getStaticApplications() {
  const emptyResult = [];
  const staticApplications = vue.$services.config.get(constants.CONFIG_KEY_APPS_STATIC, null);

  if (_.isArray(staticApplications)) {
    return staticApplications;
  } else if (_.isObject(staticApplications)) {
    const language = vue.$services.translate.getLanguage();
    return _.isArray(staticApplications[language]) ? staticApplications[language] : emptyResult;
  }
  return emptyResult;
}

function getApplicationsConfig() {
  return vue.$services.config.get(constants.CONFIG_KEY_APPS_CONSENT);
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

function isEnabled($application) {
  return vue.$services.consent.getConsent($application.id)
    .isEnabled();
}

function isAccepted($item) {
  return vue.$services.consent.getConsent($item.id)
    .isAccepted();
}

function isAlwaysOn($item) {
  return vue.$services.consent.getConsent($item.id).isAlwaysOn();
}

function setAccepted($item, $isAccepted) {
  if ($isAccepted === true) {
    vue.$services.consent.accept($item.id);
  } else {
    vue.$services.consent.reject($item.id);
    removeApplicationClientData($item);
  }
}

function setGroupAccepted($group, $isAccepted) {
  setAccepted($group.definition, $isAccepted);
  _.each($group.items, $application => removeApplicationClientData($application));
}

function removeApplicationData($application) {
  removeApplicationClientData($application);
  return removeApplicationProfile($application);
}

function removeApplicationClientData($item) {
  if (!$item || !_.isFunction($item.getCookiePatterns)) {
    return;
  }
  const cookiePatterns = $item.getCookiePatterns();
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

function getPluginSrc($application) {
  if (!$application || !$application.id) {
    return null;
  }
  const consentConfigKey = _.template(constants.DEFAULT_CONSENTCOOKIE_APPLICATION_CONSENT_PREFIX_TEMPLATE)({ applicationId: $application.id }) + constants.CONFIG_KEY_APPS_CONSENT_PLUGIN;
  return vue.$services.config.get(consentConfigKey, $application.getPluginPath());
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
  return $application.urlIcon ? $application.urlIcon : constants.DEFAULT_CONSENTCOOKIE_APPLICATION_LOGO_LOCATION +
    $application.id + constants.DEFAULT_IMAGE_EXTENSION;
}

function getGroupIcon($group, $groupType) {
  return $group.urlIcon ? $group.urlIcon : constants.DEFAULT_CONSENTCOOKIE_APPLICATION_GROUP_ICON_LOCATION +
    $group.id + constants.DEFAULT_IMAGE_EXTENSION;
}

function isGroupEnabled($group) {
  if (_.isEmpty($group)) {
    return false;
  }
  return $group === vue.$services.config.get(constants.CONFIG_KEY_GENERAL_CONSENT_TYPE, null);
}

function getDataProcessings($application, purposeId) {
  if (!$application) {
    return [];
  }
  return _.chain($application.dataProcessings)
    .filter($dataProcessing => !(_.isEmpty($dataProcessing.description)))
    .filter($dataProcessing =>
      _.isObject(_.find($dataProcessing.purposes, $purpose => !purposeId || $purpose.id === purposeId)))
    .value();
}

export default {
  init,
  hasPlugin,
  getPlugin,
  getPluginSrc,
  getApplicationListAsync,
  getApplicationProfile,
  getApplicationProfileInfo,
  isEnabled,
  isAlwaysOn,
  isAccepted,
  isGroupEnabled,
  setAccepted,
  setGroupAccepted,
  removeApplicationData,
  removeApplicationClientData,
  removeApplicationProfile,
  downloadApplicationProfile,
  getGDPRLink,
  getLogo,
  getGroupIcon,
  getDataProcessings,
};
