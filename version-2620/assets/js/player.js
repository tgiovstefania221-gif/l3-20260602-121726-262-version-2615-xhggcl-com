(function () {
  function setupPlayer(box) {
    var video = box.querySelector('video');
    var layer = box.querySelector('.play-layer');
    var stream = box.getAttribute('data-stream');
    var ready = false;
    function load() {
      if (!video || !stream) return;
      if (!ready) {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else {
          video.src = stream;
        }
        ready = true;
      }
      if (layer) {
        layer.style.display = 'none';
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }
    if (layer) {
      layer.addEventListener('click', load);
    }
    box.addEventListener('click', function (event) {
      if (event.target === video) return;
      load();
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
  });
})();
