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
  <router-link :to="data.path" :title="data.info" class="ic-menu-item" tag="div" v-theme="{borderColor:'secondary'}">
    <div class="fill" v-theme="{background:'secondary'}"/>
    <i :class="['cc-' + data.icon,'active']" :style="{styleObj}" aria-hidden="true" v-theme="{color:'primary'}"/>
    <i :class="['cc-' + data.icon]" :style="{styleObj}" aria-hidden="true" v-theme="{color:'secondary'}"/>
  </router-link>
</template>

<script>

  /* VUE */
  module.exports = {
    name: 'icMenuItem',
    components: {},
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
        required: true,
      },
    },
    data() {
      return {
        styleObj: {
          fontSize: this.data.iconSize + 'px;',
        },
      };
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  $menu-item-size: 50;

  $menu-item-width: $menu-item-size + px;
  $menu-item-height: $menu-item-width;
  $menu-item-radius: $menu-item-width;

  .ic-menu-item,
  .no-content .ic-menu-item.active {

    position: relative;
    cursor: pointer;
    display: inline-block;
    height: $menu-item-height;
    width: $menu-item-width;
    border-radius: $menu-item-radius;
    margin: 0px 20px 0px 0px;
    border: 2px solid $ic-color-white;
    text-align: center;
    box-sizing: border-box;

    #ConsentCookie.cc-left & {
      margin: 0px 0px 0px 20px;
    }

    .cc-phone & {
      margin: 0px 10px 0px 0px;
    }

    #ConsentCookie.cc-left.cc-phone & {
      margin: 0px 0px 0px 10px;
    }

    &:hover {
      background: $ic-overlay-white-transparant
    }

    > * {
      position: absolute;
      top: -2px;
      left: -2px;
      line-height: $menu-item-height;
      vertical-align: middle;
      height: $menu-item-height;
      width: $menu-item-width;
      border-radius: $menu-item-radius;
    }

    .fill {
      opacity: 0;
      transition: all 0.2s ease;
      transform: scale(0);
      background: none;
    }

    i {
      font-size: 24px;
      color: $ic-color-white;
    }

    i.active{
      display: none;
    }
  }

  .ic-menu-item {
    &.active {

      .fill {
        transform: scale(1);
        opacity: 1;
        background: $ic-color-white;
      }

      i {
        color: $ic-brand-color;
        display:none;
      }

      i.active{
        display: inline;
      }
    }
  }

</style>
