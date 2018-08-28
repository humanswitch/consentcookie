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
  -->

<template>
  <div class="cc-application-group-summary">
    <cc-toggle v-model="showGroup" class="cc-toggle-text">
      <cc-img :img="groupIcon" :size="25" :unit="'px'" class="cc-group-icon"/>
      <div class="cc-group-info">
        <div class="cc-group-title">{{ title }}</div>
        <div class="cc-group-stats">{{group.getTotalCount()}} applicaties</div>
      </div>
    </cc-toggle>
    <cc-switch v-model="accepted" :disabled="disabled" :on-title="$t('general.on')" :off-title="$t('general.off')"/>
  </div>
</template>

<script>

  import _ from 'underscore';
  import * as constants from 'base/constants';

  import ccImg from 'components/general/ccImg';
  import ccToggle from 'components/general/ccToggle';
  import ccToggleIcon from 'components/general/ccToggleIcon';
  import ccSwitch from 'components/general/ccSwitch';

  // Public functions
  export default {
    name: 'cc-application-group-summary',
    components: {
      ccImg,
      ccToggle,
      ccToggleIcon,
      ccSwitch,
    },
    props: {
      group: {
        type: Object,
        required: true,
      },
      state: {
        type: Object,
        default: () => {
        },
      },
    },
    data() {
      return {};
    },
    computed: {
      showGroup: {
        get() {
          return this.state.showGroup;
        },
        set($newVal) {
          this.state.showGroup = $newVal;
        },
      },
      groupIcon() {
        return this.$services.applications.getGroupIcon(this.group.definition);
      },
      title() {
        return this.group.definition.name;
      },
      activeCount() {
        return !this.group ? null : _.chain(this.group.items)
          .map($application => this.$services.applications.isEnabled($application))
          .filter()
          .value().length;
      },
      accepted: {
        get() {
          return this.$services.applications.isEnabled(this.group.definition);
        },
        set($newVal) {
          this.$services.applications.setGroupAccepted(this.group, $newVal);
        },
      },
      disabled() {
        return this.$services.applications.isAlwaysOn(this.group.definition);
      },
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-application-group-summary {

    display: flex;
    align-items: center;
    position: relative;
    text-align: left;
    height: 60px;

    @include default-clearfix();

    .cc-group-icon {
      object-fit: contain;
      filter: opacity(0.6);
    }

    .cc-toggle-text {
      display: flex;
      align-items: center;
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      margin-left: 10px;

      .cc-group-info {
        margin-left: 10px;
      }

      .cc-group-stats {
        font-weight: 200;
        font-size: 11px;
        margin: 2px 0px;
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

    /deep/ .cc-switch {
      margin: 15px 10px;
      display: inline-block;
    }
  }
</style>
