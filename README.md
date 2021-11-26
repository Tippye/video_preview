# video_preview

本项目是使用vue开发的仿b站视频预览的组件

鼠标在组件区域内移动可以看到视频不同时间点的帧

## 安装
拷贝本项目中的`/src/components/video_preview`目录到自己的项目组件目录下

## 使用

在需要使用本插件的地方引入

如：
```html
<template>
  <div id="app">
    <VideoPreview :pre-img="require('./assets/1.png')" progress/>
  </div>
</template>
```
```javascript
<script>
import VideoPreview from './components/video_preview'
export default {
    components: {
        VideoPreview
    }
}
</script>
```

## 参数
| 参数     | 必填  | 默认值 | 类型    | 说明                                                         |
| -------- | ----- | ------ | ------- | ------------------------------------------------------------ |
| video    | false |        | File    | 要生成预览图的视频文件                                       |
| preImg   | false |        | String  | 预览图，与video传入一个即可，优先使用preImg。要传入的图片样式可以参考video生成的图片 |
| coverImg | false |        | String  | 封面图，鼠标不在预览图区域内时显示的图片                     |
| width    | false | 240    | Number  | 组件宽度                                                     |
| height   | false | 160    | Number  | 组件高度                                                     |
| step     | false | 100    | Number  | 预览图的张数，即鼠标从左滑倒右会有几帧                       |
| progress | false | false  | Boolean | 是否显示进度条                                               |