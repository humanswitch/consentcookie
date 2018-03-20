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
  <div class="ic-connection">
    <ic-connection-summary :connection="connection" :state="state" @update="state"/>
    <ic-connection-detail :connection="connection" :state="state"/>
  </div>
</template>

<script>
  // Components
  const icConnectionSummary = require('components/connections/icConnectionSummary.vue');
  const icConnectionDetail = require('components/connections/icConnectionDetail.vue');

  // Public functions
  module.exports = {
    name: 'ic-connection',
    components: {
      icConnectionSummary,
      icConnectionDetail,
    },
    props: {
      connection: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        state: {
          showProfile: false,
          showInfo: false,
          hasProfile: false,
        },
      };
    },
    methods: {},
    created() {
      const self = this;

      this.$services.connections.getPlugin(this.connection)
        .then(($plugin) => {
          if ($plugin && !($plugin instanceof Error)) {
            self.state.hasProfile = true;
          }
        }, ($error) => {
          self.state.hasProfile = false;
        });
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .ic-connection {

    @include default-content-border();
    margin: 10px;
  }

</style>
