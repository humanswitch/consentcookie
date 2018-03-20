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
  <div class="howto">
    <ic-content-box>
      <div class="icText first">
        Baas over eigen data, dat vinden wij heel normaal.
        Niet alleen vanwege de AVG, maar omdat wij geloven in transparantie en fatsoen.
        Daarom gebruiken wij ConsentCookie.
      </div>
      <div class="icText second">
        ConsentCookie laat jou zien welke data we van jou verzamelen en waarom we dat doen.
        Ga naar <router-link :to="{path: 'connections' }">Jouw instellingen</router-link> om jouw persoonlijke voorkeuren vast te leggen.
        Ze zijn daarna direct van kracht en kunnen op elk moment worden aangepast.
      </div>
      <div class="icText about-sub">ConsentCookie op jouw eigen website gebruiken?</div>
      <div class="icText more-info">Voor meer informatie: <a href="https://www.consentcookie.nl" target="_blank">www.consentcookie.nl</a>
      </div>
    </ic-content-box>
  </div>
</template>
<script>

  // Components
  const icContentBox = require('components/general/icContentBox.vue');
  const icVideo = require('components/general/icVideo.vue');

  // Defaults
  const DEFAULT_VIEW_TITLE = 'Over ConsentCookie';

  // Public functions
  module.exports = {
    name: 'about',
    components: {
      icContentBox,
      icVideo,
    },
    data() {
      return {};
    },
    methods: {},
    beforeMount() {
      this.$store.commit('updateView', { title: DEFAULT_VIEW_TITLE });
    },
  };
</script>

<style lang="scss">

  @import '../assets/scss/general-variables';

  .howto {

    min-width: 320px;

    .icText {
      a {
        text-decoration: underline;
      }
    }

    .icText.first {
      margin-bottom: 10px;
    }

    .icText.about-sub,
    .icText.more-info {
      font-style: italic;
      font-size: 12px;
      font-weight: 600;
    }

    .icText.more-info {
      font-weight: normal;
    }
  }
</style>
