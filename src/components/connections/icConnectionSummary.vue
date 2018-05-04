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
  <div class="ic-connection-summary">
    <ic-toggle v-model="showInfo" class="ic-toggle-text">
      <ic-img :img="connection.icon" :size="15" :unit="'px'"/><span>{{ connection.name }}</span>
    </ic-toggle>
    <ic-toggle-icon v-theme="{color:'primary'}" :icon="'cc-user'" v-model="showProfile" :disabled="noProfile" :size="20"/>
    <ic-switch v-model="accepted" :disabled="disabled"/>
  </div>
</template>

<script>

  const icToggleImg = require('components/general/icToggleImg.vue');
  const icImg = require('components/general/icImg.vue');
  const icToggle = require('components/general/icToggle.vue');

  module.exports = {
    name: 'ic-connection-summary',
    components: {
      icToggleImg,
      icImg,
      icToggle,
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
      noProfile() {
        return !(this.state.hasProfile === true);
      },
      showInfo: {
        get() {
          return this.state.showInfo;
        },
        set($newVal) {
          this.state.showInfo = $newVal;

          if ($newVal === true) {
            this.state.showProfile = false;
          }
        },
      },
      showProfile: {
        get() {
          return this.state.showProfile;
        },
        set($newVal) {
          this.state.showProfile = $newVal;

          if ($newVal === true) {
            this.state.showInfo = false;
          }
        },
      },
      accepted: {
        get() {
          const state = this.$services.consent.get(this.connection.id);
          return state.flag === -1 || state.flag === 1;
        },
        set($newVal) {
          if ($newVal === true) {
            this.$services.consent.accept(this.connection.id);
          } else {
            this.$services.consent.reject(this.connection.id);
          }
        },
      },
      disabled() {
        return this.$services.consent.get(this.connection.id).flag === -1;
      },
    },
    data() {
      return {};
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .ic-connection-summary {

    display: flex;
    align-items: center;
    position: relative;
    text-align: left;
    height: 60px;

    @include default-clearfix();

    .ic-toggle-text {
      display: flex;
      align-items: center;
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      margin-left: 10px;

      span {
        margin-left: 5px;
      }
    }

    .ic-toggle-icon {
      cursor: pointer;

      &.off {
        color: $ic-brand-color;
      }

      &.disabled {
        display: none;
      }
    }

    .ic-switch {
      margin: 15px 10px;
      display: inline-block;
      float: right;
    }
  }
</style>
