(function() {
  const body = document.body;
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      body.classList.toggle('menu-open');
    });

    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        body.classList.remove('menu-open');
      });
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let activeSlide = 0;
  let heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeSlide);
    });

    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeSlide);
    });
  }

  function startHero() {
    if (heroTimer) {
      clearInterval(heroTimer);
    }

    heroTimer = setInterval(function() {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showSlide(index);
      startHero();
    });
  });

  if (slides.length) {
    showSlide(0);
    startHero();
  }

  const filterForms = Array.from(document.querySelectorAll('[data-filter-area]'));

  filterForms.forEach(function(area) {
    const input = area.querySelector('[data-filter-input]');
    const year = area.querySelector('[data-filter-year]');
    const type = area.querySelector('[data-filter-type]');
    const cards = Array.from(area.querySelectorAll('[data-movie-card]'));

    function applyFilters() {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const yearValue = year ? year.value : '';
      const typeValue = type ? type.value : '';

      cards.forEach(function(card) {
        const text = (card.getAttribute('data-search') || '').toLowerCase();
        const cardYear = card.getAttribute('data-year') || '';
        const cardType = card.getAttribute('data-type') || '';
        const matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        const matchedYear = !yearValue || cardYear === yearValue;
        const matchedType = !typeValue || cardType === typeValue;

        card.classList.toggle('is-hidden-card', !(matchedKeyword && matchedYear && matchedType));
      });
    }

    [input, year, type].forEach(function(element) {
      if (element) {
        element.addEventListener('input', applyFilters);
        element.addEventListener('change', applyFilters);
      }
    });
  });
})();
