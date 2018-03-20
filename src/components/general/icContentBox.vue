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
  <div class="ic-content-box">
    <slot/>
  </div>
</template>

<script>
  module.exports = {
    name: 'icContentBox',
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .ic-content-box {
    margin: 5px;
    padding: 10px 25px;
    border: $ic-box-border;
    border-radius: $ic-box-border-radius;

    .icTitle {
      font-size: 26px;
      font-weight: 600;
      color: $ic-brand-color;
      margin: 5px 0px 5px 0px;
    }
    .icText {
      line-height: 22px;
      font-size: 15px;
      padding-top: 5px;
      font-weight: 400;
    }
  }
</style>
