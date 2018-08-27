<!--
  - Copyright 2018 Asknow Solutions B.V.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -
  -->

<template>
  <div class="cc-applications">
    <div class="cc-overview" v-if="applicationList && !isGroupedByPurpose">
      <cc-application v-for="application in applicationList.getActive()" :key="application.id"
                      :application="application"/>
    </div>
    <div class="cc-overview-purpose" v-if="applicationList && isGroupedByPurpose">
      <cc-application-group v-for="group in applicationList.getActiveGroupedByPurpose()" :key="group.id"
                            :group="group"/>
    </div>
    <div class="cc-more-info">
      <a v-if="hasMoreInfoLink" :href="$t(configKeyMoreInfoLink)">{{ $t(configKeyMoreInfo) }}</a>
    </div>
  </div>
</template>
<script>

  import _ from 'underscore';
  import * as constants from 'base/constants';
  import ccApplication from 'components/applications/ccApplication';
  import ccApplicationGroup from 'components/applications/ccApplicationGroup';

  export default {
    name: 'applications',
    components: {
      ccApplication,
      ccApplicationGroup,
    },
    data() {
      return {
        configKeyMoreInfo: constants.CONFIG_KEY_RESOURCES_APPLICATIONS_MOREINFO,
        configKeyMoreInfoLink: constants.CONFIG_KEY_RESOURCES_APPLICATIONS_MOREINFO_LINK,
      };
    },
    computed: {
      configKeyResourceMoreInfoLink() {
        return _.template(constants.DEFAULT_RESOURCE_PREFIX_TEMPLATE)({ language: this.$i18n.locale }) + constants.CONFIG_KEY_RESOURCES_APPLICATIONS_MOREINFO_LINK;
      },
      hasMoreInfoLink() {
        return this.$services.config.get(this.configKeyResourceMoreInfoLink, null) !== null
          || constants.DEFAULT_RESOURCE_LANGUAGE === this.$i18n.locale;
      },
      isGroupedByPurpose() {
        return this.$services.applications.isGroupEnabled('purpose');
      },
    },
    asyncComputed: {
      applicationList: {
        get() {
          return this.$services.applications.getApplicationListAsync();
        },
        default: null,
      },
    },
    beforeMount() {
      this.$store.commit('updateView', { title: constants.CONFIG_KEY_RESOURCES_APPLICATIONS_TITLE });
    },
  };
</script>

<style lang="scss" scoped>

  @import '../assets/scss/general-variables';

  .cc-applications {
    min-width: 320px;
    display: flex;
    flex-direction: column;
    color: #4e4e4e;

    .cc-overview {
      display: block;
      flex: 1;
    }

    .cc-more-info {
      text-align: right;
      padding: 5px 0px;

      a {
        color: $cc-color-black !important;
        text-decoration: underline;
        font-style: italic;
        font-size: 10px;
        cursor: pointer;
      }
    }
  }
</style>
