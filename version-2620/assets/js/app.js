(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }
  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }
  var toggle = qs('[data-menu-toggle]');
  var mobile = qs('[data-mobile-nav]');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('is-open');
    });
  }
  var header = qs('[data-header]');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });
  }
  var hero = qs('[data-hero]');
  if (hero) {
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var index = 0;
    var timer;
    function show(next) {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    function start() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5000);
    }
    var nextBtn = qs('[data-hero-next]', hero);
    var prevBtn = qs('[data-hero-prev]', hero);
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
        start();
      });
    });
    start();
  }
  function normalize(value) {
    return (value || '').toString().toLowerCase().replace(/\s+/g, '');
  }
  var searchInput = qs('[data-search-input]');
  var typeFilter = qs('[data-filter-type]');
  var scope = qs('[data-search-scope]');
  if (searchInput && scope) {
    var cards = qsa('[data-card]', scope);
    var runFilter = function () {
      var keyword = normalize(searchInput.value);
      var type = typeFilter ? normalize(typeFilter.value) : '';
      cards.forEach(function (card) {
        var text = normalize(card.textContent + ' ' + card.getAttribute('data-title') + ' ' + card.getAttribute('data-year') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-genre'));
        var cardType = normalize(card.getAttribute('data-type'));
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchType = !type || cardType === type;
        card.classList.toggle('is-hidden', !(matchKeyword && matchType));
      });
    };
    searchInput.addEventListener('input', runFilter);
    if (typeFilter) {
      typeFilter.addEventListener('change', runFilter);
    }
  }
})();
