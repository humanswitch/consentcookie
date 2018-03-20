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
  <button :disabled="disabled" :type="nativeType" :class="'ic-button' + clazz" @click="handleClick">
    <label class="ic-button-text">
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
   * <ic-button size="large" icon="back" type="primary"></mt-button>
   */
  module.exports = {
    name: 'ic-button',
    methods: {
      handleClick(evt) {
        this.$emit('click', evt);
      },
    },
    computed: {
      clazz() {
        return (this.type ? ' ' + this.type : '')
          + (this.size ? ' ' + this.size : '')
          + (this.disabled ? ' is-disabled' : '')
          + (this.plain ? ' is-plain' : '');
      },
    },
    props: {
      disabled: Boolean,
      nativeType: String,
      plain: Boolean,
      type: {
        type: String,
        default: 'default',
        validator(value) {
          return [
            'default',
            'danger',
            'primary',
          ].indexOf(value) > -1;
        },
      },
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
  };
</script>

<style lang="scss">

  @import '../../assets/scss/general-variables';

  .ic-button {
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
      background-color: #000000;
      content: " ";
      opacity: 0;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    &:not(.is-disabled):active::after {
      opacity: .4;
    }
    &.default {
      color: $ic-button-default-font-color;
      background-color: $ic-button-default-background-color;
      box-shadow: $ic-button-default-box-shadow;
      &.is-plain {
        border: 1px solid $ic-button-default-plain-color;
        background-color: transparent;
        box-shadow: none;
        color: $ic-button-default-plain-color;
        &:after {
          background-color: #FFFFFF;
        }
      }
    }
    &.primary {
      color: $ic-button-default-font-color;
      background-color: $ic-button-default-background-color;
      box-shadow: $ic-button-default-box-shadow;
      &.is-plain {
        border: 1px solid $ic-button-default-plain-color;
        background-color: transparent;
        box-shadow: none;
        color: $ic-button-default-plain-color;
        &:after {
          background-color: #FFFFFF;
        }
      }
    }
    &.danger {
      color: $ic-button-default-font-color;
      background-color: $ic-button-default-background-color;
      box-shadow: $ic-button-default-box-shadow;
      &.is-plain {
        border: 1px solid $ic-button-default-plain-color;
        background-color: transparent;
        box-shadow: none;
        color: $ic-button-default-plain-color;
        &:after {
          background-color: #FFFFFF;
        }
      }
    }
    &.large {
      display: block;
      width: 100%;
    }
    &.normal {
      display: inline-block;
      padding: 0 12px;
    }
    &.small {
      display: inline-block;
      font-size: 14px;
      padding: 0 12px;
      height: 33px;
    }
    &.is-disabled {
      opacity: .6;
    }
  }
</style>
