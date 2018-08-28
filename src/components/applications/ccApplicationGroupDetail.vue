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
  <div class="cc-application-group-detail" v-if="showGroup">
    <div class="cc-group-info">
      <div class="cc-divider"/>
      <div class="cc-description" v-html="group.definition.description"/>
    </div>
    <div class="cc-group-applications">
      <div class="cc-applications-list">
        <cc-application v-for="application in group.items" :key="application.id" :application="application" :group="group" :show-switch="false"/>
      </div>
    </div>
  </div>
</template>

<script>

  import _ from 'underscore';
  import ccToggleBox from 'components/general/ccToggleBox';

  import ccApplicationSummary from 'components/applications/ccApplicationSummary';
  import ccApplicationDetail from 'components/applications/ccApplicationDetail';
  import ccApplication from 'components/applications/ccApplication';

  // Vue module
  export default {
    name: 'cc-application-group-detail',
    components: {
      ccToggleBox,
      ccApplicationSummary,
      ccApplicationDetail,
      ccApplication
    },
    props: {
      group: {
        type: Object,
        required: true,
      },
      state: {
        type: Object,
        required: true,
      },
    },
    computed: {
      showGroup() {
        return this.state.showGroup === true;
      },
    },
    methods: {
      getDataProcessings($application) {
        if (!$application) {
          return [];
        }
        return _.chain($application.dataProcessings).filter($dataProcessing => !(_.isEmpty($dataProcessing.description))).filter($dataProcessing => _.isObject(_.find($dataProcessing.purposes, $purpose => $purpose.id === this.group.definition.id))).value();
      },
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-application-group-detail {

    .cc-group-info {
      padding: 0px 10px;

      .cc-divider {
        position: relative;
        width: 100%;
        padding: 0px 10px;
        height: 1px;
        background: $cc-border-color;
        margin-bottom: 10px;
      }

      .cc-description {
        text-align: left;
        margin-bottom: 10px;
      }
    }

    .cc-group-applications {

      .cc-applications-header {
        margin: -10px 10px 10px;
        font-weight: 600;
      }

      /deep/ .cc-application-summary {
        padding: 10px;
        flex-direction: column;
        height: auto;
        min-height: 40px;

        > * {
          align-self: flex-start;
        }

        /deep/ .cc-toggle-text {
          margin: 0px;
        }

      }
    }
  }
</style>
