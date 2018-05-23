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
      <div class="ccText" v-html="consentText"/>
      <div class="cc-consentActions">
        <cc-button size="large" @click="accept" v-theme="{background:'primary',color:'secondary'}">{{ consentButtonText }}</cc-button>
        <a :href="consentInfoLink" class="cc-info-link" target="_blank">Meer informatie</a>
      </div>
    </cc-content-box>
  </div>
</template>
<script>

  // Components
  const ccContentBox = require('components/general/ccContentBox.vue');
  const ccButton = require('components/general/ccButton.vue');

  // Defaults
  const DEFAULT_CONFIG_KEY_CONSENTWALL_BLOCKPAGE = 'general.consent.blockpage';

  const DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_TITLE = 'resources.nl.consent.title';
  const DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_TEXT = 'resources.nl.consent.text';
  const DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_BUTTONTEXT = 'resources.nl.consent.button';
  const DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_LINK = 'resources.nl.consent.infolink';

  const DEFAULT_CONSENTWALL_BLOCKPAGE = false;
  const DEFAULT_CONSENTWALL_CONSENT_TITLE = 'ConsentCookie';
  const DEFAULT_CONSENTWALL_CONSENT_TEXT = '<div>Deze website maakt gebruik van <a href="https://www.consentcookie.nl/"><u>ConsentCookie</u></a> om je cookies en privacy toestemmingen op deze website te beheren.</div>';
  const DEFAULT_CONSENTWALL_CONSENT_BUTTONTEXT = 'Ok!';
  const DEFAULT_CONSENTWALL_CONSENT_INFOLINK = 'https://www.consentcookie.nl/';

  // Public functions
  module.exports = {
    name: 'consentView',
    components: {
      ccContentBox,
      ccButton,
    },
    data() {
      return {};
    },
    computed: {
      consentText() {
        return this.$services.config.get(DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_TEXT, DEFAULT_CONSENTWALL_CONSENT_TEXT);
      },
      consentButtonText() {
        return this.$services.config.get(DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_BUTTONTEXT, DEFAULT_CONSENTWALL_CONSENT_BUTTONTEXT);
      },
      consentInfoLink() {
        return this.$services.config.get(DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_LINK, DEFAULT_CONSENTWALL_CONSENT_INFOLINK);
      },
      blockPage() {
        return this.$services.config.get(DEFAULT_CONFIG_KEY_CONSENTWALL_BLOCKPAGE, DEFAULT_CONSENTWALL_BLOCKPAGE);
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
      const viewTitle = this.$services.config.get(DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_TITLE, DEFAULT_CONSENTWALL_CONSENT_TITLE);
      this.$store.commit('updateView', { title: viewTitle });
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
