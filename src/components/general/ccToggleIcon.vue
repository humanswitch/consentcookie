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
  <i :class="['cc-toggle-icon',icon,state,{'cc-disabled':disabled}]" :style="styleObject" @click="toggle"/>
</template>

<script>
  export default {
    name: 'cc-toggle-icon',
    props: {
      icon: String,
      size: Number,
      value: {
        type: Boolean,
        default: null,
      },
      default: Boolean,
      disabled: Boolean,
    },
    data() {
      return {};
    },
    computed: {
      toggleValue: {
        set($newVal) {
          this.$emit('input', $newVal);
        },
        get() {
          return this.value !== null ? (this.value === true) : (this.default === true);
        },
      },
      styleObject() {
        return {
          fontSize: this.size + 'px',
        };
      },
      state() {
        return this.toggleValue ? 'cc-on' : 'cc-off';
      },
    },
    methods: {
      toggle() {
        if (this.disabled === true) {
          return;
        }
        this.toggleValue = !this.toggleValue;
      },
    },
  };
</script>

<style lang="scss">

  @import '../../assets/scss/general-variables';

  $icon-color-on: $cc-brand-color;
  $icon-color-off: $cc-color-dark-grey;

  i.cc-toggle-icon {

    transition: color 0.4s;
    cursor: pointer;
    color: $icon-color-on;

    &.cc-off {
      color: $icon-color-off
    }

    &.cc-disabled {
      cursor: default;
      color: $cc-color-dark-grey !important;
    }
  }
</style>
