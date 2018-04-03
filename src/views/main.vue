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
  <div id="ConsentCookie" :class="['ConsentCookie',isLeft ? 'cc-left' : 'cc-right',{'cc-phone':isPhone,'cc-portrait':isPortrait}]">
    <ic-view/>
    <ic-menu/>
  </div>
</template>

<script>

  // Defaults
  const DEFAULT_CONFIG_DESIGN_LAYOUT_POSITION_LEFT_VAL = 'left';
  const DEFAULT_CONFIG_KEY_DESIGN_LAYOUT_POSITION = 'design.layout.position';

  // Components
  const icMenu = require('../components/main/icMenu.vue');
  const icView = require('../components/main/icView.vue');

  module.exports = {
    name: 'mainView', // main is a reserved word
    props: ['id', 'config'],
    components: {
      icMenu,
      icView,
    },
    data() {
      return {};
    },
    computed: {
      isPhone() {
        return this.$store.state.view.isPhone;
      },
      isPortrait() {
        return this.$store.state.view.isPortrait;
      },
      isLeft() {
        return DEFAULT_CONFIG_DESIGN_LAYOUT_POSITION_LEFT_VAL === this.$services.config.get(DEFAULT_CONFIG_KEY_DESIGN_LAYOUT_POSITION);
      },
    },
    beforeMount() {
      if (this.$services.main.isConsentWallAccepted()) {
        this.$services.view.enableMenu();
      }
    },
    mounted() {
      if (!this.$services.main.isConsentWallAccepted()) {
        this.$services.main.showConsentWall();
      }
    },
    created() {
      this.$services.config.load(this.config);
      this.$services.consent.load();
    },
  };
</script>

<style lang="scss" scoped>

  #ConsentCookie {
    position: fixed;
    bottom: 40px;
    right: 40px;
  }

  #ConsentCookie.cc-left {
    right: auto;
    left: 40px;
  }

  #ConsentCookie.cc-phone {
    bottom: 2px;
    right: 0px;
  }

  #ConsentCookie.cc-left.cc-phone {
    right: auto;
    left: 0px;
  }
</style>
