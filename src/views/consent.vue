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
  <div class="cc-consent">
    <cc-content-box>
      <div class="ccText" v-html="$t(configKeyConsentText)"/>
      <div class="cc-consentActions">
        <cc-button size="large" @click="accept" v-theme="{background:'primary',color:'secondary'}">{{$t(configKeyConsentButtonText)}}</cc-button>
        <a :href="$t(configKeyConsentInfoLink)" class="cc-info-link" target="_blank">{{ $t('general.moreInfo')}}</a>
      </div>
    </cc-content-box>
  </div>
</template>
<script>

  import * as constants from 'base/constants.js';
  import ccContentBox from 'components/general/ccContentBox.vue';
  import ccButton from 'components/general/ccButton.vue';

  export default {
    name: 'consentView',
    components: {
      ccContentBox,
      ccButton,
    },
    data() {
      return {
        configKeyConsentText: constants.CONFIG_KEY_RESOURCES_CONSENT_TEXT,
        configKeyConsentButtonText: constants.CONFIG_KEY_RESOURCES_CONSENT_BUTTON,
        configKeyConsentInfoLink: constants.CONFIG_KEY_RESOURCES_CONSENT_INFOLINK,
      };
    },
    computed: {
      blockPage() {
        return this.$services.config.get(constants.CONFIG_KEY_GENERAL_CONSENTWALL_BLOCKPAGE, constants.DEFAULT_GENERAL_CONSENTWALL_BLOCKPAGE);
      },
    },
    methods: {
      accept() {
        this.$services.main.acceptConsentWall();
      },
    },
    ready() {

    },
    beforeMount() {
      this.$store.commit('updateView', { title: constants.CONFIG_KEY_RESOURCES_CONSENT_TITLE });
    },
  };

</script>
<style lang="scss" scoped>

  @import '../assets/scss/general-variables';

  .cc-consent {
    padding: 5px 5px;

    .cc-consentActions {
      text-align: center;
      padding: 20px 0px;

      .cc-info-link {
        display: block;
        margin-top: 15px;
        color: $cc-link-color;
        font-size: 12px;
        font-style: italic;
        text-decoration: underline;
      }
    }
  }
</style>
