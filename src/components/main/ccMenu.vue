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
  <div class="cc-menu">
    <div class="cc-menu-bar">
      <transition enter-active-class="ccAnimated ccSlideIn" leave-active-class="ccAnimated ccSlideOut">
        <div v-show="isOpen" class="cc-menu-items" v-theme="{background:'primary'}">
          <cc-menu-item v-for="menuItem in menuItems" :key="menuItem.path" :data="menuItem"
                        v-theme="{background:'primary'}"/>
        </div>
      </transition>
    </div>
    <div :class="['cc-menu-button',{'cc-disabled':isDisabled,'cc-open':isOpen,'cc-closed':!isOpen}]" :title="menuTooltip"
         @click="toggleOpen" v-theme="{background:'secondary'}">
      <ccSvgLogo class="cc-closed" v-theme="{stroke:'primary',fill:'primary'}"/>
      <ccSvgClose class="cc-open" v-theme="{stroke:'primary',fill:'primary'}"/>
    </div>
  </div>
</template>

<script>

  // Components
  import ccMenuItem from 'components/main/ccMenuItem';
  import ccSvgLogo from '../../assets/img/logo.svg';
  import ccSvgClose from '../../assets/img/close.svg';

  const menuItems = [{
    icon: 'toggle-on',
    path: '/applications',
    info: 'menu.applications',
  }, {
    icon: 'help',
    iconSize: '30',
    path: '/about',
    info: 'menu.about',
  }];

  /* VUE */
  export default {
    name: 'ccMenu',
    components: {
      ccMenuItem,
      ccSvgLogo,
      ccSvgClose,
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
          return this.$t('menu.disabled');
        }
        if (this.isOpen) {
          return this.$t('menu.close');
        }
        return this.$t('menu.open');
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

  .cc-menu {

    display: block;
    position: relative;
    height: $menu-button-size + px;

    @include default-clearfix();

    .cc-phone & {
      margin: 5px;
    }

    .cc-menu-button {
      position: absolute;
      right: 0px;
      bottom: 0px;
      line-height: $menu-button-height;
      height: $menu-button-height;
      width: $menu-button-width;
      background: $cc-color-white;
      cursor: pointer;
      border: $cc-box-border;
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
        fill: $cc-brand-color;

        &.cc-open {
          /* offset due to border and spacing logo height vs button height*/
          top: 2px;
          left: 2px;
          height: $menu-logo-height;
          width: $menu-logo-width;
        }

        &.cc-closed {
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

      &.cc-disabled {
        @include default-state-disabled;
      }

      &.cc-open {
        transform: rotateZ(0deg);

        .cc-closed {
          opacity: 0;
        }

        .cc-open {
          opacity: 1;
        }
      }

      &.cc-closed {
        transform: rotateZ(-360deg);

        #ConsentCookie.cc-left & {
          transform: rotateZ(360deg);
        }

        .cc-closed {
          opacity: 1;
        }

        .cc-open {
          opacity: 0;
        }
      }
    }

    .cc-menu-bar {
      margin-right: ($menu-button-size / 2) + px;
      overflow: hidden;

      #ConsentCookie.cc-left & {
        margin-right: 0px;
        margin-left: ($menu-button-size / 2) + px;
      }

      .cc-menu-items {
        height: $menu-button-size + px;
        padding: 5px ($menu-button-size / 2) + px 5px 5px;
        border-radius: $menu-button-size + px 0px 0px $menu-button-size + px;
        background: $cc-brand-color;

        @include default-clearfix();

        #ConsentCookie.cc-left & {
          padding: 5px 5px 5px ($menu-button-size / 2) + px;
          border-radius: 0px $menu-button-size + px $menu-button-size + px 0px;
        }
      }
    }
  }

</style>
