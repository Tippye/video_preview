<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <VideoPreview :pre-img="require('./assets/1.png')" progress/>
    <HelloWorld @changeVideo="(v)=>{video=v}"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import VideoPreview from './components/video_preview'

export default {
  name: 'App',
  components: {
    HelloWorld,
    VideoPreview
  },
  data() {
    return {
      video: null
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
