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
  <div class="ic-connection-actions actions">
    <button v-if="connectionPlugin" @click="deleteProfile()"><span v-if="!isDeleting">Verwijder</span><i
      v-if="isDeleting" class="cc-spinner cc-animate-pulse"/></button>
    <button v-if="connectionPlugin" @click="downloadProfile()"><span v-if="!isDownloading">Download</span><i
      v-if="isDownloading" class="cc-spinner cc-animate-pulse"/></button>
  </div>
</template>

<script>

  // Libraries
  const utils = require('base/utils.js');

  // Components
  const icToggleBox = require('components/general/icToggleBox.vue');

  // Vue module
  module.exports = {
    name: 'ic-connection-profile-actions',
    components: {
      icToggleBox,
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
    data() {
      return {
        connectionPlugin: null,
        isDownloading: false,
        isDeleting: false,
      };
    },
    methods: {
      deleteProfile() {
        const self = this;
        if (self.isDeleting) {
          return;
        }
        self.isDeleting = true;
        this.connectionPlugin.deleteProfile()
          .then(($response) => {
            self.isDeleting = false;
            self.$events.$emit('profile', {
              id: self.connection.id,
              state: 'deleted',
            });
          }, ($error) => {
            console.log('Error deleting: ' + $error);
            self.isDeleting = false;
          });
      },
      downloadProfile() {
        const self = this;
        if (self.isDownloading) {
          return;
        }
        self.isDownloading = true;
        this.connectionPlugin.getProfile()
          .then(($profile) => {
            self.isDownloading = false;

            if ($profile) {
              utils.download(JSON.stringify($profile, null, 3), 'application/json', 'iq-profile.json');
            }
          }, ($error) => {
            console.log('Error downloading: ' + $error);
            self.isDownloading = false;
          });
      },
    },
    mounted() {
      const self = this;
      this.$services.connections.getPlugin(this.connection)
        .then(($plugin) => {
          if ($plugin && !($plugin instanceof Error)) {
            this.connectionPlugin = $plugin;
          }
        }, ($error) => {
          this.connectionPlugin = null;
        });
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .ic-connection-actions.actions {
    margin: 0px 0px 10px;

    @include default-clearfix();

    button {
      float: left;
      width: 45%;
      box-sizing: border-box;
      padding: 5px 10px;
      background: none;
      border: 1px solid $ic-brand-color;
      border-radius: 3px;
      color: $ic-brand-color;
    }
    button:last-child {
      float: right;
    }
  }
</style>
