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
  <div id="consent">
    <ic-content-box>
      <div class="icText" v-html="consentText"/>
      <div class="contentActions">
        <ic-button class="" size="large" @click="accept" v-theme="{background:'primary',color:'secondary'}">{{ consentButtonText }}</ic-button>
        <a :href="consentInfoLink" class="info-link" target="_blank">Meer informatie</a>
      </div>
    </ic-content-box>
  </div>
</template>
<script>

  // Components
  const icContentBox = require('components/general/icContentBox.vue');
  const icButton = require('components/general/icButton.vue');

  // Defaults
  const DEFAULT_CONFIG_KEY_CONSENTWALL_BLOCKPAGE = 'general.consent.blockpage';

  const DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_TITLE = 'resources.nl.consent.title';
  const DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_TEXT = 'resources.nl.consent.text';
  const DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_BUTTONTEXT = 'resources.nl.consent.button';
  const DEFAULT_CONFIG_KEY_RESOURCES_CONSENTWALL_CONSENT_LINK = 'resources.nl.consent.infolink';

  const DEFAULT_CONSENTWALL_BLOCKPAGE = false;
  const DEFAULT_CONSENTWALL_CONSENT_TITLE = 'Gebruik van onze diensten';
  const DEFAULT_CONSENTWALL_CONSENT_TEXT = 'Wanneer jij je aanmeldt voor een van onze diensten vragen we jou om persoonsgegevens te verstrekken. Deze gegevens worden gebruikt om de dienst uit te kunnen voeren. De gegevens worden opgeslagen op eigen beveiligde servers van HumanSwitch of die van een derde partij.';
  const DEFAULT_CONSENTWALL_CONSENT_BUTTONTEXT = 'Accepteren';
  const DEFAULT_CONSENTWALL_CONSENT_INFOLINK = 'https://www.humanswitch.io/privacy/';

  // Public functions
  module.exports = {
    name: 'consentView',
    components: {
      icContentBox,
      icButton,
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

  #consent {

    padding: 5px 5px;

    .contentActions {
      text-align: center;
      padding: 20px 0px;

      .info-link {
        display: block;
        margin-top: 15px;
        color: $ic-color-black;
        font-size: 12px;
        font-style: italic;
        text-decoration: underline;
      }
    }
  }
</style>
