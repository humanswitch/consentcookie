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
  <div v-theme="{background:'primary'}" :style="componentCss" class="cc-view-header">
    <div>
      <div v-theme="{color:'secondary'}" class="cc-title">{{ title }}</div>
    </div>
  </div>
</template>

<script>

  // Defaults
  const DEFAULT_HEADER_HEIGHT = '60';

  // Vue module
  export default {
    name: 'ccViewHeader',
    props: {
      height: {
        type: Number,
        default: DEFAULT_HEADER_HEIGHT,
      },
    },
    computed: {
      title() {
        return this.$store.state.view.title;
      },
      loading() {
        return this.$store.state.view.loading;
      },
      componentCss() {
        return {
          height: this.height + 'px',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-view-header {

    padding: 20px;
    background: $cc-brand-color;
    color: #FFFFFF;
    border-radius: 5px 5px 0px 0px;
    overflow: hidden;

    @include default-clearfix();

    @media screen and (max-height: 360px) {
      padding: 5px 20px;
      height: auto !important;
    }

    .cc-title {
      float: left;
      font-size: 16px;
      letter-spacing: 1px;
      font-weight: bold;
    }
  }
</style>
