(function () {
    var currentScript = document.currentScript;
    var scriptBase = currentScript ? new URL('.', currentScript.src).href : '';

    function loadHls() {
        if (window.location.protocol === 'file:') {
            return Promise.resolve(null);
        }
        return import(scriptBase + 'hls.js').then(function (module) {
            return module.H;
        }).catch(function () {
            return null;
        });
    }

    function showMessage(box, text) {
        if (!box) {
            return;
        }
        box.textContent = text;
        box.classList.add('is-visible');
    }

    function hideMessage(box) {
        if (!box) {
            return;
        }
        box.textContent = '';
        box.classList.remove('is-visible');
    }

    function startVideo(video, overlay, message, mp4Source) {
        hideMessage(message);
        var playTask = video.play();
        if (playTask && typeof playTask.catch === 'function') {
            playTask.catch(function () {
                if (mp4Source && video.src.indexOf(mp4Source) === -1) {
                    video.src = mp4Source;
                    video.load();
                    video.play().catch(function () {
                        showMessage(message, '当前线路暂时不可用');
                    });
                } else {
                    showMessage(message, '当前线路暂时不可用');
                }
            });
        }
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        video.setAttribute('controls', 'controls');
    }

    function initPlayer(root) {
        var video = root.querySelector('video');
        var overlay = root.querySelector('.player-start');
        var message = root.querySelector('[data-player-message]');
        var hlsSource = root.getAttribute('data-hls');
        var mp4Source = root.getAttribute('data-mp4');
        var hlsReady = false;

        if (!video) {
            return;
        }

        if (window.location.protocol === 'file:') {
            video.src = mp4Source;
        } else {
            loadHls().then(function (Hls) {
                if (Hls && Hls.isSupported() && hlsSource) {
                    var hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(hlsSource);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        hlsReady = true;
                    });
                    hls.on(Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal && mp4Source) {
                            video.src = mp4Source;
                            video.load();
                        }
                    });
                } else if (hlsSource && video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = hlsSource;
                    hlsReady = true;
                } else if (mp4Source) {
                    video.src = mp4Source;
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', function () {
                if (!video.src && mp4Source) {
                    video.src = mp4Source;
                    video.load();
                }
                startVideo(video, overlay, message, mp4Source);
            });
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startVideo(video, overlay, message, mp4Source);
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            hideMessage(message);
        });

        video.addEventListener('pause', function () {
            if (overlay && !video.ended) {
                overlay.classList.remove('is-hidden');
            }
        });

        window.setTimeout(function () {
            if (!hlsReady && !video.src && mp4Source) {
                video.src = mp4Source;
                video.load();
            }
        }, 1800);
    }

    document.querySelectorAll('[data-player]').forEach(initPlayer);
})();
