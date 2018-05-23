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
  <label :class="['cc-switch',{'cc-disabled':disabled}]">
    <input v-model="currentValue" :disabled="disabled" type="checkbox" @change="$emit('change', currentValue)">
    <span v-theme="{background:'primary'}">
      <div class="cc-state cc-on">Aan</div>
      <div class="cc-state cc-off" v-theme="{color:'primary'}">Uit</div>
      <div class="cc-switch-toggle" v-theme="{borderColor:'primary'}"/>
    </span>
  </label>
</template>

<script>
  /**
   *  Based on: https://github.com/ElemeFE/mint-ui/tree/master/packages/switch
   *
   *  cc-switch
   *
   * @param {boolean} [value] -
   * @param {slot} -
   *
   * @example
   * <cc-switch v-model="value"></cc-switch>
   */

  module.exports = {
    name: 'cc-switch',
    props: {
      value: Boolean,
      disabled: Boolean,
    },
    computed: {
      currentValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        },
      },
    },
  };
</script>

<style lang="scss">

  @import '../../assets/scss/general-variables';

  $switch-width: 60;
  $switch-height: 30;
  $switch-border-width: 1;
  $switch-on-margin-offset: -2;
  $switch-color-on: $cc-brand-color;
  $switch-color-off: $cc-color-white;
  $switch-state-fontsize: 10;
  $switch-state-offset: 10;
  $switch-state-center-offset: 2;

  .cc-switch {
    position: relative;
    width: $switch-width + px;
    height: $switch-height + px;
    padding: 0px !important;
    display: table-cell;
    vertical-align: middle;

    &.cc-disabled {

      > input[type="checkbox"]:checked + span {
        background-color: $cc-color-dark-grey !important;

        &:before {
          background: $cc-color-white;
        }

        .cc-switch-toggle {
          background-color: $switch-color-off;
          border-color: $cc-color-dark-grey !important;
        }

        .cc-state {
          color: $cc-color-dark-grey;
        }
      }
    }

    > input[type="checkbox"] {
      position: absolute;
      margin-left: -9999px;
      visibility: hidden;
    }

    > input[type="checkbox"] + span {
      display: block;
      position: relative;
      cursor: pointer;
      outline: none;
      user-select: none;
      padding: 2px;
      width: 100%;
      height: 100%;
      background-color: $switch-color-on;
      border-radius: $switch-height + px;
      transition: background 0.4s;

      @mixin switch-child {
        display: block;
        position: absolute;
        content: "";
      }

      &:before {
        @include switch-child();
        top: $switch-border-width + px;
        left: $switch-border-width + px;
        bottom: $switch-border-width + px;
        right: $switch-border-width + px;
        background-color: $switch-color-off;
        border-radius: $switch-height + px;
        transition: background 0.4s;
      }

      .cc-switch-toggle {
        @include switch-child();
        top: 5px;
        left: 5px;
        bottom: 5px;
        width: ($switch-height - 10 - (2 * $switch-border-width)) + px;
        background-color: $switch-color-off;
        border: $switch-border-width + px solid $switch-color-on;
        border-radius: ($switch-height - 10) + px;;
        transition: margin 0.4s, background 0.4s;
      }

      .cc-state {
        @include switch-child();
        top: 0;
        bottom: 0;
        height: $switch-height + px;
        line-height: ($switch-height + $switch-state-center-offset) + px;
        text-transform: uppercase;

        &.cc-on {
          font-size: $switch-state-fontsize + px;
          left: $switch-state-offset + px;
          color: $switch-color-off;
        }

        &.cc-off {
          font-size: $switch-state-fontsize + px;
          right: $switch-state-offset + px;
          color: $switch-color-on;
        }
      }
    }

    > input[type="checkbox"]:checked + span {

      background-color: $switch-color-on;

      &:before {
        background-color: inherit;
      }

      .cc-switch-toggle {
        margin-left: ($switch-width / 2) + $switch-on-margin-offset + px;
        background-color: $switch-color-off;
        border: $switch-border-width + px solid $switch-color-off;;
      }
    }
  }
</style>
