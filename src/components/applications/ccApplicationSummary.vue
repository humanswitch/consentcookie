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
    <cc-toggle class="cc-toggle-text" v-model="showInfo">
      <cc-img class="cc-app-logo" :img="logo" />
      <div class="cc-app-head">
        <span>{{ application.name }}</span>
        <div class="cc-app-stats">
          <span v-if="dataProcessings.length">{{dataProcessings.length}} {{ $t('applications.' + (dataProcessings.length > 1 ? 'dataprocessings' : 'dataprocessing')) }}</span>
          <span v-if="!dataProcessings.length" v-t="'applications.noDataprocessingsAvailable'" />
        </div>
      </div>
    </cc-toggle>
    <slot name="content">
      <cc-toggle-icon v-theme="{color:'primary'}" :icon="'cc-user'" v-model="showInfo" :disabled="!hasPlugin" :size="20"/>
      <cc-switch v-if="showSwitch" v-model="accepted" :disabled="disabled" :on-title="$t('general.on')" :off-title="$t('general.off')" :disabled-text-on="$t('applications.applicationDisabledOn')" />
    </slot>
  </div>
</template>

<script>
  import ccImg from 'components/general/ccImg';
  import ccToggle from 'components/general/ccToggle';
  import ccToggleIcon from 'components/general/ccToggleIcon';
  import ccSwitch from 'components/general/ccSwitch';

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
      group: {
        type: Object,
        required: false,
      },
      state: {
        type: Object,
        default: () => Object(),
      },
      showSwitch: {
        type: Boolean,
        default: true
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
        },
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
      },
      dataProcessings() {
        return this.$services.applications.getDataProcessings(this.application, this.group ? this.group.definition.id : undefined);
      },      
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
      font-weight: 600;
      margin-left: 10px;

      .cc-app-logo {
        width: 20px;
        height: 20px;
      }

      .cc-app-head {
        margin-left: 10px;
      }

      span {
        font-size: 14px;
      }

      .cc-app-stats span {
        font-weight: 200;
        font-size: 11px;
        text-decoration: underline;
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
    }
  }
</style>
