/**
 * 获取视频预览图
 *
 * @param video {File} 目标视频
 * @param size 预览图尺寸
 * @param step 预览图数量
 * @returns {Promise<String>} 预览图
 */
export function getVideoPreview(video, size, step) {
    return new Promise(function (resolve) {
        let p = 0
        let videoElement = document.createElement("video")
        videoElement.src = URL.createObjectURL(video)
        videoElement.currentTime = 0.1
        let canvas = document.createElement("canvas")
        videoElement.addEventListener("loadeddata", () => {
            p = 0.2
            console.log(`${Math.floor(p*100)}%`)
            let width = size.width || videoElement.videoWidth,
                height = size.height || videoElement.videoHeight,
                videoTime = videoElement.duration,
                frameNum = Math.min(videoTime, step)
            canvas.width = width * Math.min(frameNum, 10)
            canvas.height = height * Math.floor(frameNum / 10);
            // console.log("canvas:")
            // console.log("   width: " + canvas.width);
            // console.log("   height: " + canvas.height)
            // console.log("frameNum: " + frameNum)
            let a = []
            for (let i = 0; i < frameNum; i++) {
                let v = document.createElement("video")
                v.src = videoElement.src
                v.currentTime = i * videoTime / frameNum + 0.1
                a[i] = v
                v.addEventListener("loadeddata", () => {
                    canvas.getContext("2d").drawImage(a[i], width * (i % 10), height * Math.floor(i / 10), width, height)
                    a[i] = null
                    p += 0.79 / step;
                    console.log(`${Math.floor(p*100)}%`)
                })
            }
            let interval = setInterval(() => {
                if (ArrIsNull(a)) {
                    p = 0.99
                    console.log(`${Math.floor(p*100)}%`)

                    window.clearInterval(interval)
                    // 导出格式为jpeg，图片质量为0.5
                    // 如果需要更清晰的预览图可以将参数改为 'image/png',1
                    let dataURL = canvas.toDataURL('image/jpeg',0.5)

                    p=1
                    console.log(`${Math.floor(p*100)}%`)
                    resolve(dataURL)
                }
            },50)
        })
    });
}

/**
 * 判断数组是否全为null
 *
 * @param arr {Array} 目标数组
 * @returns {boolean} 是否全为null
 */
function ArrIsNull(arr) {
    for (const arrElement of arr) {
        if (arrElement!=null) return false
    }
    return true
}