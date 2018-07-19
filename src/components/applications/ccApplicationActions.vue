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
  <div class="cc-application-actions" v-if="application.gdpr">
    <button class="cc-contact" v-theme="{color:'primary',borderColor:'primary'}" @click="gdprContact()">
      <span v-t="'applications.actions.gdpr'"/>
    </button>
  </div>
</template>

<script>

  // Components
  import ccToggleBox from 'components/general/ccToggleBox.vue';

  // Vue module
  export default {
    name: 'cc-application-profile-actions',
    components: {
      ccToggleBox,
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
        isDownloading: false,
        isDeleting: false,
      };
    },
    methods: {
      gdprContact() {
        const gdprLink = this.$services.applications.getGDPRLink(this.application);
        window.open(gdprLink, '_blank');
      },
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-application-actions {
    margin: 0px 0px 10px;

    @include default-clearfix();

    button {
      float: left;
      width: 45%;
      box-sizing: border-box;
      padding: 0px 10px;
      height: 32px;
      line-height: 32px;
      background: none;
      border: 1px solid $cc-brand-color;
      border-radius: 3px;
      color: $cc-brand-color;
      font-size: 13px;
    }

    button.cc-download {
      float: right;
    }
  }
</style>
