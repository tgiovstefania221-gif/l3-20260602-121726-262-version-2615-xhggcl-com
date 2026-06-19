(function () {
  function setStatus(card, message) {
    const status = card.querySelector('[data-player-status]');
    if (status) {
      status.textContent = message;
    }
  }

  function attachPlayer(card) {
    const button = card.querySelector('[data-play-button]');
    const video = card.querySelector('video');

    if (!button || !video) {
      return;
    }

    button.addEventListener('click', function () {
      const source = button.getAttribute('data-video-src');

      if (!source) {
        setStatus(card, '当前影片暂未配置视频');
        return;
      }

      card.classList.add('playing');
      setStatus(card, '正在加载视频');

      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {
            setStatus(card, '点击播放器继续播放');
          });
        });
        hls.on(window.Hls.Events.ERROR, function () {
          setStatus(card, '视频加载异常，请稍后重试');
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          video.play().catch(function () {
            setStatus(card, '点击播放器继续播放');
          });
        }, { once: true });
      } else {
        video.src = source;
        video.play().catch(function () {
          setStatus(card, '当前浏览器需要 HLS 支持');
        });
      }
    });
  }

  document.querySelectorAll('[data-player-card]').forEach(attachPlayer);
})();
