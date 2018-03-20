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
  <span class="ic-toggle-img" @click="toggle">
    <ic-img :img="img" :width="width" :height="height"
            :size="size" :unit="unit"/></span>
</template>

<script>

  // Components
  const icImg = require('components/general/icImg.vue');

  module.exports = {
    name: 'ic-toggle-img',
    components: {
      icImg,
    },
    extends: icImg,
    props: {
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

  $icon-color-on: $ic-brand-color;
  $icon-color-off: $ic-color-dark-grey;

  i.ic-toggle-icon {

    transition: color 0.4s;
    cursor: pointer;

    &.on {
      color: $icon-color-on
    }

    &.off {
      color: $icon-color-off
    }

    &.disabled {
      cursor: default;
    }
  }
</style>
