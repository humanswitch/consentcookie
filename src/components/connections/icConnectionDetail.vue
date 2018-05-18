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
  <div class="ic-connection-detail">
    <transition>
      <div v-if="showDetails" class="wrapper">
        <div class="divider">
          <div :class="['pointer',{'right':showProfile},{'left':showInfo}]">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20"
                 height="10">
              <polyline stroke-linejoin="miter" points="0,10 10,0 20,10" stroke-width="1"/>
            </svg>
          </div>
        </div>
        <div v-if="showInfo" class="connection-info">
          <div class="description" v-html="connection.description.connection"/>
          <ul class="properties">
            <ic-connection-property v-for="property in connection.properties" :key="property.name"
                                    :property="property"/>
          </ul>
          <div class="more-info"><a :href="connection.infolink.connection" target="_blank">Meer informatie over {{ connection.name }}</a></div>
        </div>
        <div v-if="showProfile && hasProfile" class="profile-info">
          <div>
            <div class="description" v-html="connection.description.profile"/>
            <ic-connection-profile :connection="connection" :state="state"/>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

  const icConnectionProperty = require('./icConnectionProperty.vue');
  const icConnectionProfile = require('components/connections/icConnectionProfile.vue');
  const icConnectionActions = require('components/connections/icConnectionActions.vue');

  // Vue module
  module.exports = {
    name: 'ic-connection-summary',
    components: {
      icConnectionProperty,
      icConnectionProfile,
      icConnectionActions,
    },
    props: {
      connection: {
        type: Object,
        required: true,
      },
      state: {
        type: Object,
        required: true,
      },
    },
    computed: {
      hasProfile() {
        return this.state.hasProfile === true;
      },
      showProfile() {
        return this.state.showProfile === true;
      },
      showInfo() {
        return this.state.showInfo === true;
      },
      showDetails() {
        return this.state.showInfo === true || this.state.showProfile === true;
      },
    },
    data() {
      return {};
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .ic-connection-detail {

    .wrapper {
      padding: 0px 10px 10px;

      .divider {
        position: relative;
        width: 100%;
        padding: 0px 10px;
        height: 1px;
        background: $cc-color-grey;
        margin-bottom: 10px;

        .pointer {
          position: absolute;
          text-align: center;
          display: none;
          transition: all 0.4s ease;

          svg {
            position: absolute;
            margin-top: -9px;
            margin-left: -10px;
            stroke: $cc-color-grey;
            fill: $cc-color-white;
          }
        }

        .pointer.left {
          display: block;
          left: 8px;
        }

        .pointer.right {
          display: block;
          left:208px;
        }
      }

      .properties {
        padding: 10px;
      }
    }

    .more-info a {
      font-size: 12px;
    }
  }
</style>
