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
  <div class="connections">
    <div class="overview">
      <ic-connection v-for="connection in connections" :key="connection.id" :connection="connection"/>
    </div>
    <div class="more-info">
      <a v-if="moreInfo" :href="moreInfo">Meer informatie over jouw connecties</a>
    </div>
  </div>
</template>
<script>

  // Components
  const icConnection = require('components/connections/icConnection.vue');

  // Defaults
  const viewTitle = 'Jouw instellingen';

  // Public functions
  module.exports = {
    name: 'connections',
    components: {
      icConnection,
    },
    data() {
      return {
        connections: this.$services.connections.getActive(),
        moreInfo: this.$services.config.get('moreinfolink'),
      };
    },
    beforeMount() {
      this.$store.commit('updateView', { title: viewTitle });
    },
  };
</script>

<style lang="scss" scoped>

  @import '../assets/scss/general-variables';

  .connections {
    min-width: 320px;
    display: flex;
    flex-direction: column;

    .overview {
      display: block;
      flex: 1;
    }

    .more-info {
      text-align: right;
      padding: 5px 0px;

      a {
        color: $hs-color-black !important;
        text-decoration: underline;
        font-style: italic;
        font-size: 10px;
        cursor: pointer;
      }
    }

  }
</style>
