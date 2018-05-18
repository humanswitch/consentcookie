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
  <div v-if="hasPlugin">
    <div class="ic-connection-profile">
      <div v-if="isLoading" class="loading">Profiel wordt opgehaald <i
        class="cc-spinner animate-spin cc-animate-pulse"/>
      </div>
      <cc-toggle-box v-if="hasProfile && !isLoading">
        <div slot="header" class="cc-box-header" v-html="profileInfo.header"/>
        <div slot="content" class="cc-box-content">
          <div v-html="profileInfo.content"/>
        </div>
      </cc-toggle-box>
      <div v-if="!hasProfile && !isLoading" class="no-profile">Geen profiel beschikbaar</div>
    </div>
    <ic-connection-actions v-if="hasProfile && !isLoading" :connection="connection" :state="state"/>
  </div>
</template>

<script>

  // Libraries
  const ccToggleBox = require('components/general/ccToggleBox.vue');
  const icConnectionActions = require('components/connections/icConnectionActions.vue');

  function loadProfile() {
    const self = this;

    self.isLoading = true;
    self.hasProfile = false;

    this.connectionPlugin.getProfileInfo()
      .then(($profileInfo) => {
        self.profileInfo = $profileInfo;
        self.hasProfile = ($profileInfo != null);
        self.isLoading = false;
      }, ($error) => {
        console.log('error loading profile: ' + $error);
        self.isLoading = false;
        self.hasProfile = false;
      });
  }

  // Vue module
  module.exports = {
    name: 'ic-connection-profile',
    components: {
      ccToggleBox,
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
    methods: {
      loadProfile,
    },
    data() {
      return {
        connectionPlugin: null,
        profileInfo: null,
        isLoading: false,
        hasPlugin: false,
        hasProfile: false,
      };
    },
    mounted() {
      const self = this;

      self.$services.plugin.getPlugin(self.connection)
        .then(($plugin) => {
          if ($plugin && !($plugin instanceof Error)) {
            self.connectionPlugin = $plugin;
            self.hasPlugin = true;
            self.loadProfile();
          }
        }, ($error) => {
          self.hasPlugin = false;
        });
      self.$events.$on('profile', ($payload) => {
        if ($payload.state === 'deleted') {
          self.loadProfile();
        }
      });
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .ic-connection-profile {

    margin: 15px 0px;
    border: $cc-box-border;

    .loading,
    .no-profile {
      height: 40px;
      line-height: 40px;
      text-align: center;

    }

    .cc-box-header {
      @include default-clearfix();
    }

    .cc-box-content {
    }
  }
</style>
