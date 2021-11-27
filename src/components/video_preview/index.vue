<template>
  <div>
    <div class="video_box" :style="boxStyle" :class="boxClass" @mouseenter="mouseenter" @mouseout="mouseout"
         @mousemove="mousemove" @touchstart.prevent="touchstart" @touchmove.prevent="touchmove"
         @touchend="touchend">
      <img :src="coverImg" v-if="coverImg&&showCover" class="video_box-cover"
           :style="{width:`${width}px`,height:`${height}px`}">
      <div class="video_box-progress" v-if="progress">
        <div class="video_box-progress-content">
          <div class="video_box-progress-line" :style="{width:`${videoProgress}%`}"></div>
        </div>
      </div>
      <img src="./noPreview.png" alt="未上传预览图或视频" class="err" v-if="!preImage">
      <div v-if="loading" class="video_box-loading"></div>
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
        backgroundPosition: null,
        transition: null,
        transform: null,
        zIndex: null
      },
      boxClass: [],
      //背景图中一行的图片数量
      lineSize: 10,
      // 当前鼠标所在位置进度
      videoProgress: 0,
      // 预览图
      preImage: null,
      // 显示封面
      showCover: true,
      // 动画用计时器
      animateTimeout: null,
      loading: false
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
    },
    //移动端手指按下
    touchstart() {
      this.boxStyle.transition = '100ms transform ease-out';
      this.boxStyle.transform = 'scale(0.95)';
      this.boxStyle.zIndex = '999999999999999999'
      this.animateTimeout = setTimeout(() => {
        //长按后放大1.5倍，方便移动端查看
        //如需修改此倍率，须同时修改125行（touchend方法中第二个判断条件）、227行（关键帧动画0%时的缩放，三个值都要修改）
        this.boxStyle.transform = 'scale(1.5)'
      }, 500)
      this.mouseenter()
    },
    //移动端手指移动
    touchmove(e) {
      let x = e.touches[0].pageX - e.target.offsetLeft,
          y = e.touches[0].pageY - e.target.offsetTop
      if (x < 0 || x > this.width || y < 0 || y > this.height || !this.preImage) return
      this.videoProgress = Math.floor(x * this.step / this.width);
    },
    //移动端手指松开
    touchend() {
      window.clearTimeout(this.animateTimeout)
      if (this.boxStyle.transform === 'scale(0.95)') {
        this.boxStyle.transform = null
        this.boxStyle.transition = null
      } else if (this.boxStyle.transform === 'scale(1.5)') {
        this.boxStyle.transition = null
        this.boxStyle.transform = null
        this.boxClass.push("bounce")
        setTimeout(() => {
          this.boxClass = []
        }, 750)
      }
      this.boxStyle.zIndex = null
      this.mouseout()
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
      this.loading = true
      getVideoPreview(nVal, {width: this.width, height: this.height}, this.step).then(res => {
        this.loading = false
        this.preImage = res
      });
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
  margin: 0 auto;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 5px;
  cursor: pointer;
}

.video_box-cover,
.video_box-progress,
.video_box-loading,
.err {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.video_box-loading {
  background-image: url("loading.gif");
  background-position: center;
  background-repeat: no-repeat;
}

.video_box-progress {
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

@keyframes bounce {
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    transform: scale3d(1.5, 1.5, 1.5);
  }

  20% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  40% {
    transform: scale3d(1.05, 1.05, 1.05);
  }

  60% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  80% {
    transform: scale3d(1.03, 1.03, 1.03);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}

.bounce {
  animation: 750ms bounce;
}
</style>