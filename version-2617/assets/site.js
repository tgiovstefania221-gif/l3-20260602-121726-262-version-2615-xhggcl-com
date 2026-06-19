(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-site-nav]");
  var search = document.querySelector("[data-header-search]");

  if (menuButton && nav && search) {
    menuButton.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      search.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("img").forEach(function (image) {
    function markMissing() {
      image.classList.add("is-missing");
    }

    image.addEventListener("error", markMissing);

    if (image.complete && image.naturalWidth === 0) {
      markMissing();
    }
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5600);
  }

  var filterInput = document.querySelector("[data-filter-input]");
  var typeSelect = document.querySelector("[data-type-filter]");
  var sortSelect = document.querySelector("[data-sort-select]");
  var cardsGrid = document.querySelector("[data-card-grid]");

  function applyCards() {
    if (!cardsGrid) {
      return;
    }

    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
    var typeValue = typeSelect ? typeSelect.value : "all";
    var cards = Array.prototype.slice.call(cardsGrid.querySelectorAll("[data-movie-card]"));

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute("data-title"),
        card.getAttribute("data-tags"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-year")
      ].join(" ").toLowerCase();

      var typeOk = typeValue === "all" || card.getAttribute("data-type") === typeValue;
      var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;

      card.style.display = typeOk && keywordOk ? "" : "none";
    });

    if (sortSelect) {
      var sortValue = sortSelect.value;
      var sorted = cards.slice().sort(function (a, b) {
        if (sortValue === "year-asc") {
          return Number(a.getAttribute("data-year")) - Number(b.getAttribute("data-year"));
        }

        if (sortValue === "title") {
          return a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"), "zh-Hans-CN");
        }

        return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
      });

      sorted.forEach(function (card) {
        cardsGrid.appendChild(card);
      });
    }
  }

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query) {
      filterInput.value = query;
    }

    filterInput.addEventListener("input", applyCards);
  }

  if (typeSelect) {
    typeSelect.addEventListener("change", applyCards);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", applyCards);
  }

  applyCards();

  var video = document.querySelector("video[data-src]");
  var playButton = document.querySelector("[data-play-button]");
  var playerReady = false;

  function preparePlayer() {
    if (!video || playerReady) {
      return;
    }

    var source = video.getAttribute("data-src");

    if (!source) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      playerReady = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      playerReady = true;
    }
  }

  function startPlayer() {
    if (!video) {
      return;
    }

    preparePlayer();

    var playAttempt = video.play();

    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(function () {});
    }

    if (playButton) {
      playButton.classList.add("is-hidden");
    }
  }

  if (video) {
    video.addEventListener("click", startPlayer);
    video.addEventListener("play", function () {
      if (playButton) {
        playButton.classList.add("is-hidden");
      }
    });
    video.addEventListener("pause", function () {
      if (playButton) {
        playButton.classList.remove("is-hidden");
      }
    });
  }

  if (playButton) {
    playButton.addEventListener("click", startPlayer);
  }
})();
