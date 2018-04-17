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
  <div id="icMenu" class="clearfix">
    <div class="ic-menu-bar">
      <transition enter-active-class="icAnimated icSlideIn" leave-active-class="icAnimated icSlideOut">
        <div v-show="isOpen" class="ic-menu-items clearfix" v-theme="{background:'primary'}">
          <ic-menu-item v-for="menuItem in menuItems" :key="menuItem.path" :data="menuItem" v-theme="{background:'primary'}"/>
        </div>
      </transition>
    </div>
    <div :class="['ic-menu-button',{disabled:isDisabled,open:isOpen,closed:!isOpen}]" :title="menuTooltip"
         @click="toggleOpen" v-theme="{background:'secondary'}">
      <icSvgLogo class="closed" v-theme="{stroke:'primary',fill:'primary'}"/>
      <icSvgClose class="open" v-theme="{stroke:'primary',fill:'primary'}"/>
    </div>
  </div>
</template>

<script>

  // Defaults
  const DEFAULT_TOOLTIP_DISABLED = 'accepteer eerst';
  const DEFAULT_TOOLTIP_OPEN = 'ConsentCookie openen';
  const DEFAULT_TOOLTIP_CLOSE = 'ConsentCookie sluiten';

  // Components
  const icMenuItem = require('components/main/icMenuItem.vue');

  const icSvgLogo = require('../../assets/img/logo.svg');
  const icSvgClose = require('../../assets/img/close.svg');

  const menuItems = [{
    icon: 'toggle-on',
    path: '/connections',
    info: 'Connecties',
  }, {
    icon: 'help',
    iconSize: '30',
    path: '/about',
    info: 'Over ConsentCookie',
  }];

  /* VUE */
  module.exports = {
    name: 'icMenu',
    components: {
      icMenuItem,
      icSvgLogo,
      icSvgClose,
    },
    data() {
      return {
        menuItems,
      };
    },
    computed: {
      isOpen() {
        return this.$store.state.application.state.menuOpen;
      },
      isDisabled() {
        return !this.$store.state.application.state.menuActive;
      },
      menuTooltip() {
        // If disabled
        if (this.isDisabled) {
          return DEFAULT_TOOLTIP_DISABLED;
        }
        if (this.isOpen) {
          return DEFAULT_TOOLTIP_CLOSE;
        }
        return DEFAULT_TOOLTIP_OPEN;
      },
    },
    methods: {
      toggleOpen() {
        if (!this.$store.state.application.state.menuActive) {
          return;
        }
        this.$services.view.toggleMenu();
      },
    },
    ready() {

    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  $menu-button-shadow: 0px 0px 15px 2px rgba(136, 136, 136, 0.15);

  $menu-button-size: 60;
  $menu-button-height: $menu-button-size + px;
  $menu-button-width: $menu-button-size + px;
  $menu-button-radius: $menu-button-size + px;

  $menu-logo-size: $menu-button-size - 6;
  $menu-logo-height: $menu-logo-size + px;
  $menu-logo-width: $menu-logo-size + px;

  #icMenu {

    display: block;
    position: relative;
    height: $menu-button-size + px;

    .cc-phone & {
      margin: 5px;
    }

    .ic-menu-button {
      position: absolute;
      right: 0px;
      bottom: 0px;
      line-height: $menu-button-height;
      height: $menu-button-height;
      width: $menu-button-width;
      background: $ic-color-white;
      cursor: pointer;
      border: $ic-box-border;
      border-radius: $menu-button-radius;
      box-shadow: $menu-button-shadow;
      transition: transform 0.8s ease-in-out;

      #ConsentCookie.cc-left & {
        right: auto;
        left: 0px;
      }

      svg {
        position: absolute;
        text-align: center;
        transition: opacity 0.8s ease-in-out;
        fill: $ic-brand-color;

        &.open {
          /* offset due to border and spacing logo height vs button height*/
          top: 2px;
          left: 2px;
          height: $menu-logo-height;
          width: $menu-logo-width;
        }

        &.closed {
          /* offset due to border and spacing logo height vs button height*/
          top: -1px;
          left: -1px;
          width: $menu-button-width;
          height: $menu-button-height;
          line-height: $menu-button-height;
        }
      }

      &:before {
        margin: 0px;
      }

      &.disabled {
        @include default-state-disabled;
      }

      &.open {
        transform: rotateZ(0deg);

        .closed {
          opacity: 0;
        }

        .open {
          opacity: 1;
        }

      }

      &.closed {
        transform: rotateZ(-360deg);

        #ConsentCookie.cc-left & {
          transform: rotateZ(360deg);
        }

        .closed {
          opacity: 1;
        }

        .open {
          opacity: 0;
        }
      }
    }

    .ic-menu-bar {
      margin-right: ($menu-button-size / 2) + px;
      overflow: hidden;

      #ConsentCookie.cc-left & {
        margin-right: 0px;
        margin-left: ($menu-button-size / 2) + px;
      }

      .ic-menu-items {
        height: $menu-button-size + px;
        padding: 5px ($menu-button-size / 2) + px 5px 5px;
        border-radius: $menu-button-size + px 0px 0px $menu-button-size + px;
        background: $ic-brand-color;

        #ConsentCookie.cc-left & {
          padding: 5px 5px 5px ($menu-button-size / 2) + px;
          border-radius: 0px $menu-button-size + px $menu-button-size + px 0px;
        }
      }
    }
  }

</style>
