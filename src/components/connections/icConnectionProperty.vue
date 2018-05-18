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
  <li class="ic-connection-property">
    <i :class="['cc-ok',{'enabled':isChecked}]"/><span>{{ info }}</span>
  </li>
</template>

<script>
  module.exports = {
    name: 'ic-connection-property',
    components: {},
    props: {
      property: {
        type: Object,
        required: true,
      },
    },
    computed: {
      info() {
        return this.property.id + ' - ' + this.property.type;
      },
      isChecked() {
        return this.property.enabled;
      },
    },
    data() {
      return {

      };
    },
    methods: {

    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .ic-connection-property {
    list-style: none;

    i {
      margin-right: 5px;
      color: $cc-color-dark-grey;

      &.enabled {
        color: $cc-color-done-true;
      }
    }
  }
</style>
