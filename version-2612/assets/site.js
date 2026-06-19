(function () {
  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  function initCardFilter() {
    var input = document.querySelector('.card-filter');
    var list = document.querySelector('[data-card-list]');
    if (!input || !list) return;
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (query) input.value = query;
    function apply() {
      var value = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase() + ' ' +
          (card.getAttribute('data-title') || '').toLowerCase() + ' ' +
          (card.getAttribute('data-region') || '').toLowerCase() + ' ' +
          (card.getAttribute('data-type') || '').toLowerCase() + ' ' +
          (card.getAttribute('data-year') || '').toLowerCase();
        card.classList.toggle('is-hidden', value && text.indexOf(value) === -1);
      });
    }
    input.addEventListener('input', apply);
    apply();
  }

  window.initMoviePlayer = function (source) {
    var video = document.querySelector('.movie-video');
    var button = document.querySelector('.play-overlay');
    if (!video || !button || !source) return;
    var hlsInstance = null;
    function start() {
      button.classList.add('is-hidden');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.src) video.src = source;
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.play().catch(function () {});
        }
        return;
      }
      if (!video.src) video.src = source;
      video.play().catch(function () {});
    }
    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) start();
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    initHero();
    initCardFilter();
  });
})();
