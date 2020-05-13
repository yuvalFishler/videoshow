var os = require('os')
var ffmpeg = require('fluent-ffmpeg')
var applyVideoOptions = require('./options').applyVideo

module.exports = merge

function merge(parts, output, options) {
  parts = parts.slice()
  var video = ffmpeg(parts.shift(), {timeout:  60* 1000})


  video.on("start", function (command) {
    setTimeout(() => {
      if (video && video.ffmpegProc) {
        video.ffmpegProc.stdin.write("q");
        console.error('too long for creating video')
      }
    }, 1000 * 10);
  })

  parts.forEach(function (part) {
    video.input(part)
  })

  if (options) {
    applyVideoOptions(video, options)
  }

  video.mergeToFile(output, os.tmpdir())


  return video
}
