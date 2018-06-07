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
  <div class="cc-video">
    <video :src="videoUrl" width="100%" height="100%"
           @ended="onEnded" preload/>
    <div :class="['cc-video-toggle',{'cc-begin':isEnded,'cc-playing':isPlaying,'cc-paused':isPaused,'cc-hover':isHover}]" @click="toggleVideo" @mouseleave="resetHover">
      <i :class="['v-centered',{'cc-pause-circle':(isPlaying && !isEnded),'cc-play-circle':!isPlaying || (isPlaying && isEnded)}]" aria-hidden="true"/>
    </div>
  </div>
</template>
<script>

  let videoPlayer;
  let videoHoverFixTimer;

  export default {
    name: 'ccVideo',
    props: {
      videoUrl: String,
    },
    data() {
      return {
        isPlaying: false,
        isPaused: false,
        isEnded: true,
        isHover: true,
      };
    },
    methods: {
      toggleVideo() {
        if (videoPlayer.paused === false) {
          videoPlayer.pause();
          this.isPaused = true;
          this.isPlaying = false;
          this.resetHover();
        } else {
          videoPlayer.play();
          this.isPlaying = true;
          this.isPaused = false;
          this.isEnded = false;

          // Remove the hover state temporarily
          const self = this;
          videoHoverFixTimer = setTimeout(() => {
            self.$nextTick(() => {
              this.isHover = false;
            });
          }, 1000);
        }
      },
      onEnded() {
        this.isEnded = true;
        this.isPaused = false;
        this.isPlaying = false;
      },
      resetHover() {
        if (videoHoverFixTimer) {
          clearTimeout(videoHoverFixTimer);
        }
      },
    },
    mounted() {
      this.$nextTick(function () {
        videoPlayer = this.$el.querySelector('video');
      });
    },
  };
</script>

<style lang="scss">

  @import '../../assets/scss/general-variables';

  .cc-video {

    position: relative;
    width: 100%;
    height: 100%;

    @include default-vertical-center-helper();

    .cc-video-toggle {
      transition: all 0.2s;
      background: none;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      &.cc-inline-fix {
        font: 0/0 a;
      }

      i {
        display: none !important;
        font-size: 40px;
      }

      &.cc-hover:hover {
        background: rgba(255, 255, 255, 0.7);
      }

      &.cc-begin {

        i {
          display: inline-block !important;
        }
      }

      &.cc-playing.cc-hover:hover, &.cc-paused.cc-hover:hover {
        i {
          display: inline-block !important;
        }
      }
    }
  }
</style>
