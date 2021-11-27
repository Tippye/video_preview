<template>
  <div>
    <div class="video_box" :style="boxStyle" @mouseenter="mouseenter" @mouseout="mouseout"
         @mousemove="mousemove">
      <img :src="coverImg" v-if="coverImg&&showCover" class="video_box-cover"
           :style="{width:`${width}px`,height:`${height}px`}">
      <div class="video_box-progress" v-if="progress">
        <div class="video_box-progress-content">
          <div class="video_box-progress-line" :style="{width:`${videoProgress}%`}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {getVideoPreview} from "@/components/video_preview/utils";

export default {
  name: "VideoPreview",
  props: {
    //要预览的视频文件
    video: {
      type: File,
      default: null
    },
    //预览图，与video共同存在时优先使用此值
    preImg: {
      type: String
    },
    //封面图
    coverImg: {
      type: String
    },
    //预览区域的宽度
    width: {
      type: [Number, String],
      default: 240
    },
    //预览区域的高度
    height: {
      type: [Number, String],
      default: 160
    },
    //数字越大，预览图片数量越多
    step: {
      type: Number,
      default: 100
    },
    //是否显示进度条
    progress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //video_box的样式
      boxStyle: {
        backgroundImage: null,
        width: this.width + 'px',
        height: this.height + 'px',
        backgroundPosition: null
      },
      //背景图中一行的图片数量
      lineSize: 10,
      // 当前鼠标所在位置进度
      videoProgress: 0,
      // 预览图
      preImage: null,
      // 显示封面
      showCover: true
    }
  },
  methods: {
    //鼠标进入图片区域
    mouseenter() {
      this.showCover = false
    },
    //鼠标移动
    mousemove(e) {
      if (e.offsetX < 0 || e.offsetX > this.width || e.offsetY < 0 || e.offsetY > this.height || !this.preImage) return
      this.videoProgress = Math.floor(e.offsetX * this.step / this.width);
    },
    //鼠标移出图片区域
    mouseout() {
      this.boxStyle.backgroundPosition = null
      this.showCover = true
    }
  },
  created() {
    if (this.preImg) this.preImage = this.preImg
  },
  watch: {
    // 将传入的图片作为预览图
    preImg(nVal) {
      this.preImage = nVal
    },
    // 将传入的视频制成预览图，传入preImg时不生效
    video(nVal) {
      if (this.preImg) return
      //设置加载中图片
      this.boxStyle.backgroundImage = `url(${require("./loading.gif")})`
      getVideoPreview(nVal, {width: this.width, height: this.height}, this.step).then(res => {
        this.preImage = res
      })
    },
    // 将预览图设置到video_box的样式中
    preImage(nVal) {
      this.boxStyle.backgroundImage = `url(${nVal})`
    },
    // 鼠标所在位置进度改变后更改图片
    videoProgress(nVal) {
      this.boxStyle.backgroundPosition = `${-nVal % this.lineSize * this.width}px ${-Math.floor(nVal / this.lineSize) * this.height}px`;
    }
  }
}
</script>

<style scoped>
.video_box {
  border: 1px solid #2c3e50;
  margin: 100px auto;
  background-repeat: no-repeat;
  position: relative;
}

.video_box-cover,
.video_box-progress {
  position: absolute;
  top: 0;
  left: 0;
}

.video_box-progress {
  width: 100%;
  background: rgba(0, 0, 0, .6);
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video_box-progress-content {
  width: 90%;
  height: 2px;
  border-radius: 1px;
  background: rgba(255, 255, 255, .2);
  overflow: hidden;
}

.video_box-progress-line {
  height: 2px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 1);
}
</style>