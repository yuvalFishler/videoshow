var ffmpeg = require('fluent-ffmpeg')
var options = require('./options')

module.exports = video

function video(image, params, output) {
  var video = ffmpeg(image.path)
  params = options.define(params)

  if (image.loop) {
    params.loop = image.loop
  }

  options.applyVideo(video, params)

  if (image.filters) {
    video.videoFilters(image.filters)
  }

  if ((params.transition && image.transition !== false) || image.transition) {
    video.videoFilters(transitionFilter(image, params))
  }

  video.on("start", function (command) {
    setTimeout(() => {
      if (video && video.ffmpegProc) {
        video.ffmpegProc.stdin.write("q");
        console.error('too long for creating video')
      }
    }, 1000 * 10);
  })

  video.save(output)

  return video
}

function transitionFilter(image, params) {
  var options = []
  var duration = image.transitionDuration || params.transitionDuration
  var color = image.transitionColor || params.transitionColor
  var loop = image.loop || params.loop

  if (!image.disableFadeIn) {
    options.push('fade=t=in:st=0:d=' + duration + ':color=' + color)
  }

  if (!image.disableFadeOut) {
    options.push('fade=out:st=' + (loop - duration) + ':d=' + duration + ':color=' + color)
  }

  return options
}
