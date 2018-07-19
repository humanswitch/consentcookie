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
  <button :disabled="disabled" :type="nativeType"
          :class="['cc-button','cc-default',{'cc-is-disabled':disabled},{'cc-is-plain':plain},sizeClass]"
          @click="handleClick">
    <label class="cc-button-text" v-theme="{color:'secondary'}">
      <slot/>
    </label>
  </button>
</template>

<script>
  /**
   * Based on: https://github.com/ElemeFE/mint-ui/tree/master/packages/button
   *
   * @param {string} [type=default] -  default, primary, danger
   * @param {boolean} [disabled=false] -
   * @param {boolean} [plain=false] -
   * @param {string} [size=normal] -
   * @param {string} [native-type] -
   * @param {string} [icon] -
   * @param {slot} -
   * @param {slot} [icon]
   *
   * @example
   * <cc-button size="large" icon="back" type="primary"></cc-button>
   */
  export default {
    name: 'cc-button',
    props: {
      disabled: Boolean,
      nativeType: String,
      plain: Boolean,
      size: {
        type: String,
        default: 'normal',
        validator(value) {
          return [
            'small',
            'normal',
            'large',
          ].indexOf(value) > -1;
        },
      },
    },
    computed: {
      sizeClass() {
        return 'cc-' + this.size;
      },
    },
    methods: {
      handleClick(evt) {
        this.$emit('click', evt);
      },
    },
  };
</script>

<style lang="scss">

  @import '../../assets/scss/general-variables';

  .cc-button {
    appearance: none;
    border-radius: 4px;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: block;
    font-size: 18px;
    height: 41px;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;
    cursor: pointer;

    &:after {
      content: "";
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    // States
    &:not(.cc-is-disabled):active:after,
    &:not(.cc-is-disabled):hover:active:after {
      display: block;
      background: rgba(0, 0, 0, 0.2);
    }
    &:not(.cc-is-disabled):hover:after {
      display: block;
      background: rgba(255, 255, 255, 0.1)
    }

    &.cc-default {
      color: $cc-button-default-font-color;
      background-color: $cc-button-default-background-color;
      box-shadow: $cc-button-default-box-shadow;

      &.cc-is-plain {
        border: 1px solid $cc-button-default-plain-color;
        background-color: transparent;
        box-shadow: none;
        color: $cc-button-default-plain-color;
        &:after {
          background-color: #FFFFFF;
        }
      }
    }

    &.cc-large {
      display: block;
      width: 100%;
    }
    &.cc-normal {
      display: inline-block;
      padding: 0 12px;
    }
    &.cc-small {
      display: inline-block;
      font-size: 14px;
      padding: 0 12px;
      height: 33px;
    }
    &.cc-is-disabled {
      opacity: .6;
    }
  }
</style>
