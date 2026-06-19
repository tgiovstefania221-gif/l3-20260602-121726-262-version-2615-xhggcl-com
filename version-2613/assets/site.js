(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startHero() {
            stopHero();
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function stopHero() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startHero();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startHero();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startHero();
            });
        }

        hero.addEventListener('mouseenter', stopHero);
        hero.addEventListener('mouseleave', startHero);
        showSlide(0);
        startHero();
    }

    var searchInput = document.querySelector('[data-search-input]');
    var clearSearch = document.querySelector('[data-clear-search]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    function filterCards() {
        if (!searchInput || !cards.length) {
            return;
        }

        var query = searchInput.value.trim().toLowerCase();
        var visible = 0;

        cards.forEach(function (card) {
            var text = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-category') || '',
                card.getAttribute('data-tags') || '',
                card.textContent || ''
            ].join(' ').toLowerCase();
            var matched = !query || text.indexOf(query) !== -1;

            card.classList.toggle('is-hidden-by-search', !matched);

            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }

    if (clearSearch && searchInput) {
        clearSearch.addEventListener('click', function () {
            searchInput.value = '';
            searchInput.focus();
            filterCards();
        });
    }

    window.initMoviePlayer = function (source) {
        var video = document.querySelector('[data-player-video]');
        var startButton = document.querySelector('[data-player-start]');
        var hls = null;
        var ready = false;

        if (!video || !source) {
            return;
        }

        function attachSource() {
            if (ready) {
                return;
            }

            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                return;
            }

            video.src = source;
        }

        function startPlayback() {
            attachSource();

            if (startButton) {
                startButton.classList.add('is-hidden');
            }

            video.setAttribute('controls', 'controls');
            var playTask = video.play();

            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {});
            }
        }

        if (startButton) {
            startButton.addEventListener('click', startPlayback);
        }

        video.addEventListener('click', function () {
            if (!ready) {
                startPlayback();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
