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
  <div id="icContent">
    <consent-view/>
    <ic-view/>
  </div>
</template>

<script>

  const icView = require('components/main/icView.vue');
  const consentView = require('views/consent.vue');

  module.exports = {
    name: 'icContent',
    components: {
      icView,
      consentView,
    },
    data() {
      return {};
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  #icContent {
    position: relative;
  }
</style>
