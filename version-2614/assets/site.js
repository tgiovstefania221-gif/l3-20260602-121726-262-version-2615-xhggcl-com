(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    initMobileMenu();
    initCarousel();
    initFilters();
    initPlayer();
    applySearchQueryToLibrary();
  });

  function initMobileMenu() {
    var button = document.querySelector(".mobile-menu-button");
    var nav = document.querySelector(".site-nav");

    if (!button || !nav) {
      return;
    }

    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initCarousel() {
    var carousel = document.querySelector("[data-carousel]");

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-dot]"));
    var prev = carousel.querySelector("[data-carousel-prev]");
    var next = carousel.querySelector("[data-carousel-next]");
    var index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-carousel-dot") || 0));
      });
    });

    show(0);
    window.setInterval(function () {
      show(index + 1);
    }, 5000);
  }

  function initFilters() {
    var panel = document.querySelector("[data-filter-panel]");
    var grid = document.querySelector("[data-filter-grid]");

    if (!panel || !grid) {
      return;
    }

    var search = panel.querySelector("[data-filter-search]");
    var type = panel.querySelector("[data-filter-type]");
    var region = panel.querySelector("[data-filter-region]");
    var year = panel.querySelector("[data-filter-year]");
    var count = panel.querySelector("[data-filter-count]");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function apply() {
      var q = normalize(search && search.value);
      var t = normalize(type && type.value);
      var r = normalize(region && region.value);
      var y = normalize(year && year.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.textContent + " " + card.getAttribute("data-title") + " " + card.getAttribute("data-genre"));
        var cardType = normalize(card.getAttribute("data-type"));
        var cardRegion = normalize(card.getAttribute("data-region"));
        var cardYear = normalize(card.getAttribute("data-year"));
        var ok = true;

        if (q && haystack.indexOf(q) === -1) {
          ok = false;
        }

        if (t && cardType !== t) {
          ok = false;
        }

        if (r && cardRegion !== r) {
          ok = false;
        }

        if (y && cardYear !== y) {
          ok = false;
        }

        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = visible + " 部";
      }
    }

    [search, type, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    apply();
  }

  function applySearchQueryToLibrary() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    var input = document.querySelector("[data-filter-search]");

    if (q && input) {
      input.value = q;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function initPlayer() {
    var video = document.getElementById("movie-player");
    var button = document.getElementById("play-button");

    if (!video || !button) {
      return;
    }

    var source = video.getAttribute("data-src");
    var hlsInstance = null;

    function attachSource() {
      if (!source || video.getAttribute("data-ready") === "true") {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }

      video.setAttribute("data-ready", "true");
    }

    button.addEventListener("click", function () {
      attachSource();
      button.classList.add("is-hidden");
      video.play().catch(function () {
        button.classList.remove("is-hidden");
      });
    });

    video.addEventListener("play", function () {
      button.classList.add("is-hidden");
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        button.classList.remove("is-hidden");
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
