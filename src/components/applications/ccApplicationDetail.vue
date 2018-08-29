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
          <div class="cc-description">
            <span v-html="application.description" />
            <span><a class="cc-more-info" :href="application.urlSite" target="_blank"> {{ $t('applications.detail.moreInfo') + " " + application.name}}</a></span>
          </div>
          <div v-if="dataProcessings.length" class="cc-dataprocessings">
            <div class="cc-title">
              <span v-t="'applications.detail.dataProcessing'" />
            </div>
            <ul class="cc-application-purposes" v-bind:application="application">
              <li v-for="dataProcessing in dataProcessings" :key="dataProcessing.id" v-html="dataProcessing.description" class="cc-purpose"></li>
            </ul>
          </div>
          <cc-application-profile :application="application" :state="state"/>
          <div class="cc-links">
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
    name: 'cc-application-detail',
    components: {
      ccToggleBox,
      ccApplicationProfile,
    },
    props: {
      application: {
        type: Object,
        required: true,
      },
      group: {
        type: Object,
        required: false,
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
      dataProcessings() {
        return this.$services.applications.getDataProcessings(this.application, this.group ? this.group.definition.id : undefined);
      },
    },
  };
</script>

<style lang="scss">
  @import '../../assets/scss/general-variables';
  .cc-application-detail {

      .cc-title {
        @include default-clearfix();

        span {
          margin-top: 10px;
          display: inline-block;
          font-weight: 600;
        }

        button {
          display: inline-block;
          background: none;
          width: 36px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          cursor: pointer;
          border: none!important;
          box-shadow: none!important;
        }
      }

  }
</style>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-application-detail {

    .cc-wrapper {
      padding: 0px 10px 10px;

      .cc-application-purposes {
        align-self: flex-start;
        margin: 5px 0px 0px 20px;

        .cc-purpose {
          margin: 2px 0px;

        }
      }

      .cc-divider {
        position: relative;
        width: 100%;
        padding: 0px 10px;
        height: 1px;
        background: $cc-border-color;
        margin-bottom: 10px;

        .cc-pointer {
          display: block;
          left: 10px !important;
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

      a {
        display: block;
        font-size: 11px;

        &.cc-gdpr{
          margin-top: 7px;
        }
      }
    }
  }
</style>
