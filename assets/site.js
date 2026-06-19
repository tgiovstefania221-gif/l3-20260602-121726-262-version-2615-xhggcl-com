(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  const searchInput = document.querySelector('[data-search-input]');
  const filterType = document.querySelector('[data-filter-type]');
  const filterRegion = document.querySelector('[data-filter-region]');
  const filterYear = document.querySelector('[data-filter-year]');
  const filterCategory = document.querySelector('[data-filter-category]');
  const resultCount = document.querySelector('[data-result-count]');
  const cards = Array.from(document.querySelectorAll('.movie-card'));

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    const query = normalize(searchInput ? searchInput.value : '');
    const type = normalize(filterType ? filterType.value : '');
    const region = normalize(filterRegion ? filterRegion.value : '');
    const year = normalize(filterYear ? filterYear.value : '');
    const category = normalize(filterCategory ? filterCategory.value : '');
    let visibleCount = 0;

    cards.forEach(function (card) {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.category,
        card.dataset.tags
      ].join(' '));

      const matchesQuery = !query || haystack.includes(query);
      const matchesType = !type || normalize(card.dataset.type).includes(type);
      const matchesRegion = !region || normalize(card.dataset.region).includes(region);
      const matchesYear = !year || normalize(card.dataset.year).includes(year);
      const matchesCategory = !category || normalize(card.dataset.category).includes(category);
      const isVisible = matchesQuery && matchesType && matchesRegion && matchesYear && matchesCategory;

      card.classList.toggle('hidden-by-filter', !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = '当前筛选结果：' + visibleCount + ' 部影片';
    }
  }

  [searchInput, filterType, filterRegion, filterYear, filterCategory].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  applyFilters();
})();
