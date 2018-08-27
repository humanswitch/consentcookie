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
  <div class="cc-about">
    <cc-content-box>
      <div class="ccText" v-html="$t(configKeyAboutText)"/>
    </cc-content-box>
  </div>
</template>
<script>

  import * as constants from 'base/constants';
  import ccContentBox from 'components/general/ccContentBox';

  export default {
    name: 'AboutView',
    components: {
      ccContentBox,
    },
    data() {
      return {
        configKeyAboutText: constants.CONFIG_KEY_RESOURCES_ABOUT_TEXT,
      };
    },
    beforeMount() {
      this.$store.commit('updateView', { title: constants.CONFIG_KEY_RESOURCES_ABOUT_TITLE });
    },
  };
</script>

<style lang="scss">

  @import '../assets/scss/general-variables';

  .cc-about {

    min-width: 320px;

    .ccText {
      text-align: left;

      a {
        text-decoration: underline;
      }
    }

    .cc-intro,
    .cc-text1 {
      margin-bottom: 10px;
    }

    .cc-text2 .cc-sub {
      font-size: 12px;
    }
  }
</style>
