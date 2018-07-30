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
  <div class="cc-view">
    <div class="cc-view-wrapper">
      <transition enter-active-class="ccAnimated ccSlideIn" leave-active-class="ccAnimated ccSlideOut">
        <div v-show="isShown" :style="viewHolderCss" class="cc-viewholder">
          <cc-view-header :height="headerHeight" :style="{minWidth:'350px'}"/>
          <cc-view-content :style="viewContentCss" :class="phoneLandscape">
            <router-view/>
          </cc-view-content>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>

  // Dependencies
  import _ from 'underscore';

  // Components
  import ccViewHeader from 'components/main/ccViewHeader';
  import ccViewContent from 'components/main/ccViewContent';

  // Defaults
  const DEFAULT_VIEW_TOP_MARGIN = 30;
  const DEFAULT_MAX_HEIGHT = 'inherit';
  const DEFAULT_HEADER_HEIGHT = 56;
  const DEFAULT_VIEW_WINDOW_OFFSET = 5;

  let vueInstance = null;
  let viewElement = null;
  let viewWrapperElement = null;

  const data = {
    headerHeight: DEFAULT_HEADER_HEIGHT,
    viewContentCss: {
      height: 'calc(100% - ' + DEFAULT_HEADER_HEIGHT + 'px)',
    },
    viewHolderCss: {
      height: DEFAULT_MAX_HEIGHT,
      maxHeight: DEFAULT_MAX_HEIGHT,
      width: null,
      maxWidth: null,
    },
  };

  // Private function
  function getMaxHeight() {
    const icViewBottom = viewElement.getBoundingClientRect().bottom;
    return icViewBottom - DEFAULT_VIEW_TOP_MARGIN;
  }

  function calcMaxHeight() {
    if (!viewElement) {
      return;
    }

    // calculate the max height
    data.viewMaxHeight = getMaxHeight();
    data.viewHolderCss.maxHeight = data.viewMaxHeight + 'px';
  }

  function calHeight(height) {
    if (!_.isNumber(height)) {
      return;
    }

    const maxHeight = getMaxHeight();
    const maxContentHeight = maxHeight - DEFAULT_HEADER_HEIGHT;

    data.viewHolderCss.height = (height < maxContentHeight) ? 'inherit' : maxHeight + 'px';
  }

  function calcPhoneDimensions() {
    const width = vueInstance.$store.state.view.isPhone ? (vueInstance.$services.view.getWindowWidth() - (2 * DEFAULT_VIEW_WINDOW_OFFSET)) + 'px' : null;
    data.viewHolderCss.width = width;
    data.viewHolderCss.maxWidth = width;
  }

  function updateDimensions() {
    calcMaxHeight();
    calHeight(vueInstance.$store.state.view.content.size);
    calcPhoneDimensions();
  }

  /* VUE */
  export default {
    name: 'ccView',
    components: {
      ccViewHeader,
      ccViewContent,
    },
    data() {
      return data;
    },
    computed: {
      isShown() {
        return this.$store.state.application.state.contentOpen;
      },
      height() {
        return this.$store.state.view.content.size;
      },
      phoneLandscape() {
        return this.$store.state.view.isPhone && !this.$store.state.view.isPortrait ? 'cc-phonelandscape' : '';
      },
    },
    watch: {
      height(newval) {
        calHeight(newval);
      },
    },
    mounted() {
      // Set reference to vue instance
      vueInstance = this;

      // Set reference to the DOM elements
      viewElement = this.$el;
      viewWrapperElement = viewElement.firstChild;

      // Calc the optimal sizes
      updateDimensions();

      this.$services.view.onResize(updateDimensions);
    },
  };
</script>

<style lang="scss" scoped>

  @import '../../assets/scss/general-variables';

  .cc-view {
    position: relative;

    .cc-view-wrapper {
      position: absolute;
      right: 0px;
      bottom: 0px;
      padding: 0px 0px 15px 15px;
      overflow: hidden;

      .cc-phone & {
        padding: 0px 5px 5px 5px;

        .cc-phonelandscape {
          height: 100% !important;
        }
      }

      #ConsentCookie.cc-left & {
        right: auto;
        left: 0px;
        padding: 0px 15px 15px 0px;
      }

      #ConsentCookie.cc-left.cc-phone & {
        padding: 0px 5px 5px 5px;
      }

      .cc-viewholder {
        border-radius: $cc-box-border-radius;
        box-shadow: -5px 5px 10px 0px rgba(136, 136, 136, 0.15);
        overflow: hidden;

        #ConsentCookie.cc-left & {
          box-shadow: -5px 0px 10px 5px rgba(136, 136, 136, 0.15);
        }
      }
    }
  }
</style>
