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
  <div :class="['ic-toggle-box',{'box-border':border}]">
    <div class="box-header">
      <slot class="content" name="header"/>
      <i :class="[{'cc-angle-down':!isOpen},{'cc-angle-up':isOpen}]" @click="toggle()"/>
    </div>
    <div v-show="isOpen" class="box-content">
      <slot name="content"/>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'ic-toggle-box',
    props: {
      border: Boolean,
    },
    data() {
      return {
        isOpen: false,
      };
    },
    methods: {
      toggle() {
        this.isOpen = !this.isOpen;
      },
    },

  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .ic-toggle-box {

    &.box-border {
      @include default-content-border();
    }

    .box-header {

      @include default-clearfix();

      *:first-child {
        float: left;
        height: 40px;
        min-height: 40px;
        line-height: 40px;
        width: calc(100% - 30px);
      }

      > i {
        float: left;
        height: 40px;
        line-height: 40px;
        width: 30px;
        text-align: center;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
</style>
