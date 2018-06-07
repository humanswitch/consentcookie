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
  <div class="cc-profile-wrapper">
    <div class="cc-title">
      <span>Jouw profiel</span>
      <button type="button" class="cc-download" v-if="profileInfo" @click="downloadProfile()">
        <i class="cc-download-cloud" v-theme="{color:'primary'}" v-if="!isDownloading"/>
        <i class="cc-spinner cc-animate-pulse" v-if="isDownloading" v-theme="{color:'primary'}"/>
      </button>
    </div>
    <div class="cc-no-profile" v-if="!hasPlugin">Deze applicatie heeft geen publiek profiel beschikbaar</div>
    <div class="cc-application-profile" v-if="hasPlugin">
      <div v-if="isLoading" class="cc-loading">Profiel wordt opgehaald <i
        class="cc-spinner cc-animate-pulse animate-spin"/>
      </div>
      <cc-toggle-box v-if="profileInfo && !isLoading">
        <div slot="header" class="cc-box-header" v-html="profileInfo.header"/>
        <div slot="content" class="cc-box-content">
          <div v-html="profileInfo.content"/>
        </div>
      </cc-toggle-box>
      <div v-if="!profileInfo && !isLoading" class="cc-no-profile">Geen profiel beschikbaar</div>
    </div>
  </div>
</template>

<script>

  // Libraries
  import ccToggleBox from 'components/general/ccToggleBox.vue';
  import ccApplicationActions from 'components/applications/ccApplicationActions.vue';

  // Vue module
  export default {
    name: 'cc-application-profile',
    components: {
      ccToggleBox,
      ccApplicationActions,
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
      return {
        profileInfo: null,
        isLoading: false,
        isDownloading: false,
      };
    },
    asyncComputed: {
      hasPlugin: {
        get() {
          return this.$services.applications.hasPlugin(this.application);
        },
        default: false,
      },
    },
    methods: {
      loadProfile() {
        this.isLoading = true;
        return this.$services.applications.getApplicationProfileInfo(this.application)
          .then(($profileInfo) => {
            this.isLoading = false;
            this.profileInfo = $profileInfo;
          }, () => {
            this.isLoading = false;
            this.profileInfo = null;
          });
      },
      downloadProfile() {
        this.isDownloading = true;
        return this.$services.applications.downloadApplicationProfile(this.application)
          .then(() => this.isDownloading = false);
      },
    },
    created() {
      const self = this;
      self.loadProfile();
      this.$events.on('consent', ($payload) => {
        if ($payload.id === self.application.id) {
          self.loadProfile();
        }
      });
    }
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-profile-wrapper {
    margin: 10px 0px 10px;
  }

  .cc-title {
    @include default-clearfix();

    span {
      display: inline-block;
      float: left;
      font-weight: 600;
      height: 30px;
      line-height: 30px;
    }

    button {
      display: inline-block;
      float: right;
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

  .cc-no-profile {
    font-style: italic;
  }

  .cc-application-profile {
    border: $cc-box-border;
    font-size: 13px;
    text-align: left;

    .cc-loading,
    .cc-no-profile {
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
