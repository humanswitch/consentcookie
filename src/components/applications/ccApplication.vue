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
  <div class="cc-application">
    <cc-application-summary :application="application" :state="state" @update="state"/>
    <cc-application-detail :application="application" :state="state"/>
  </div>
</template>

<script>
  // Components
  import ccApplicationSummary from 'components/applications/ccApplicationSummary.vue';
  import ccApplicationDetail from 'components/applications/ccApplicationDetail.vue';

  // Public functions
  export default {
    name: 'cc-application',
    components: {
      ccApplicationSummary,
      ccApplicationDetail,
    },
    props: {
      application: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        state: {
          showInfo: false,
        },
      };
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-application {

    @include default-content-border();
    margin: 10px;
  }

</style>
