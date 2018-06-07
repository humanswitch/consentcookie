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
  <div class="cc-application-summary">
    <cc-toggle v-model="showInfo" class="cc-toggle-text">
      <cc-img :img="logo" :size="15" :unit="'px'"/>
      <span>{{ application.name }}</span>
    </cc-toggle>
    <cc-toggle-icon v-theme="{color:'primary'}" :icon="'cc-user'" v-model="showInfo" :disabled="!hasPlugin" :size="20"/>
    <cc-switch v-model="accepted" :disabled="disabled"/>
  </div>
</template>

<script>

  import ccImg from 'components/general/ccImg.vue';
  import ccToggle from 'components/general/ccToggle.vue';
  import ccToggleIcon from 'components/general/ccToggleIcon.vue';
  import ccSwitch from 'components/general/ccSwitch.vue';

  export default {
    name: 'cc-application-summary',
    components: {
      ccImg,
      ccToggle,
      ccToggleIcon,
      ccSwitch,
    },
    props: {
      application: {
        type: Object,
        required: true,
      },
      state: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {};
    },
    computed: {
      showInfo: {
        get() {
          return this.state.showInfo;
        },
        set($newVal) {
          this.state.showInfo = $newVal;
        }
      },
      accepted: {
        get() {
          return this.$services.applications.isEnabled(this.application);
        },
        set($newVal) {
          this.$services.applications.setAccepted(this.application, $newVal);
        },
      },
      disabled() {
        return this.$services.applications.isAlwaysOn(this.application);
      },
      logo() {
        return this.$services.applications.getLogo(this.application);
      }
    },
    asyncComputed: {
      hasPlugin: {
        get() {
          return this.$services.applications.hasPlugin(this.application);
        },
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-application-summary {

    display: flex;
    align-items: center;
    position: relative;
    text-align: left;
    height: 60px;

    @include default-clearfix();

    .cc-toggle-text {
      display: flex;
      align-items: center;
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      margin-left: 10px;

      span {
        margin-left: 5px;
      }
    }

    .cc-toggle-icon {
      cursor: pointer;

      &.cc-off {
        color: $cc-brand-color;
      }

      &.cc-disabled {
        display: none;
      }
    }

    .cc-switch {
      margin: 15px 10px;
      display: inline-block;
      float: right;
    }
  }
</style>
