(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('img[data-cover]').forEach(function (image) {
        image.addEventListener('error', function () {
            image.remove();
        });
    });

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function show(index) {
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

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-filter-input]');
        var list = document.querySelector('[data-filter-list]');
        var empty = document.querySelector('[data-empty-state]');
        var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-button]'));
        var activeButtonValue = '';

        if (!list) {
            return;
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilter() {
            var query = normalize(input ? input.value : '');
            var buttonValue = normalize(activeButtonValue);
            var cards = Array.prototype.slice.call(list.querySelectorAll('[data-filter-text]'));
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-filter-text'));
                var matchedQuery = !query || text.indexOf(query) !== -1;
                var matchedButton = !buttonValue || text.indexOf(buttonValue) !== -1;
                var shouldShow = matchedQuery && matchedButton;
                card.style.display = shouldShow ? '' : 'none';
                if (shouldShow) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (item) {
                    item.classList.remove('active');
                });
                button.classList.add('active');
                activeButtonValue = button.getAttribute('data-filter-button') || '';
                applyFilter();
            });
        });

        var params = new URLSearchParams(window.location.search);
        var keyword = params.get('q');
        if (keyword && input) {
            input.value = keyword;
        }

        var largeFormInput = document.querySelector('[data-search-page-form] input[name="q"]');
        if (largeFormInput && keyword) {
            largeFormInput.value = keyword;
        }

        applyFilter();
    });
})();
