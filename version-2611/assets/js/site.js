(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector(".menu-toggle");
        var menu = document.querySelector(".mobile-nav");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            var expanded = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!expanded));
            menu.hidden = expanded;
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        var prev = hero.querySelector(".hero-prev");
        var next = hero.querySelector(".hero-next");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var search = scope.querySelector(".filter-search");
            var type = scope.querySelector(".filter-type");
            var year = scope.querySelector(".filter-year");
            var section = scope.nextElementSibling;
            if (!section) {
                return;
            }
            var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card"));

            function apply() {
                var query = search ? search.value.trim().toLowerCase() : "";
                var typeValue = type ? type.value.trim() : "";
                var yearValue = year ? year.value.trim() : "";
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags")
                    ].join(" ").toLowerCase();
                    var matchesQuery = !query || haystack.indexOf(query) !== -1;
                    var matchesType = !typeValue || (card.getAttribute("data-type") || "").indexOf(typeValue) !== -1;
                    var matchesYear = !yearValue || (card.getAttribute("data-year") || "").indexOf(yearValue) !== -1;
                    card.classList.toggle("is-hidden", !(matchesQuery && matchesType && matchesYear));
                });
            }

            [search, type, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");
            if (q && search) {
                search.value = q;
                apply();
            }
        });
    }

    function initPlayer(src) {
        var video = document.querySelector(".movie-video");
        var layer = document.querySelector(".play-layer");
        if (!video || !src) {
            return;
        }
        var attached = false;
        var hlsInstance = null;

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(src);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
            }
        }

        function play() {
            attach();
            video.controls = true;
            if (layer) {
                layer.classList.add("is-hidden");
            }
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {
                    if (layer) {
                        layer.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (layer) {
            layer.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            } else {
                video.pause();
            }
        });

        video.addEventListener("play", function () {
            if (layer) {
                layer.classList.add("is-hidden");
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });

    window.MoviePortal = {
        initPlayer: initPlayer
    };
})();
