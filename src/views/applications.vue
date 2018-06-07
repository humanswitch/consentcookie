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
  <div class="cc-applications">
    <div class="cc-overview">
      <cc-application v-for="application in applications" :key="application.id" :application="application"/>
    </div>
    <div class="cc-more-info">
      <a v-if="moreInfo" :href="moreInfo">Meer informatie over deze applicaties</a>
    </div>
  </div>
</template>
<script>

  // Components
  import ccApplication from 'components/applications/ccApplication.vue';

  // Defaults
  const viewTitle = 'Jouw instellingen';

  // Public functions
  export default {
    name: 'applications',
    components: {
      ccApplication,
    },
    data() {
      return {
        moreInfo: this.$services.config.get('moreinfolink'),
      };
    },
    asyncComputed: {
      applications() {
        return this.$services.applications.getActive();
      },
    },
    beforeMount() {
      this.$store.commit('updateView', { title: viewTitle });
    },
  };
</script>

<style lang="scss" scoped>

  @import '../assets/scss/general-variables';

  .cc-applications {
    min-width: 320px;
    display: flex;
    flex-direction: column;

    .cc-overview {
      display: block;
      flex: 1;
    }

    .cc-more-info {
      text-align: right;
      padding: 5px 0px;

      a {
        color: $cc-color-black !important;
        text-decoration: underline;
        font-style: italic;
        font-size: 10px;
        cursor: pointer;
      }
    }
  }
</style>
