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
      <div class="icTitle">{{ consentTitle }}</div>
      <div class="icText">{{ consentText }}</div>
      <div class="contentActions">
        <ic-button size="large" @click="accept">Accepteren</ic-button>
        <a :href="consentLink" class="info-link" target="_blank">Meer informatie</a>
      </div>
    </ic-content-box>
  </div>
</template>
<script>

  // Dependencies

  // Defaults
  const viewTitle = 'Welkom bij ConsentCookie';

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
    components: {},
    data() {
      return {
        consentTitle: '',
        consentText: '',
      };
    },
    computed: {
      consentLink() {
        return this.$store.state.application.config.consent.info.link;
      },
    },
    methods: {
      accept() {
        this.$services.main.acceptConsentWall();
      },
    },
    ready() {

    },
    created() {
      this.$set(this, 'consentTitle', this.$services.config.get('consent.title', 'null'));
      this.$set(this, 'consentText', this.$services.config.get('consent.text', 'null'));
    },
    beforeMount() {
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
        color: $ic-link-color;
        font-size: 12px;
        font-style: italic;
        text-decoration: underline;
      }
    }
  }
</style>
