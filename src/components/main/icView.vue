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
  <div id="icView">
    <div class="icViewWrapper">
      <transition enter-active-class="icAnimated icSlideInRight" leave-active-class="icAnimated icSlideOutRight">
        <div v-show="isShown" :style="viewHolderCss" class="viewHolder">
          <ic-view-header :height="headerHeight" :style="{minWidth:'350px'}"/>
          <ic-view-content :style="viewContentCss" :class="phoneLandscape">
            <router-view/>
          </ic-view-content>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>

  // Dependencies
  const _ = require('underscore');

  // Components
  const icViewHeader = require('components/main/icViewHeader.vue');
  const icViewContent = require('components/main/icViewContent.vue');

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
      return false;
    }

    // calculate the max height
    data.viewMaxHeight = getMaxHeight();
    data.viewHolderCss.maxHeight = data.viewMaxHeight + 'px';
  }

  function calHeight(height) {
    if (!_.isNumber(height)) {
      return false;
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
  module.exports = {
    name: 'icView',
    components: {
      icViewHeader,
      icViewContent,
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
        return this.$store.state.view.isPhone && !this.$store.state.view.isPortrait ? 'phoneLandscape' : '';
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

  /* Take in account the overflow hidden on the right side */
  $menu-drop-shadow: -5px 5px 10px 0px rgba(136, 136, 136, 0.15);

  #icView {
    position: relative;

    .icViewWrapper {
      position: absolute;
      right: 0px;
      bottom: 0px;
      padding: 0px 0px 15px 15px;
      overflow: hidden;

      .phone & {
        padding: 0px 5px 5px 5px;

        .phoneLandscape {
          height: 100% !important;
        }
      }

      .viewHolder {
        border-radius: $ic-box-border-radius;
        box-shadow: $menu-drop-shadow;
        overflow: hidden;
      }
    }
  }
</style>
