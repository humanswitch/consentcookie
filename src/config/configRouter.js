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
import VueRouter from 'vue-router';

import consentView from 'views/consent';
import aboutView from 'views/about';
import applicationsView from 'views/applications';

/**
 * Function to config vueRouter with defaults of this application
 *
 * @param vue
 * @return {VueRouter}
 */
function configRouter(vue) {

  // Defaults
  const DEFAULT_PATH_CONSENT = '/consent';
  const DEFAULT_RESET_PATH = { matched: [] };

  // Register vueRouter
  vue.use(VueRouter);

  // Init the router
  const routerInstance = new VueRouter({
    mode: 'abstract',
    base: '/',
    linkActiveClass: 'active',
    routes: getRouterPaths(),
  });

  function getStore() {
    return routerInstance.app.$store;
  }

  function isConsentWallAccepted() {
    return routerInstance.app.$services.main.isConsentWallAccepted();
  }

  function isValidRouteCheck(to) {
    return to && to.matched && to.matched.length > 0;
  }

  // Extending the routerinstance
  routerInstance.reset = function () {
    this.history.current = DEFAULT_RESET_PATH;
  };

  // Pre routing logic
  routerInstance.beforeEach((to, from, next) => {
    // Check if we already are showing the consent. If so do nothing
    if (DEFAULT_PATH_CONSENT === to.path) {
      return next();
    }

    // Check if we need to show the consent
    if (!isConsentWallAccepted()) {
      return next(DEFAULT_PATH_CONSENT);
    }

    // Fallback for a route that does not exist. Not implemented atm
    /* if (to.matched.length === 0) {} */
    return next();
  });

  // Post routing logic
  routerInstance.afterEach((to, from) => {
    // Check if we have a valid route
    if (!from || !from.path || !to || !to.path) {
      return;
    }

    // Do nothing if consent has not been accepted yet.
    if (!isConsentWallAccepted()) {
      return;
    }

    // If we had a match, save the last path and set the content active
    if (isValidRouteCheck(to)) {
      getStore()
        .commit('updateApplication', {
          lastPath: to.path,
          contentActive: true,
        });
    }
  });
  // Open content when its closed and opened again
  /*
  routerInstance.afterEach(function(to, from){
    var isContentActive = routerInstance.app.$store.state.view.contentActive;

    if(typeof from.path === 'undefined' || typeof to.path === 'undefined'){
      return;
    }

    if(!isContentActive && from.path && to.path && from.path === to.path){
      routerInstance.app.$store.commit('updateView',{open:true,contentActive:true});
    }
  });
  */

  function getRouterPaths() {
    return [{
      path: DEFAULT_PATH_CONSENT,
      component: consentView,
    }, {
      path: '/about',
      component: aboutView,
    }, {
      path: '/applications',
      component: applicationsView,
    }];
  }

  // Return the router instance
  return routerInstance;
}

export default configRouter;
