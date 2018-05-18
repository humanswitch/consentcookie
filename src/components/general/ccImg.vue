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
  <img :style="{width:imgWidth,height:imgHeight}" :src="img" class="cc-img">
</template>

<script>
  module.exports = {
    name: 'cc-img',
    props: {
      size: {
        type: Number,
        require: false,
        default: null,
      },
      width: {
        type: Number,
        require: false,
      },
      height: {
        type: Number,
        require: false,
      },
      unit: {
        type: String,
        default: 'px',
      },
      img: {
        type: String,
        require: true,
      },
    },
    computed: {
      imgWidth() {
        return (this.size != null ? this.size : this.width) + this.unit;
      },
      imgHeight() {
        return (this.size != null ? this.size : this.height) + this.unit;
      },
    },
  };
</script>
