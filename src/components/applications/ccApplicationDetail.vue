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
  <div class="cc-application-detail">
    <transition>
      <div v-if="showInfo" class="cc-wrapper">
        <div class="cc-divider">
          <div :class="['cc-pointer']">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20"
                 height="10">
              <polyline stroke-linejoin="miter" points="0,10 10,0 20,10" stroke-width="1"/>
            </svg>
          </div>
        </div>
        <div class="cc-application-info">
          <div class="cc-description" v-html="application.description"/>
          <cc-application-profile :application="application" :state="state"/>
          <div class="cc-links">
            <a class="cc-more-info" :href="application.urlSite" target="_blank">{{ $t('applications.detail.moreInfo') + " " + application.name}}</a>
            <a class="cc-gdpr" v-if="gdprLink" :href="gdprLink"
               target="_blank" v-t="'applications.detail.gdprInfo'"/>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

  import ccToggleBox from 'components/general/ccToggleBox';

  import ccApplicationProfile from 'components/applications/ccApplicationProfile';

  // Vue module
  export default {
    name: 'cc-application-summary',
    components: {
      ccToggleBox,
      ccApplicationProfile,
    },
    props: {
      application: {
        type: Object,
        required: true,
      },
      state: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {};
    },
    computed: {
      showInfo() {
        return this.state.showInfo === true;
      },
      gdprLink() {
        return this.$services.applications.getGDPRLink(this.application);
      },
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-application-detail {

    .cc-wrapper {
      padding: 0px 10px 10px;

      .cc-divider {
        position: relative;
        width: 100%;
        padding: 0px 10px;
        height: 1px;
        background: $cc-border-color;
        margin-bottom: 10px;

        .cc-pointer {
          display: block;
          left: 8px !important;
          position: absolute;
          text-align: center;
          transition: all 0.4s ease;

          svg {
            position: absolute;
            margin-top: -9px;
            margin-left: -10px;
            stroke: $cc-border-color;
            fill: $cc-color-white;
          }
        }
      }

      .cc-description {
        text-align: left;
      }
    }

    .cc-links{
      text-align: left;

      a{
        display: block;
        font-size: 12px;

        &.cc-gdpr{
          margin-top: 7px;
        }
      }
    }
  }
</style>
